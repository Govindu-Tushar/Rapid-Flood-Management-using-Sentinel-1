import React, { useState } from 'react';
import { 
  Car, 
  Building2, 
  Wheat, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Layers, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { AnalysisResults, ViewMode } from '../types';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface ImpactAssessmentViewProps {
  results: AnalysisResults;
  onNavigate: (view: ViewMode) => void;
}

export const ImpactAssessmentView: React.FC<ImpactAssessmentViewProps> = ({
  results,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'agriculture' | 'table'>('infrastructure');
  const { impact, priorityZones, summary, location } = results;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric bg-cyan-glow/15 px-2.5 py-0.5 rounded border border-cyan-electric/30">
              GIS SPATIAL OVERLAY ANALYSIS
            </span>
            <span className="font-mono text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-status-amber/15 border border-status-amber/40">
              ● DEMO DATA
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase">
            IMPACT ASSESSMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Spatial Intersection: Sentinel-1 Inundation Mask ∩ OpenStreetMap Vector Infrastructure
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-space-900 border border-space-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
              activeTab === 'infrastructure'
                ? 'bg-cyan-electric text-space-950 font-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            INFRASTRUCTURE
          </button>
          <button
            onClick={() => setActiveTab('agriculture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
              activeTab === 'agriculture'
                ? 'bg-cyan-electric text-space-950 font-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AGRICULTURE
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${
              activeTab === 'table'
                ? 'bg-cyan-electric text-space-950 font-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ZONE TABLE
          </button>
        </div>
      </div>

      {/* 3 Large Sections as requested in Section 12: ROADS, SETTLEMENTS, AGRICULTURE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ROADS */}
        <div className="bg-space-900/90 border border-sky-glow/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-sky-glow/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-glow uppercase tracking-widest flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-glow" />
              ROADS AFFECTED
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-space-950 border border-space-800 text-slate-300">
              {impact.roads.affectedSegmentsCount} CUTS
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white font-mono">
              {impact.roads.affectedRoadsKm}
            </span>
            <span className="font-mono text-sm font-bold text-slate-400">km</span>
          </div>
          <span className="text-xs text-rose-400 mt-2 block font-mono font-semibold">
            ▲ {impact.roads.criticalCorridorsCut} major evacuation highways submerged
          </span>
        </div>

        {/* SETTLEMENTS */}
        <div className="bg-space-900/90 border border-status-emergency/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-status-emergency/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-status-emergency" />
              SETTLEMENTS AFFECTED
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-space-950 border border-space-800 text-slate-300">
              {impact.settlements.affectedSettlementClusters} CLUSTERS
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white font-mono">
              {impact.settlements.affectedBuildings.toLocaleString()}
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">structures</span>
          </div>
          <span className="text-xs text-rose-400 mt-2 block font-mono font-semibold">
            ▲ {impact.settlements.criticalFacilitiesFlooded} civic health & shelter facilities flooded
          </span>
        </div>

        {/* AGRICULTURE */}
        <div className="bg-space-900/90 border border-status-safe/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-status-safe/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Wheat className="w-4 h-4 text-status-safe" />
              AGRICULTURE AFFECTED
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-space-950 border border-space-800 text-slate-300">
              HIGH RISK
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white font-mono">
              {impact.agriculture.floodedAgriAreaKm2}
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">km²</span>
          </div>
          <span className="text-xs text-emerald-400 mt-2 block font-mono font-semibold">
            {impact.agriculture.percentageAgriAffected}% of cultivated cropland inundated
          </span>
        </div>

      </div>

      {/* Map display as requested in Section 12 ("Then show a map.") */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-space-800">
          <span className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-electric" />
            SPATIAL IMPACT OVERLAY MAP
          </span>
          <span className="font-mono text-xs text-slate-400">
            OpenStreetMap Features ∩ Sentinel-1 Water Extent
          </span>
        </div>
        <div className="h-[420px] rounded-xl overflow-hidden border border-space-800">
          <InteractiveMap results={results} className="h-full w-full" />
        </div>
      </div>

      {/* Table as requested in Section 12: ZONE | FLOOD AREA | ROADS | SETTLEMENTS | AGRICULTURE | PRIORITY */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-space-800">
          <h3 className="font-display font-bold text-base text-white uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-electric" />
            SECTORAL DAMAGE & DECISION SUPPORT TABLE
          </h3>
          <span className="font-mono text-xs text-slate-400">
            Multi-Criteria GIS Assessment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">ZONE</th>
                <th className="py-3 px-3">FLOOD AREA</th>
                <th className="py-3 px-3">ROADS</th>
                <th className="py-3 px-3">SETTLEMENTS</th>
                <th className="py-3 px-3">AGRICULTURE</th>
                <th className="py-3 px-3">PRIORITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/80">
              {priorityZones.map((pz) => (
                <tr key={pz.id} className="hover:bg-space-850/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">
                    {pz.name}
                  </td>
                  <td className="py-3.5 px-3 text-cyan-electric font-bold">
                    {pz.floodedAreaKm2} km²
                  </td>
                  <td className="py-3.5 px-3 text-sky-glow">
                    {pz.affectedRoadsKm} km
                  </td>
                  <td className="py-3.5 px-3 text-rose-400 font-bold">
                    {pz.affectedSettlements} structures
                  </td>
                  <td className="py-3.5 px-3 text-status-safe">
                    {pz.agriculturalLossKm2} km²
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                      pz.level === 'High Priority'
                        ? 'bg-status-emergency/20 text-rose-300 border-status-emergency/40 shadow-glow-red'
                        : pz.level === 'Medium Priority'
                        ? 'bg-status-amber/20 text-amber-300 border-status-amber/40 shadow-glow-amber'
                        : 'bg-status-safe/20 text-emerald-300 border-status-safe/40 shadow-glow-green'
                    }`}>
                      {pz.level.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
