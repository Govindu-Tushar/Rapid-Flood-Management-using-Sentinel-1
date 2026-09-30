import React, { useEffect, useState } from 'react';
import { Satellite, Radio, CheckCircle2, Loader2, Circle, Terminal, Waves, Sparkles } from 'lucide-react';
import { SatelliteRadarVisual } from './SatelliteRadarVisual';

interface InPageProcessingViewProps {
  locationName: string;
  preDate: string;
  postDate: string;
  onComplete: () => void;
}

const CHECKLIST_STEPS = [
  { id: 1, text: 'Area of Interest Loaded', detail: 'Geometry bounding box & CRS projection aligned' },
  { id: 2, text: 'Pre-Flood Image Loaded', detail: 'S1-A IW GRD reference baseline retrieved' },
  { id: 3, text: 'Post-Flood Image Loaded', detail: 'S1-A IW GRD event scene acquired' },
  { id: 4, text: 'Processing SAR Backscatter', detail: 'Radiometric calibration & Refined Lee 7x7 filter' },
  { id: 5, text: 'Detecting Inundation', detail: 'Computing log-ratio temporal drop (ΔdB)' },
  { id: 6, text: 'Generating Flood Mask', detail: 'Subtracting JRC permanent water & DEM slopes' },
  { id: 7, text: 'Calculating Impact', detail: 'Overlaying roads, settlements, and cropland layers' },
  { id: 8, text: 'Preparing Results', detail: 'Synthesizing decision intelligence metrics' },
];

export const InPageProcessingView: React.FC<InPageProcessingViewProps> = ({
  locationName,
  preDate,
  postDate,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const runProcess = async () => {
      setLogs([
        `[${new Date().toLocaleTimeString()}] SATELLITE ENGINE ONLINE: COP-S1-IW-GRD`,
        `[${new Date().toLocaleTimeString()}] TARGET AOI: ${locationName.toUpperCase()}`,
        `[${new Date().toLocaleTimeString()}] TEMPORAL PAIR: ${preDate} -> ${postDate}`,
      ]);

      for (let i = 0; i < CHECKLIST_STEPS.length; i++) {
        if (isCancelled) return;
        setCurrentStepIndex(i);

        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] EXECUTING [0${i+1}/08]: ${CHECKLIST_STEPS[i].text.toUpperCase()}`,
          `  └─ ${CHECKLIST_STEPS[i].detail}`,
        ]);

        // Each step takes ~500ms - 700ms
        await new Promise(res => setTimeout(res, 600));
      }

      if (isCancelled) return;
      setCurrentStepIndex(CHECKLIST_STEPS.length); // all complete

      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [✓] PROCESSING COMPLETE: RESULTS COMPILED SUCCESSFULLY`,
      ]);

      await new Promise(res => setTimeout(res, 700));
      if (!isCancelled) {
        onComplete();
      }
    };

    runProcess();

    return () => {
      isCancelled = true;
    };
  }, [locationName, preDate, postDate, onComplete]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-space-900 via-space-950 to-space-900 border border-cyan-electric/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-electric/15 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase text-cyan-electric tracking-widest">
                ANALYSIS IN PROGRESS
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
            </div>
            <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
              PROCESSING SATELLITE SAR OBSERVATIONS
            </h2>
          </div>
        </div>

        <div className="font-mono text-xs text-slate-400">
          Target: <strong className="text-white">{locationName}</strong>
        </div>
      </div>

      {/* Radar Visual Panel */}
      <SatelliteRadarVisual locationName={locationName} isProcessing={true} />

      {/* 8-Step Checklist & Realtime Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Checklist */}
        <div className="p-5 rounded-2xl bg-[#081522] border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-space-800 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-electric" />
              SATELLITE PIPELINE EXECUTION
            </span>
            <span className="text-cyan-electric font-bold">
              {Math.min(CHECKLIST_STEPS.length, currentStepIndex)} / {CHECKLIST_STEPS.length} COMPLETED
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {CHECKLIST_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between font-mono text-xs ${
                    isCompleted
                      ? 'bg-space-950 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-500/15 border-cyan-electric text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-space-950/60 border-space-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status Symbol: ✓ or ◉ or ○ */}
                    <div className="w-5 text-center font-bold text-sm">
                      {isCompleted ? (
                        <span className="text-emerald-400">✓</span>
                      ) : isCurrent ? (
                        <span className="text-cyan-electric animate-pulse">◉</span>
                      ) : (
                        <span className="text-slate-600">○</span>
                      )}
                    </div>
                    <div>
                      <span className={`font-bold ${isCurrent ? 'text-white' : ''}`}>
                        {step.text}
                      </span>
                      <span className="text-[10px] block opacity-75 font-sans">
                        {step.detail}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        DONE
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-cyan-electric bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-electric/40 animate-pulse">
                        RUNNING
                      </span>
                    )}
                    {!isCompleted && !isCurrent && (
                      <span className="text-[10px] text-slate-600">
                        WAITING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Stream Terminal */}
        <div className="p-5 rounded-2xl bg-[#081522] border border-cyan-500/30 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-space-800 text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-electric" />
              SATELLITE TELEMETRY LOG
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              STREAM LIVE
            </span>
          </div>

          <div className="mt-3 flex-1 bg-space-950 p-3 rounded-xl border border-space-800 font-mono text-[11px] text-cyan-light/90 space-y-1.5 overflow-y-auto max-h-80 custom-scrollbar">
            {logs.map((log, idx) => (
              <div 
                key={idx}
                className={log.startsWith('  └─') ? 'text-slate-400 pl-4' : log.includes('[✓]') ? 'text-emerald-400 font-bold' : ''}
              >
                {log}
              </div>
            ))}
            <div className="flex items-center gap-1 text-cyan-electric animate-pulse pt-1">
              <span>&gt;</span>
              <span className="w-2 h-3.5 bg-cyan-electric inline-block" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
