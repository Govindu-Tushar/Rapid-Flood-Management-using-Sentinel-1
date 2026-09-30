import React, { useState, useRef } from 'react';
import { Sliders, ArrowRight, Eye, Satellite, Waves, Sparkles } from 'lucide-react';
import { AnalysisResults } from '../../types';

interface BeforeAfterComparisonProps {
  results: AnalysisResults;
  preDate: string;
  postDate: string;
  thresholdDb: number;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  results,
  preDate,
  postDate,
  thresholdDb,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100
  const [viewMode, setViewMode] = useState<'slider' | 'cards'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  return (
    <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-electric">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-black text-white text-base uppercase tracking-wide">
              MULTI-TEMPORAL SCENE COMPARISON
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Sentinel-1 SAR C-band Ground Range Detected (GRD) 10m
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-space-950 p-1 rounded-xl border border-space-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'slider'
                ? 'bg-cyan-electric text-space-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SPLIT SLIDER
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-cyan-electric text-space-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIDE-BY-SIDE
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Pre-flood */}
        <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2 group hover:border-space-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-space-800 text-slate-300">
              PRE-FLOOD BASELINE
            </span>
            <span className="text-xs font-mono text-slate-400">{preDate}</span>
          </div>
          <div className="h-28 rounded-lg bg-gradient-to-br from-slate-900 to-space-950 border border-space-800/80 flex flex-col items-center justify-center p-3 text-center">
            <div className="text-2xl font-mono font-black text-slate-300">
              {results.summary.preFloodMeanBackscatterDb} <span className="text-xs font-sans text-slate-400">dB</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-sans">
              Diffuse microwave scatter from dry soil & urban terrain
            </div>
          </div>
        </div>

        {/* Card 2: Post-flood */}
        <div className="bg-space-950 border border-sky-800/40 rounded-xl p-4 space-y-2 group hover:border-sky-700/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              POST-FLOOD OBSERVATION
            </span>
            <span className="text-xs font-mono text-sky-300">{postDate}</span>
          </div>
          <div className="h-28 rounded-lg bg-gradient-to-br from-sky-950/40 to-space-950 border border-sky-800/40 flex flex-col items-center justify-center p-3 text-center">
            <div className="text-2xl font-mono font-black text-sky-400">
              {results.summary.postFloodMeanBackscatterDb} <span className="text-xs font-sans text-sky-300">dB</span>
            </div>
            <div className="text-[11px] text-sky-200/80 mt-1 font-sans">
              Specular reflection bouncing radar pulses away from sensor
            </div>
          </div>
        </div>

        {/* Card 3: Detected Change */}
        <div className="bg-space-950 border border-cyan-electric/40 rounded-xl p-4 space-y-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-electric border border-cyan-electric/40">
              DETECTED CHANGE
            </span>
            <span className="text-xs font-mono text-cyan-electric font-bold">ΔdB &lt; {thresholdDb} dB</span>
          </div>
          <div className="h-28 rounded-lg bg-gradient-to-br from-cyan-950/50 to-space-950 border border-cyan-500/40 flex flex-col items-center justify-center p-3 text-center">
            <div className="text-2xl font-mono font-black text-white">
              {results.summary.floodedAreaKm2} <span className="text-xs font-mono text-cyan-electric">km²</span>
            </div>
            <div className="text-[11px] text-cyan-light/90 mt-1 font-sans">
              Identified inundated land surface & active flood extent
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Wipe Slider */}
      {viewMode === 'slider' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>◀ PRE-FLOOD ({preDate})</span>
            <span className="text-cyan-electric font-bold">DRAG SLIDER TO REVEAL INUNDATION ({sliderPos}%)</span>
            <span>POST-FLOOD ({postDate}) ▶</span>
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-64 sm:h-80 rounded-xl overflow-hidden cursor-ew-resize select-none border border-cyan-500/30 shadow-inner bg-space-950"
          >
            {/* Pre-Flood Image Layer (Simulated high-res radar baseline) */}
            <div className="absolute inset-0 bg-[#06111f] flex flex-col items-center justify-center p-6 text-center">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.25) 0%, transparent 60%),
                                    repeating-linear-gradient(0deg, #1e293b 0px, #1e293b 1px, transparent 1px, transparent 16px)`
                }}
              />
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-space-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
                  PRE-FLOOD SAR RADAR SURFACE
                </span>
                <div className="text-xs font-mono text-slate-400">
                  Normal terrain backscatter: <span className="text-white font-bold">{results.summary.preFloodMeanBackscatterDb} dB</span>
                </div>
                <div className="text-[11px] text-slate-500 max-w-sm">
                  Dry soil, vegetation canopy, and infrastructure reflecting microwave pulses normally
                </div>
              </div>
            </div>

            {/* Post-Flood Layer (Clipped to slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute inset-0 w-[1000px] sm:w-[1400px] bg-gradient-to-r from-[#031d2e] via-[#04283d] to-[#083344] flex flex-col items-center justify-center p-6 text-center border-r-2 border-cyan-electric">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 60% 60%, rgba(6, 182, 212, 0.4) 0%, transparent 70%),
                                      repeating-linear-gradient(45deg, rgba(6, 182, 212, 0.15) 0px, rgba(6, 182, 212, 0.15) 2px, transparent 2px, transparent 12px)`
                  }}
                />
                
                {/* Visual Flood Inundation Patches */}
                <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-40">
                  <div className="w-48 h-32 rounded-full bg-cyan-electric/30 blur-xl" />
                  <div className="w-64 h-40 rounded-full bg-sky-vivid/40 blur-2xl" />
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-electric text-cyan-electric font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    POST-FLOOD INUNDATED EXTENT
                  </span>
                  <div className="text-xs font-mono text-cyan-light">
                    Specular backscatter drop: <span className="text-white font-bold">{results.summary.postFloodMeanBackscatterDb} dB</span> (ΔdB: {results.summary.meanDeltaDb} dB)
                  </div>
                  <div className="text-[11px] text-cyan-200/70 max-w-sm">
                    Water mirrors incident radar signal away, causing pronounced dark backscatter drop
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-electric shadow-[0_0_15px_#06b6d4] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-space-950 border-2 border-cyan-electric flex items-center justify-center text-cyan-electric shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                <span className="text-[10px] font-mono font-black">◀▶</span>
              </div>
            </div>

            {/* Corner Badges */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="px-2 py-1 rounded bg-space-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-electric font-bold">
                POST-FLOOD
              </span>
            </div>
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="px-2 py-1 rounded bg-space-950/80 border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                PRE-FLOOD
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
