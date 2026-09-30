import React from 'react';
import { 
  Satellite, 
  Layers, 
  ChevronRight, 
  Sliders, 
  Droplets, 
  ShieldCheck, 
  Compass, 
  TrendingDown, 
  Target 
} from 'lucide-react';

export const WorkflowBanner: React.FC = () => {
  const steps = [
    { num: '01', label: 'SENTINEL-1 SAR', sub: 'C-Band IW GRD', icon: <Satellite className="w-3.5 h-3.5 text-cyan-electric" /> },
    { num: '02', label: 'TEMPORAL PAIR', sub: 'Pre & Post Dates', icon: <Layers className="w-3.5 h-3.5 text-sky-glow" /> },
    { num: '03', label: 'SAR FILTERING', sub: 'Refined Lee (7x7)', icon: <Sliders className="w-3.5 h-3.5 text-blue-400" /> },
    { num: '04', label: 'CHANGE DETECTION', sub: 'ΔdB Log-Ratio', icon: <TrendingDown className="w-3.5 h-3.5 text-cyan-electric" /> },
    { num: '05', label: 'FLOOD MASK', sub: 'Threshold < -3.2dB', icon: <Droplets className="w-3.5 h-3.5 text-sky-vivid" /> },
    { num: '06', label: 'WATER REMOVAL', sub: 'JRC GSW Baseline', icon: <ShieldCheck className="w-3.5 h-3.5 text-status-safe" /> },
    { num: '07', label: 'GIS OVERLAY', sub: 'OSM Infrastructure', icon: <Compass className="w-3.5 h-3.5 text-status-amber" /> },
    { num: '08', label: 'PRIORITY MATRIX', sub: 'Decision Support', icon: <Target className="w-3.5 h-3.5 text-status-emergency" /> },
  ];

  return (
    <div className="bg-space-900/80 border border-space-800 rounded-xl p-4 shadow-xl relative overflow-hidden backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-space-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric">
            RADAR PROCESSING PIPELINE
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">— Raw Satellite Telemetry to Actionable Intelligence</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
          Copernicus Program
        </span>
      </div>

      {/* Grid of steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            <div className="bg-space-950/80 border border-space-800/90 rounded-lg p-2.5 flex flex-col items-center text-center transition-all group-hover:border-cyan-electric/50 group-hover:bg-space-850 group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.25)]">
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono text-[9px] font-bold text-slate-400">
                  {step.num}
                </span>
                <div className="p-1 rounded bg-space-900 border border-space-800 text-cyan-electric">
                  {step.icon}
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold text-white tracking-wide line-clamp-1">
                {step.label}
              </span>
              <span className="font-mono text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                {step.sub}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-space-700 z-10 pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
