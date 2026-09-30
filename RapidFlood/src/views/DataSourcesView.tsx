import React from 'react';
import { 
  Database, 
  Satellite, 
  Map as MapIcon, 
  FileJson, 
  Cloud, 
  ExternalLink,
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const datasets = [
    {
      name: 'Copernicus Sentinel-1 C-Band SAR',
      provider: 'European Space Agency (ESA) & Copernicus Programme',
      purpose: 'Rapid flood detection using Synthetic Aperture Radar (SAR) backscatter change analysis.',
      details: 'Level-1 Ground Range Detected (GRD) in Interferometric Wide (IW) swath mode with 10m spatial resolution and dual-polarization (VV + VH). Penetrates heavy monsoonal cloud cover and operates day or night.',
      icon: <Satellite className="w-5 h-5 text-cyan-electric" />,
      link: 'https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1',
      badge: 'Earth Observation Raster'
    },
    {
      name: 'OpenStreetMap (OSM)',
      provider: 'OpenStreetMap Foundation & Community Contributors',
      purpose: 'Extraction of road networks, building footprints, settlements, and critical civic facilities.',
      details: 'High-resolution geospatial vector features queried via Overpass API / Geofabrik. Provides attributes for highways (primary, secondary, residential), bridges, hospitals, schools, and administrative boundaries.',
      icon: <MapIcon className="w-5 h-5 text-status-safe" />,
      link: 'https://www.openstreetmap.org/',
      badge: 'Geographic Vectors'
    },
    {
      name: 'JRC Global Surface Water (GSW)',
      provider: 'European Commission Joint Research Centre (JRC)',
      purpose: 'Masking of permanent rivers, reservoirs, and natural lakes.',
      details: 'Derived from 38+ years of Landsat imagery at 30m resolution. Uses the "Seasonality" band (water presence >= 10 months/year) to isolate newly inundated floodwaters from normal historical aquatic bodies.',
      icon: <Database className="w-5 h-5 text-sky-glow" />,
      link: 'https://global-surface-water.appspot.com/',
      badge: 'Surface Water Baseline'
    },
    {
      name: 'Google Earth Engine (GEE)',
      provider: 'Google Cloud Platform',
      purpose: 'Cloud-based multi-temporal satellite image processing and analysis.',
      details: 'Scalable planetary-scale compute platform utilized for automated ingestion of S1_GRD collections, speckle filter execution, threshold segmentation, and spatial zonal statistics.',
      icon: <Cloud className="w-5 h-5 text-purple-400" />,
      link: 'https://earthengine.google.com/',
      badge: 'Cloud Geospatial Compute'
    },
    {
      name: 'Copernicus DEM (GLO-30)',
      provider: 'European Space Agency (ESA)',
      purpose: 'Topographic slope masking to prevent radar shadow false positives.',
      details: 'Global 30-meter Digital Elevation Model used to compute terrain slopes. Slopes > 8° are masked out to eliminate false water classifications caused by mountain microwave shadows.',
      icon: <ShieldCheck className="w-5 h-5 text-status-amber" />,
      link: 'https://spacedata.copernicus.eu/',
      badge: 'Topographic Elevation'
    },
    {
      name: 'GeoJSON Standard (RFC 7946)',
      provider: 'IETF Open Standard',
      purpose: 'Interoperable exchange format for flood extent polygons and impacted vector assets.',
      details: 'Lightweight JSON-based format for encoding geographical data structures, enabling seamless export to QGIS, ArcGIS, Mapbox, or web-based GIS map engines.',
      icon: <FileJson className="w-5 h-5 text-orange-400" />,
      link: 'https://geojson.org/',
      badge: 'Vector Data Standard'
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="pb-3 border-b border-space-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric bg-cyan-glow/15 px-2.5 py-0.5 rounded border border-cyan-electric/30">
            OPEN GEOSPATIAL INFRASTRUCTURE
          </span>
        </div>
        <h1 className="text-3xl font-black font-display text-white tracking-tight uppercase">
          AUTHORITATIVE DATASETS & PROVIDERS
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5 max-w-3xl leading-relaxed">
          Multi-sensor satellite radar, open geographic crowdsourced vectors, and long-term hydrological baselines
        </p>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {datasets.map((dataset, idx) => (
          <div
            key={idx}
            className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-xl hover:border-cyan-electric/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-space-950 border border-space-800 group-hover:scale-105 transition-transform">
                  {dataset.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-space-950 text-slate-300 border border-space-800">
                  {dataset.badge}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-electric transition-colors">
                  {dataset.name}
                </h3>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {dataset.provider}
                </div>
              </div>

              <div className="p-3 bg-space-950 border border-space-800 rounded-xl">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-0.5">
                  Core Purpose
                </span>
                <p className="text-xs text-slate-300 font-sans font-medium">
                  {dataset.purpose}
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {dataset.details}
              </p>
            </div>

            <div className="pt-3 border-t border-space-800 flex justify-between items-center text-xs font-mono">
              <span className="text-status-safe text-[11px] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Open Access Integrated
              </span>
              <a
                href={dataset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-electric hover:text-white flex items-center gap-1 font-bold"
              >
                <span>DOCUMENTATION</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
