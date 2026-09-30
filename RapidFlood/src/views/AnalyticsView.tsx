import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Activity, 
  Sparkles, 
  Clock, 
  TrendingDown, 
  Radio 
} from 'lucide-react';
import { AnalysisResults } from '../types';

interface AnalyticsViewProps {
  results: AnalysisResults;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ results }) => {
  const { summary, impact, priorityZones, location } = results;

  // Chart 1: Flood extent over time (Temporal flood progression)
  const floodTimeData = [
    { day: 'Day -6 (Pre)', extentKm2: Number((summary.permanentWaterKm2).toFixed(1)), backscatterDb: -12.4 },
    { day: 'Day -3', extentKm2: Number((summary.permanentWaterKm2 + 18.2).toFixed(1)), backscatterDb: -14.8 },
    { day: 'Day 0 (Peak)', extentKm2: summary.floodedAreaKm2, backscatterDb: -21.8 },
    { day: 'Day +3 (Obs)', extentKm2: Number((summary.floodedAreaKm2 * 0.92).toFixed(1)), backscatterDb: -20.2 },
    { day: 'Day +6 (Recession)', extentKm2: Number((summary.floodedAreaKm2 * 0.78).toFixed(1)), backscatterDb: -18.5 },
  ];

  // Chart 2: Affected Infrastructure by zone
  const infrastructureData = priorityZones.map(pz => ({
    name: pz.name.split(' - ')[0],
    roadsCutKm: pz.affectedRoadsKm,
    buildingsCount: pz.affectedSettlements,
    priorityScore: pz.score,
  }));

  // Chart 3: Agricultural Impact
  const agriCropData = impact.agriculture.zones.map(z => ({
    name: z.cropType.split(' (')[0],
    totalHa: z.totalHectares,
    floodedHa: z.floodedHectares,
  }));

  // Chart 4: Severity & Land Cover Distribution
  const landCoverData = [
    { name: 'Agricultural Cropland', value: impact.agriculture.floodedAgriAreaKm2, color: '#22c55e' },
    { name: 'Permanent Water Baseline', value: summary.permanentWaterKm2, color: '#0284c7' },
    { name: 'Newly Submerged Terrestrial', value: summary.floodedAreaKm2, color: '#22d3ee' },
    { name: 'Unaffected AOI Land', value: Math.max(0, summary.totalAreaAnalyzedKm2 - summary.floodedAreaKm2 - summary.permanentWaterKm2), color: '#112942' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric bg-cyan-glow/15 px-2.5 py-0.5 rounded border border-cyan-electric/30">
              SATELLITE QUANTITATIVE ANALYTICS
            </span>
            <span className="font-mono text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-status-amber/15 border border-status-amber/40">
              ● DEMO DATA CHARTS
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase">
            FLOOD METRICS & SECTORAL ANALYTICS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Empirical breakdown of SAR radar backscatter shifts, infrastructure loss, and agricultural damage
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Mini Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-space-900 border border-space-800 rounded-xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            PEAK INUNDATION
          </span>
          <div className="text-2xl font-black text-cyan-electric mt-1">
            {summary.floodedAreaKm2} <span className="text-xs text-slate-400">km²</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {summary.percentageAreaFlooded}% of total analyzed AOI
          </span>
        </div>

        <div className="bg-space-900 border border-space-800 rounded-xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            RADAR ΔdB SHIFT
          </span>
          <div className="text-2xl font-black text-sky-glow mt-1">
            {summary.meanDeltaDb} <span className="text-xs text-slate-400">dB</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Specular microwave reflection drop
          </span>
        </div>

        <div className="bg-space-900 border border-space-800 rounded-xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            SEVERED HIGHWAYS
          </span>
          <div className="text-2xl font-black text-status-emergency mt-1">
            {impact.roads.affectedRoadsKm} <span className="text-xs text-slate-400">km</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {impact.roads.criticalCorridorsCut} major evacuation cuts
          </span>
        </div>

        <div className="bg-space-900 border border-space-800 rounded-xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            AGRICULTURAL LOSS
          </span>
          <div className="text-2xl font-black text-status-safe mt-1">
            {impact.agriculture.floodedAgriAreaKm2} <span className="text-xs text-slate-400">km²</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {impact.agriculture.percentageAgriAffected}% of cropland submerged
          </span>
        </div>
      </div>

      {/* Row 1 Charts: Flood extent over time & Affected Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Flood extent over time (Requested in Section 11) */}
        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-space-800">
            <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-electric" />
              FLOOD EXTENT OVER TIME (km²)
            </h3>
            <span className="font-mono text-[10px] text-cyan-electric">SAR Temporal Profile</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={floodTimeData}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0B1F33" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050B14', borderColor: '#22d3ee', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="extentKm2" name="Inundated Area (km²)" stroke="#22d3ee" strokeWidth={2.5} fill="url(#cyanArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Affected Infrastructure (Requested in Section 11) */}
        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-space-800">
            <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-glow" />
              AFFECTED INFRASTRUCTURE BY SECTOR
            </h3>
            <span className="font-mono text-[10px] text-sky-glow">OSM Overlay</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={infrastructureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0B1F33" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050B14', borderColor: '#38bdf8', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, fontFamily: 'monospace' }} />
                <Bar dataKey="roadsCutKm" name="Cut Roads (km)" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="priorityScore" name="Priority Score" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2 Charts: Agricultural Impact & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Agricultural Impact (Requested in Section 11) */}
        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-space-800">
            <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-status-safe" />
              AGRICULTURAL CROPLAND INUNDATION (HA)
            </h3>
            <span className="font-mono text-[10px] text-status-safe">Hectares Lost</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agriCropData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0B1F33" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050B14', borderColor: '#22c55e', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, fontFamily: 'monospace' }} />
                <Bar dataKey="totalHa" name="Total Hectares" fill="#0B1F33" radius={[4, 4, 0, 0]} />
                <Bar dataKey="floodedHa" name="Flooded Hectares" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Severity & Land Cover Distribution (Requested in Section 11) */}
        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-space-800">
            <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-electric" />
              SURFACE INUNDATION CLASSIFICATION (km²)
            </h3>
            <span className="font-mono text-[10px] text-cyan-electric">JRC + S1 Mask</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landCoverData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                >
                  {landCoverData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#050B14', borderColor: '#22d3ee', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
