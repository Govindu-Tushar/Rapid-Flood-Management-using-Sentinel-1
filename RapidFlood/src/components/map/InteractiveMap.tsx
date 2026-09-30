import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers as LayersIcon,
  Info,
  Sliders,
  Sparkles,
  Radio,
} from "lucide-react";
import { AnalysisResults, MapLayerVisibility } from "../../types";
import { LayerTogglePanel } from "./LayerTogglePanel";
import { MapLegend } from "./MapLegend";

interface InteractiveMapProps {
  results: AnalysisResults;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  results,
  className = "h-[600px] w-full",
  showControls = true,
  compact = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [layers, setLayers] = useState<MapLayerVisibility>({
    baseMap: "dark",
    preFlood: false,
    postFlood: false,
    floodExtent: true,
    permanentWater: true,
    roads: true,
    settlements: true,
    agriculture: true,
    priorityZones: true,
  });

  const [floodOpacity, setFloodOpacity] = useState<number>(0.75);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(!compact);
  const [showLegend, setShowLegend] = useState<boolean>(!compact);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { center, zoom } = results.location;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: !compact,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add scale control
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    // Initialize layer groups
    layerGroupsRef.current = {
      baseTile: L.layerGroup().addTo(map),
      permanentWater: L.layerGroup().addTo(map),
      floodExtent: L.layerGroup().addTo(map),
      agriculture: L.layerGroup().addTo(map),
      priorityZones: L.layerGroup().addTo(map),
      roads: L.layerGroup().addTo(map),
      settlements: L.layerGroup().addTo(map),
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [results.location.id]);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current.baseTile) return;

    layerGroupsRef.current.baseTile.clearLayers();

    let tileUrl =
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    let maxZoom = 19;

    if (layers.baseMap === "satellite") {
      tileUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      maxZoom = 18;
    } else if (layers.baseMap === "street") {
      tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: "abcd",
    });

    layerGroupsRef.current.baseTile.addLayer(tileLayer);
  }, [layers.baseMap]);

  // Render & Update GeoJSON Vector Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !results.geojson) return;

    const lg = layerGroupsRef.current;
    if (!lg.floodExtent) return;

    // 1. Permanent Water
    lg.permanentWater.clearLayers();
    if (layers.permanentWater && results.geojson.permanentWater) {
      const permLayer = L.geoJSON(results.geojson.permanentWater, {
        style: {
          color: "#0284c7",
          weight: 1.5,
          fillColor: "#0369a1",
          fillOpacity: 0.85,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div class="text-xs font-mono space-y-1">
              <strong class="text-sky-400 font-bold block mb-1">PERMANENT SURFACE WATER</strong>
              <div class="text-slate-300">Channel: ${feature.properties.name || "River Basin"}</div>
              <div class="text-slate-400 text-[10px]">Baseline: JRC Global Surface Water (Seasonality &gt;= 10mo)</div>
            </div>
          `);
        },
      });
      lg.permanentWater.addLayer(permLayer);
    }

    // 2. Flood Extent Inundation Layer (Electric Cyan with Glow)
    lg.floodExtent.clearLayers();
    if (layers.floodExtent && results.geojson.floodExtent) {
      const floodLayer = L.geoJSON(results.geojson.floodExtent, {
        style: () => ({
          color: "#22d3ee",
          weight: 2,
          dashArray: "3, 4",
          fillColor: "#06b6d4",
          fillOpacity: floodOpacity,
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div class="text-xs font-mono space-y-1.5 p-1">
              <div class="flex items-center gap-1.5 font-bold text-cyan-electric">
                <span class="w-2 h-2 rounded-full bg-cyan-electric animate-ping"></span>
                NEWLY INUNDATED PIXEL CLUSTER
              </div>
              <div class="text-slate-200">Backscatter Drop: <strong class="text-cyan-electric">${feature.properties.deltaDb}</strong></div>
              <div class="text-slate-300">Confidence: <strong>${feature.properties.waterConfidence}</strong></div>
              <div class="text-slate-300">Est. Depth: <strong class="text-amber-400">${feature.properties.floodDepthEst}</strong></div>
              <div class="text-slate-500 text-[10px] pt-1 border-t border-space-800">Copernicus Sentinel-1 C-SAR IW 10m</div>
            </div>
          `);
        },
      });
      lg.floodExtent.addLayer(floodLayer);
    }

    // 3. Priority Decision Zones
    lg.priorityZones.clearLayers();
    if (layers.priorityZones && results.geojson.priorityZones) {
      const pzLayer = L.geoJSON(results.geojson.priorityZones, {
        style: (feature) => ({
          color: feature?.properties?.color || "#ef4444",
          weight: 2.5,
          dashArray: "5, 5",
          fillColor: feature?.properties?.color || "#ef4444",
          fillOpacity: 0.22,
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div class="text-xs font-mono space-y-1.5 p-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                feature.properties.priorityLevel === "High Priority"
                  ? "bg-status-emergency/20 text-rose-300 border border-status-emergency/40"
                  : "bg-status-amber/20 text-amber-300 border border-status-amber/40"
              }">
                ${feature.properties.priorityLevel}
              </span>
              <div class="font-bold text-white text-sm mt-1">${feature.properties.zoneName}</div>
              <div class="text-cyan-electric">Decision Score: <strong>${feature.properties.priorityScore} / 100</strong></div>
              <p class="text-slate-400 text-[11px] font-sans pt-1 border-t border-space-800">
                Spatial overlay: Inundation area, severed highway corridors, and residential dwelling density.
              </p>
            </div>
          `);
        },
      });
      lg.priorityZones.addLayer(pzLayer);
    }

    // 4. Agricultural Land
    lg.agriculture.clearLayers();
    if (layers.agriculture && results.geojson.agriculture) {
      const agriLayer = L.geoJSON(results.geojson.agriculture, {
        style: {
          color: "#22c55e",
          weight: 1.5,
          dashArray: "4, 4",
          fillColor: "#22c55e",
          fillOpacity: 0.25,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div class="text-xs font-mono space-y-1 p-1">
              <strong class="text-emerald-400 block font-bold">AGRICULTURAL PARCEL INUNDATED</strong>
              <div class="text-slate-300">Crop: <strong>${feature.properties.cropType}</strong></div>
              <div class="text-slate-300">Status: <strong class="text-amber-400">${feature.properties.floodedStatus}</strong></div>
              <div class="text-slate-300">Loss Risk: <strong class="text-rose-400">${feature.properties.lossRisk}</strong></div>
            </div>
          `);
        },
      });
      lg.agriculture.addLayer(agriLayer);
    }

    // 5. Roads (Submerged vs Passable)
    lg.roads.clearLayers();
    if (layers.roads && results.impact.roads.segments) {
      results.impact.roads.segments.forEach((seg) => {
        const isSubmerged = seg.status === "Submerged";
        const isPartial = seg.status === "Partial";
        const color = isSubmerged
          ? "#ea580c"
          : isPartial
            ? "#f59e0b"
            : "#64748b";
        const weight = isSubmerged ? 4 : 2.5;

        const polyline = L.polyline(seg.coordinates, {
          color,
          weight,
          opacity: 0.95,
          dashArray: isSubmerged ? undefined : "4, 4",
        });

        polyline.bindPopup(`
          <div class="text-xs font-mono space-y-1 p-1">
            <div class="flex items-center justify-between">
              <strong class="text-white">${seg.name}</strong>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isSubmerged
                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                  : "bg-space-950 text-slate-300"
              }">${seg.status}</span>
            </div>
            <div class="text-slate-300">Type: ${seg.type}</div>
            <div class="text-slate-300">Total Length: ${seg.lengthKm} km</div>
            <div class="text-slate-300">Submerged: <strong class="text-rose-400">${seg.floodedLengthKm} km</strong></div>
            ${seg.evacuationRoute ? '<div class="text-amber-400 font-bold text-[11px] mt-1">⚠️ Critical Evacuation Corridor Severed</div>' : ""}
          </div>
        `);

        lg.roads.addLayer(polyline);
      });
    }

    // 6. Settlements & Critical Sites
    lg.settlements.clearLayers();
    if (layers.settlements && results.impact.settlements.features) {
      results.impact.settlements.features.forEach((settlement) => {
        const isCritical = settlement.severity === "Critical";
        const markerColor = isCritical ? "#ef4444" : "#f59e0b";

        const circleMarker = L.circleMarker([settlement.lat, settlement.lng], {
          radius: isCritical ? 8 : 6,
          fillColor: markerColor,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        circleMarker.bindPopup(`
          <div class="text-xs font-mono space-y-1 p-1">
            <div class="flex items-center justify-between">
              <strong class="text-white text-sm">${settlement.name}</strong>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isCritical
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-300"
              }">${settlement.severity}</span>
            </div>
            <div class="text-slate-300">Facility Type: <strong class="text-white">${settlement.type}</strong></div>
            <div class="text-slate-300">Structures Flooded: <strong class="text-rose-400">${settlement.floodedBuildings}</strong> / ${settlement.totalBuildings}</div>
            <div class="text-slate-300">Water Depth Est.: <strong class="text-cyan-electric">${settlement.waterDepthEst}</strong></div>
          </div>
        `);

        lg.settlements.addLayer(circleMarker);
      });
    }
  }, [layers, floodOpacity, results]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      results.location.center,
      results.location.zoom,
      { duration: 1.2 },
    );
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-space-800 shadow-2xl bg-space-950 ${className}`}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Header Banner Overlay (Requested in Section 7) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="bg-space-950/90 backdrop-blur-xl border border-cyan-electric/30 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="font-bold text-white tracking-wider">
            LIVE FLOOD EXTENT
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-electric font-semibold">SENTINEL-1</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-bold px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/30 rounded">
            Google Earth Engine
          </span>
        </div>
      </div>

      {/* Floating Map Controls (Top Right) */}
      {showControls && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 font-mono">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`p-2 rounded-xl backdrop-blur-xl border text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 ${
              showLayerPanel
                ? "bg-gradient-to-r from-sky-vivid to-cyan-glow text-space-950 border-cyan-electric shadow-glow-cyan"
                : "bg-space-950/90 text-slate-300 border-space-800 hover:border-cyan-electric/40"
            }`}
            title="Toggle Map Layer Controls"
          >
            <LayersIcon className="w-4 h-4" />
            <span className="hidden sm:inline">LAYERS</span>
          </button>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`p-2 rounded-xl backdrop-blur-xl border text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 ${
              showLegend
                ? "bg-gradient-to-r from-sky-vivid to-cyan-glow text-space-950 border-cyan-electric shadow-glow-cyan"
                : "bg-space-950/90 text-slate-300 border-space-800 hover:border-cyan-electric/40"
            }`}
            title="Toggle Legend"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">LEGEND</span>
          </button>

          <button
            onClick={handleRecenter}
            className="p-2 rounded-xl bg-space-950/90 hover:bg-space-900 text-slate-300 hover:text-cyan-electric border border-space-800 backdrop-blur-xl shadow-lg transition-all"
            title="Recenter Map to AOI"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-space-950/90 hover:bg-space-900 text-slate-300 hover:text-cyan-electric border border-space-800 backdrop-blur-xl shadow-lg transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Layer Panel */}
      {showControls && showLayerPanel && (
        <div className="absolute top-14 right-3 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <LayerTogglePanel
            layers={layers}
            onChangeLayers={(updated) =>
              setLayers((prev) => ({ ...prev, ...updated }))
            }
            floodOpacity={floodOpacity}
            onChangeFloodOpacity={setFloodOpacity}
            isCompareMode={isCompareMode}
            onToggleCompareMode={() => setIsCompareMode(!isCompareMode)}
            compareSplit={compareSplit}
            onChangeCompareSplit={setCompareSplit}
          />
        </div>
      )}

      {/* Legend */}
      {showControls && showLegend && (
        <div className="absolute bottom-6 right-3 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <MapLegend />
        </div>
      )}

      {/* Compare Split Slider Laser Line */}
      {isCompareMode && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-10 border-r-2 border-cyan-electric shadow-[0_0_20px_#22d3ee]"
          style={{ left: `${compareSplit}%` }}
        >
          <div className="absolute top-4 -left-20 bg-space-950/95 text-slate-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-space-800 shadow-md">
            PRE-FLOOD
          </div>
          <div className="absolute top-4 left-2 bg-space-950/95 text-cyan-electric font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-electric/40 shadow-md">
            POST-FLOOD
          </div>
        </div>
      )}
    </div>
  );
};
