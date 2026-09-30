import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface AnalysisWorkflowStepsProps {
  currentStep: number; // 1 to 6
}

const WORKFLOW_STEPS = [
  { num: '01', title: 'AREA OF INTEREST' },
  { num: '02', title: 'SELECT DATES' },
  { num: '03', title: 'SAR PROCESSING' },
  { num: '04', title: 'FLOOD DETECTION' },
  { num: '05', title: 'IMPACT ASSESSMENT' },
  { num: '06', title: 'RESULTS' },
];

export const AnalysisWorkflowSteps: React.FC<AnalysisWorkflowStepsProps> = ({ currentStep }) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-1">
      <div className="flex items-center min-w-[720px] lg:min-w-0 justify-between bg-[#081522] border border-cyan-500/25 rounded-2xl p-3 shadow-lg">
        {WORKFLOW_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isFuture = stepNum > currentStep;

          return (
            <React.Fragment key={step.num}>
              {/* Step Pill */}
              <div 
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 font-mono ${
                  isCurrent
                    ? 'bg-cyan-500/15 border border-cyan-electric text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-electric/50'
                    : isCompleted
                    ? 'bg-space-950 border border-emerald-500/30 text-emerald-300'
                    : 'bg-space-950/60 border border-space-800 text-slate-500'
                }`}
              >
                {/* Number / Check Badge */}
                <div 
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-electric text-space-950 shadow-[0_0_8px_#06b6d4]'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-space-900 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                </div>

                {/* Step Title */}
                <span className="text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
                  {step.title}
                </span>

                {/* Live indicator on current step */}
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-ping" />
                )}
              </div>

              {/* Connecting Arrow (except after last step) */}
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div className="text-slate-600 px-1 shrink-0 flex items-center">
                  <ArrowRight className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500/60' : 'text-slate-600'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
