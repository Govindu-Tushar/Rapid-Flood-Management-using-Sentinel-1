import React from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Download, 
  Sparkles,
  Info,
  Radio,
  Sliders,
  Compass
} from 'lucide-react';
import { AnalysisResults, ViewMode } from '../types';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface LiveMapViewProps {
  results: AnalysisResults;
  onNavigate: (view: ViewMode) => void;
  onOpenExport: () => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  results,
  onNavigate,
  onOpenExport,
}) => {
  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1700px] mx-auto h-[calc(100vh-65px)] flex flex-col font-mono">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 pb-2 border-b border-space-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-electric bg-cyan-glow/15 px-2.5 py-0.5 rounded border border-cyan-electric/30">
              GEOSPATIAL COMMAND CANVAS
            </span>
            <span className="text-xs font-bold text-white">
              {results.location.name} ({results.location.country})
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-status-amber/15 text-amber-300 border border-status-amber/40">
              <Sparkles className="w-3 h-3 text-amber-400" />
              DEMO MODE
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black font-display text-white tracking-tight uppercase">
            LIVE FLOOD EXTENT & SATELLITE TILES
          </h1>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 bg-space-900 hover:bg-space-850 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-space-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-electric" />
            <span>EXPORT LAYERS</span>
          </button>
          <button
            onClick={() => onNavigate('impact')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-sky-vivid to-cyan-glow text-space-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-glow-cyan transition-all hover:brightness-110 active:scale-95"
          >
            <span>IMPACT MATRIX</span>
          </button>
        </div>
      </div>

      {/* Large Map Panel (Takes up full height of screen) */}
      <div className="flex-1 min-h-[520px] rounded-2xl overflow-hidden shadow-2xl relative border border-space-800">
        <InteractiveMap results={results} className="h-full w-full" showControls={true} />
      </div>

      {/* Info Status Footer */}
      <div className="shrink-0 bg-space-950/90 border border-space-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-electric shrink-0" />
          <span className="font-sans text-slate-300">
            Click on any submerged road segment, settlement point, or priority polygon to inspect granular telemetry.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Projection: <strong className="text-white">WGS84 (EPSG:4326)</strong></span>
          <span>Sensor: <strong className="text-cyan-electric">Sentinel-1 C-SAR IW</strong></span>
        </div>
      </div>

    </div>
  );
};
