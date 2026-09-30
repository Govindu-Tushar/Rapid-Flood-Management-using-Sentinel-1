import React from 'react';
import { 
  Layers, 
  SplitSquareVertical, 
  MapPin, 
  Car, 
  Wheat, 
  ShieldAlert, 
  SlidersHorizontal 
} from 'lucide-react';
import { MapLayerVisibility } from '../../types';

interface LayerTogglePanelProps {
  layers: MapLayerVisibility;
  onChangeLayers: (updated: Partial<MapLayerVisibility>) => void;
  floodOpacity: number;
  onChangeFloodOpacity: (val: number) => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  compareSplit: number;
  onChangeCompareSplit: (val: number) => void;
}

export const LayerTogglePanel: React.FC<LayerTogglePanelProps> = ({
  layers,
  onChangeLayers,
  floodOpacity,
  onChangeFloodOpacity,
  isCompareMode,
  onToggleCompareMode,
  compareSplit,
  onChangeCompareSplit,
}) => {
  return (
    <div className="bg-space-950/95 border border-cyan-electric/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl w-72 text-xs select-none space-y-3 font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-space-800">
        <span className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Layers className="w-3.5 h-3.5 text-cyan-electric" />
          MAP LAYER CONTROLS
        </span>
        <button
          onClick={onToggleCompareMode}
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
            isCompareMode
              ? 'bg-cyan-electric text-space-950 border-cyan-electric shadow-glow-cyan'
              : 'bg-space-900 text-slate-300 border-space-800 hover:border-cyan-electric/40'
          }`}
          title="Toggle Split Screen Before / After Comparison"
        >
          <SplitSquareVertical className="w-3 h-3" />
          {isCompareMode ? 'EXIT SPLIT' : 'SPLIT VIEW'}
        </button>
      </div>

      {/* Base Map Switcher */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
          BASEMAP ENGINE
        </label>
        <div className="grid grid-cols-3 gap-1 bg-space-900 p-1 rounded-xl border border-space-800">
          {(['dark', 'satellite', 'street'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onChangeLayers({ baseMap: style })}
              className={`py-1 text-[10px] font-bold capitalize rounded-lg transition-colors ${
                layers.baseMap === style
                  ? 'bg-cyan-electric text-space-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style === 'dark' ? 'Dark' : style === 'satellite' ? 'Satellite' : 'Street'}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Slider */}
      {isCompareMode && (
        <div className="bg-space-900 border border-cyan-electric/40 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-cyan-electric">BEFORE / AFTER SLIDER</span>
            <span className="text-white font-bold">{compareSplit}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={compareSplit}
            onChange={(e) => onChangeCompareSplit(Number(e.target.value))}
            className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-cyan-electric"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>Pre-Flood Reference</span>
            <span>Post-Flood Inundation</span>
          </div>
        </div>
      )}

      {/* Flood Opacity Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-300 flex items-center gap-1 font-bold">
            <SlidersHorizontal className="w-3 h-3 text-cyan-electric" />
            FLOOD MASK OPACITY
          </span>
          <span className="text-cyan-electric font-bold">{Math.round(floodOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={floodOpacity}
          onChange={(e) => onChangeFloodOpacity(Number(e.target.value))}
          className="w-full h-1.5 bg-space-900 rounded-lg appearance-none cursor-pointer accent-cyan-electric"
        />
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1 pt-2 border-t border-space-800">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
          GEOSPATIAL OVERLAYS
        </label>

        {/* Flood Extent */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-cyan-electric ring-2 ring-cyan-electric/40" />
            <span className="font-bold text-white">Flood Inundation Mask</span>
          </div>
          <input
            type="checkbox"
            checked={layers.floodExtent}
            onChange={(e) => onChangeLayers({ floodExtent: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Permanent Water */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-sky-deep border border-sky-glow" />
            <span className="text-slate-300">Permanent Water (JRC)</span>
          </div>
          <input
            type="checkbox"
            checked={layers.permanentWater}
            onChange={(e) => onChangeLayers({ permanentWater: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Roads */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-300">Road Network (OSM)</span>
          </div>
          <input
            type="checkbox"
            checked={layers.roads}
            onChange={(e) => onChangeLayers({ roads: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Settlements */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-300">Settlements & Civic Sites</span>
          </div>
          <input
            type="checkbox"
            checked={layers.settlements}
            onChange={(e) => onChangeLayers({ settlements: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Agriculture */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <Wheat className="w-3.5 h-3.5 text-status-safe" />
            <span className="text-slate-300">Agricultural Cropland</span>
          </div>
          <input
            type="checkbox"
            checked={layers.agriculture}
            onChange={(e) => onChangeLayers({ agriculture: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Priority Zones */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-space-900 cursor-pointer">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-status-emergency" />
            <span className="text-slate-300">Priority Response Zones</span>
          </div>
          <input
            type="checkbox"
            checked={layers.priorityZones}
            onChange={(e) => onChangeLayers({ priorityZones: e.target.checked })}
            className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};
