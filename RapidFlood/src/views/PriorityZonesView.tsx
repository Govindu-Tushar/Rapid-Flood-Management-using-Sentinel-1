import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Info, 
  Navigation, 
  Building2, 
  Wheat, 
  Target,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { AnalysisResults, PriorityZone, ViewMode } from '../types';

interface PriorityZonesViewProps {
  results: AnalysisResults;
  onNavigate: (view: ViewMode) => void;
}

export const PriorityZonesView: React.FC<PriorityZonesViewProps> = ({
  results,
  onNavigate,
}) => {
  const { priorityZones, summary, location } = results;
  const [selectedZone, setSelectedZone] = useState<PriorityZone>(priorityZones[0]);

  // Aggregate stats
  const highCount = priorityZones.filter(z => z.level === 'High Priority').length;
  const mediumCount = priorityZones.filter(z => z.level === 'Medium Priority').length;
  const lowCount = priorityZones.filter(z => z.level === 'Low Priority').length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-status-emergency bg-status-emergency/15 px-2.5 py-0.5 rounded border border-status-emergency/30">
              DECISION-SUPPORT INTELLIGENCE
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {location.name}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase">
            PRIORITY RESPONSE ZONES
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Algorithmic spatial triage synthesizing flood depth, severed highway links, building density, and crop loss
          </p>
        </div>

        <button
          onClick={() => onNavigate('map')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-space-900 border border-cyan-electric/40 text-cyan-electric hover:text-white text-xs font-mono font-bold tracking-wider hover:shadow-glow-cyan transition-all"
        >
          <span>VIEW ON LIVE MAP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Major Category Cards as requested in Section 13 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* High Priority */}
        <div className="bg-space-900/90 border border-status-emergency/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-status-emergency/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-rose-300 uppercase tracking-widest">
              HIGH PRIORITY
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-status-emergency animate-ping" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white">{highCount}</span>
            <span className="font-mono text-xs text-slate-400 uppercase">ZONES ACTIVE</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block font-sans">
            Immediate amphibious rescue & culvert clearance required
          </span>
        </div>

        {/* Medium Priority */}
        <div className="bg-space-900/90 border border-status-amber/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-widest">
              MEDIUM PRIORITY
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-status-amber" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white">{mediumCount}</span>
            <span className="font-mono text-xs text-slate-400 uppercase">ZONES MONITORED</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block font-sans">
            Elevated surveillance, potable water staging & pump deployment
          </span>
        </div>

        {/* Low Priority */}
        <div className="bg-space-900/90 border border-status-safe/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(34,197,94,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-300 uppercase tracking-widest">
              LOW PRIORITY
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-status-safe" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white">{lowCount}</span>
            <span className="font-mono text-xs text-slate-400 uppercase">ZONES SECURE</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block font-sans">
            Secondary agricultural drainage & soil salinity retention checks
          </span>
        </div>

      </div>

      {/* 2-Column Split: Zone Selector on Left + Detailed Inspection Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Zone List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
            SELECT ZONE TO INSPECT
          </span>

          <div className="space-y-2.5">
            {priorityZones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-space-900 border-cyan-electric shadow-glow-cyan'
                      : 'bg-space-950/80 border-space-800 hover:border-space-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      zone.level === 'High Priority'
                        ? 'bg-status-emergency/20 text-rose-300 border-status-emergency/40'
                        : zone.level === 'Medium Priority'
                        ? 'bg-status-amber/20 text-amber-300 border-status-amber/40'
                        : 'bg-status-safe/20 text-emerald-300 border-status-safe/40'
                    }`}>
                      {zone.level.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-electric">
                      SCORE: {zone.score}/100
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-white text-sm mt-2">
                    {zone.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-space-800 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 text-[9px] block">FLOOD</span>
                      <span className="text-white font-bold">{zone.floodedAreaKm2} km²</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">ROADS CUT</span>
                      <span className="text-white font-bold">{zone.affectedRoadsKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">HOUSES</span>
                      <span className="text-white font-bold">{zone.affectedSettlements}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Zone Inspection Panel (Requested Example in Section 13) */}
        <div className="lg:col-span-7">
          <div className="bg-space-900/90 border border-cyan-electric/40 rounded-2xl p-6 shadow-2xl space-y-5 sticky top-24">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-space-800">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-electric uppercase block mb-1">
                  ZONE INSPECTION PANEL
                </span>
                <h2 className="font-display font-black text-2xl text-white uppercase">
                  {selectedZone.name}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  Sector Reference: {selectedZone.id.toUpperCase()}
                </span>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                selectedZone.level === 'High Priority'
                  ? 'bg-status-emergency/20 text-rose-300 border-status-emergency/50 shadow-glow-red'
                  : 'bg-status-amber/20 text-amber-300 border-status-amber/50 shadow-glow-amber'
              }`}>
                {selectedZone.level.toUpperCase()}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">Flood Extent</span>
                <span className="font-display text-xl font-black text-cyan-electric mt-1 block">
                  {selectedZone.floodedAreaKm2} km²
                </span>
              </div>
              <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">Affected Roads</span>
                <span className="font-display text-xl font-black text-sky-glow mt-1 block">
                  {selectedZone.affectedRoadsKm} km
                </span>
              </div>
              <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">Affected Buildings</span>
                <span className="font-display text-xl font-black text-rose-400 mt-1 block">
                  {selectedZone.affectedSettlements}
                </span>
              </div>
              <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">Agriculture</span>
                <span className="font-display text-xl font-black text-status-safe mt-1 block">
                  {selectedZone.agriculturalLossKm2} km²
                </span>
              </div>
            </div>

            {/* Operational Decision Directive */}
            <div className="p-4 bg-space-950 rounded-xl border border-cyan-electric/30 space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-electric flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                ACTIONABLE DECISION DIRECTIVE
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {selectedZone.recommendedAction}
              </p>
            </div>

            {/* Transparent Model Formula Explanation */}
            <div className="p-3 bg-space-950/60 rounded-xl border border-space-800 text-[11px] font-mono text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">PRIORITY SCORING ALGORITHM:</span>
              <div>Priority Score = (0.35 × Area) + (0.35 × Dwellings) + (0.20 × CutRoads) + (0.10 × Crops)</div>
              <div className="text-cyan-electric font-bold mt-1">Computed Score: {selectedZone.score} / 100</div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-status-amber/10 border border-status-amber/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200/90 font-sans">
              <Info className="w-4 h-4 text-status-amber shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> This is prototype decision-support classification, not an official emergency evacuation mandate.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
