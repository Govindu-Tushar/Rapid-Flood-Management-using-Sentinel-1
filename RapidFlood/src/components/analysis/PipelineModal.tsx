import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Satellite, 
  Terminal,
  Sparkles,
  Radio,
  Sliders
} from 'lucide-react';
import { PipelineStep } from '../../types';

interface PipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  locationName: string;
}

const CONTROL_STEPS = [
  { id: 1, code: '01', label: 'ACQUIRING SATELLITE DATA', description: 'Querying Copernicus S1_GRD IW catalog for orbital scene pairs', progressMs: 800 },
  { id: 2, code: '02', label: 'PROCESSING SAR IMAGERY', description: 'Executing Radiometric Calibration (Sigma0) & Refined Lee speckle filter (7x7)', progressMs: 900 },
  { id: 3, code: '03', label: 'CALCULATING BACKSCATTER', description: 'Calibrating pre-flood and post-flood decibel surfaces (mean -12.4 dB to -21.8 dB)', progressMs: 900 },
  { id: 4, code: '04', label: 'DETECTING CHANGE', description: 'Computing temporal log-ratio difference (ΔdB = Post - Pre)', progressMs: 1000 },
  { id: 5, code: '05', label: 'GENERATING FLOOD MASK', description: 'Applying specular drop threshold (< -3.2 dB) & masking JRC permanent water', progressMs: 900 },
  { id: 6, code: '06', label: 'ANALYZING IMPACT', description: 'Spatial intersection against OpenStreetMap roads, buildings & cropland', progressMs: 1000 },
  { id: 7, code: '07', label: 'GENERATING DECISION SUPPORT', description: 'Computing priority classification zones & updating intelligence dashboard', progressMs: 700 },
];

export const PipelineModal: React.FC<PipelineModalProps> = ({
  isOpen,
  onComplete,
  locationName,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setLogs([]);
      return;
    }

    let isCancelled = false;

    const runPipeline = async () => {
      setLogs([
        `[${new Date().toLocaleTimeString()}] SATELLITE TELEMETRY INITIALIZED: RAPIDFLOOD SAR ENGINE v2.4`,
        `[${new Date().toLocaleTimeString()}] TARGET AOI: ${locationName.toUpperCase()}`,
        `[${new Date().toLocaleTimeString()}] SENSOR: SENTINEL-1 C-SAR (5.405 GHz) IW MODE, VV POLARIZATION`,
      ]);

      for (let i = 0; i < CONTROL_STEPS.length; i++) {
        if (isCancelled) return;
        setCurrentStepIndex(i);

        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [${CONTROL_STEPS[i].code}] ${CONTROL_STEPS[i].label}`,
          `  └─ ${CONTROL_STEPS[i].description}`,
        ]);

        await new Promise(resolve => setTimeout(resolve, CONTROL_STEPS[i].progressMs));
        if (isCancelled) return;

        setCompletedSteps(prev => [...prev, i]);
      }

      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [✓] EXECUTION 100% COMPLETE: FLOOD MASK & DECISION ZONES SYNTHESIZED`,
      ]);

      await new Promise(resolve => setTimeout(resolve, 800));
      if (!isCancelled) {
        onComplete();
      }
    };

    runPipeline();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, locationName]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((completedSteps.length) / CONTROL_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-xl">
      <div className="bg-space-900 border border-cyan-electric/40 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-4 bg-space-950 border-b border-space-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-space-900 border border-cyan-electric/40 flex items-center justify-center shadow-glow-cyan">
              <Radio className="w-5 h-5 text-cyan-electric animate-spin" />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-base tracking-wide flex items-center gap-2">
                PROCESSING SATELLITE RADAR PIPELINE
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-amber/20 text-amber-300 border border-status-amber/30">
                  DEMO EXECUTION
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Sentinel-1 SAR C-Band Change Detection Engine
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-xl font-black text-cyan-electric">{progressPercent}%</span>
            <div className="text-[10px] text-slate-400 uppercase">STEP {currentStepIndex + 1} OF 7</div>
          </div>
        </div>

        {/* High-tech Progress Line */}
        <div className="w-full bg-space-950 h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-vivid via-cyan-electric to-cyan-light transition-all duration-300 shadow-[0_0_12px_#22d3ee]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content: The 7 requested control steps */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-2 font-mono">
            {CONTROL_STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              const isRunning = currentStepIndex === idx && !isDone;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl text-xs transition-all border ${
                    isRunning 
                      ? 'bg-cyan-glow/10 border-cyan-electric/50 shadow-glow-cyan' 
                      : isDone 
                      ? 'bg-space-950/60 border-space-800 text-slate-300' 
                      : 'opacity-40 border-transparent text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone && <CheckCircle2 className="w-4 h-4 text-status-safe" />}
                    {isRunning && <Loader2 className="w-4 h-4 text-cyan-electric animate-spin" />}
                    {!isDone && !isRunning && <Circle className="w-4 h-4 text-space-700" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className={isRunning ? 'text-cyan-electric font-black' : isDone ? 'text-white' : 'text-slate-400'}>
                        {step.code} &nbsp; {step.label}
                      </span>
                      {isDone && <span className="text-[10px] text-status-safe font-mono">DONE</span>}
                      {isRunning && <span className="text-[10px] text-cyan-electric font-mono animate-pulse">PROCESSING...</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Telemetry Terminal */}
          <div className="bg-space-950 rounded-xl p-3.5 border border-space-800 font-mono text-[11px] shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-space-800/80 text-slate-400">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-electric">
                <Terminal className="w-3.5 h-3.5" />
                TELEMETRY STREAM
              </span>
              <span className="text-[9px] text-slate-400 font-bold">10m C-SAR IW Sigma0</span>
            </div>
            <div className="h-24 overflow-y-auto space-y-1 text-slate-300 pr-1 select-text">
              {logs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-space-950 border-t border-space-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous SAR Processing Pipeline</span>
          </div>
          <span className="text-cyan-electric font-bold">ESA COPERNICUS</span>
        </div>

      </div>
    </div>
  );
};
