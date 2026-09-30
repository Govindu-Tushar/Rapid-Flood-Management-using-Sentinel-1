import React from 'react';
import { Satellite, Radio, Compass, Wifi } from 'lucide-react';

interface SatelliteRadarVisualProps {
  locationName: string;
  isProcessing?: boolean;
}

export const SatelliteRadarVisual: React.FC<SatelliteRadarVisualProps> = ({
  locationName,
  isProcessing = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#081522] border border-cyan-500/30 p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header HUD */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-space-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-cyan-electric" />
            SENTINEL-1 SAR TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-electric border border-cyan-500/20 text-[10px]">
            IW GRD 10M
          </span>
          <span className="text-[10px] text-slate-400">
            POL: VV
          </span>
        </div>
      </div>

      {/* Main Radar Screen + Flow */}
      <div className="relative z-10 py-6 flex flex-col md:flex-row items-center justify-around gap-6">
        
        {/* Radar Graphic */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
          
          {/* Concentric Circles */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/25 border-dashed" />
          <div className="absolute inset-12 rounded-full border border-cyan-500/30" />
          <div className="absolute inset-20 rounded-full border border-cyan-500/40" />

          {/* Crosshair Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-cyan-500/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-px bg-cyan-500/20" />
          </div>

          {/* Diagonal Guides */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-45">
            <div className="w-full h-px bg-cyan-500/10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -rotate-45">
            <div className="w-full h-px bg-cyan-500/10" />
          </div>

          {/* Radar Sweep Rotating Beam */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-[spin_4s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0) 60deg, transparent 60deg)'
            }}
          />

          {/* Detected Target Blips */}
          <div className="absolute top-10 left-16 w-2 h-2 rounded-full bg-cyan-light shadow-[0_0_8px_#22d3ee] animate-ping" />
          <div className="absolute bottom-12 right-14 w-2.5 h-2.5 rounded-full bg-cyan-electric shadow-[0_0_8px_#06b6d4] animate-pulse" />
          <div className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-sky-vivid animate-ping" />
          <div className="absolute bottom-20 left-12 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

          {/* Center Satellite Core */}
          <div className="relative z-10 w-10 h-10 rounded-full bg-space-950 border border-cyan-electric flex items-center justify-center text-cyan-electric shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Radio className="w-5 h-5 text-cyan-electric animate-pulse" />
          </div>

          {/* Degree Indicators */}
          <span className="absolute top-1 font-mono text-[9px] text-cyan-500/60 font-bold">000°</span>
          <span className="absolute right-1 font-mono text-[9px] text-cyan-500/60 font-bold">090°</span>
          <span className="absolute bottom-1 font-mono text-[9px] text-cyan-500/60 font-bold">180°</span>
          <span className="absolute left-1 font-mono text-[9px] text-cyan-500/60 font-bold">270°</span>
        </div>

        {/* Change Detection Process Flow Banner */}
        <div className="flex-1 w-full space-y-3 font-mono">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-electric" />
            TEMPORAL SAR ACQUISITION STACK
          </div>

          {/* Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
            
            {/* Step 1: Pre-Flood */}
            <div className="p-3 rounded-xl bg-space-950 border border-space-800 hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] text-slate-400 block font-bold">STAGE 01</span>
              <span className="text-xs font-black text-white block mt-0.5">PRE-FLOOD</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Baseline Backscatter (dB)</span>
            </div>

            {/* Step 2: Post-Flood */}
            <div className="p-3 rounded-xl bg-space-950 border border-space-800 hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] text-sky-400 block font-bold">STAGE 02</span>
              <span className="text-xs font-black text-white block mt-0.5">POST-FLOOD</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Specular Drop (dB)</span>
            </div>

            {/* Step 3: Change Detected */}
            <div className="p-3 rounded-xl bg-space-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="text-[10px] text-cyan-electric block font-bold">STAGE 03</span>
              <span className="text-xs font-black text-cyan-light block mt-0.5">CHANGE DETECTED</span>
              <span className="text-[10px] text-cyan-electric/80 mt-1 block">Log-Ratio Inundation Mask</span>
            </div>

          </div>

          {/* Coordinates & Target Telemetry Banner */}
          <div className="p-2.5 rounded-xl bg-space-950/80 border border-space-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">
              TARGET AOI: <strong className="text-white">{locationName}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-electric shrink-0 font-bold">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              SATELLITE SYNCED
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
