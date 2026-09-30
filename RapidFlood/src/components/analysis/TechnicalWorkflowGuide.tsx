import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Satellite, Layers, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const TechnicalWorkflowGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Sentinel-1 SAR imagery is acquired for the selected dates',
      detail: 'Copernicus Sentinel-1 C-band (5.405 GHz) Synthetic Aperture Radar collects all-weather, day-and-night dual-pol (VV + VH) ground range detected (GRD) scenes.'
    },
    {
      num: '02',
      title: 'Radar backscatter is processed',
      detail: 'Raw amplitude is radiometrically calibrated into decibels (Sigma0 in dB), geocoded to 10m grid, and filtered with a Refined Lee kernel to suppress speckle noise.'
    },
    {
      num: '03',
      title: 'Pre-flood and post-flood observations are compared',
      detail: 'A temporal log-ratio difference is calculated: ΔdB = Post-Flood dB - Pre-Flood dB across matching orbital baseline tracks.'
    },
    {
      num: '04',
      title: 'Significant changes are used to identify potential inundation',
      detail: 'Smooth open water mirrors radar pulses away from the sensor, causing a significant specular drop (typically ΔdB < -3.2 dB).'
    },
    {
      num: '05',
      title: 'Permanent water is removed where appropriate',
      detail: 'The JRC Global Surface Water (GSW) dataset is overlaid to subtract permanent rivers, lakes, and reservoirs, isolating newly flooded land.'
    },
    {
      num: '06',
      title: 'Flood extent is calculated',
      detail: 'Steep terrain (> 8°) is masked via Copernicus 30m DEM to eliminate false alarms from radar shadow, producing the verified active inundation mask.'
    },
    {
      num: '07',
      title: 'GIS layers are overlaid to assess impact',
      detail: 'OpenStreetMap roads, building centroids, and Copernicus cropland masks are intersected with the flood mask to calculate critical infrastructure and community impact.'
    }
  ];

  return (
    <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-xl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-space-900/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-electric group-hover:scale-105 transition-transform">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-black text-white text-sm sm:text-base uppercase tracking-wide">
              HOW FLOOD DETECTION WORKS
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Sentinel-1 SAR Change Detection & Inundation Science
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-electric">
            {isOpen ? 'COLLAPSE' : 'EXPAND GUIDE'}
          </span>
          <div className="p-1 rounded-lg bg-space-950 border border-space-800 text-cyan-electric">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-space-800/80 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            {steps.map((st) => (
              <div 
                key={st.num}
                className="p-3.5 rounded-xl bg-space-950 border border-space-800 hover:border-cyan-500/30 transition-colors flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-electric/40 text-cyan-electric font-mono font-black text-xs flex items-center justify-center shrink-0">
                  {st.num}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white leading-snug">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
