import React from 'react';
import { 
  Droplets, 
  Building2, 
  Navigation, 
  Wheat, 
  Radio, 
  Play, 
  Map as MapIcon, 
  ArrowUpRight, 
  Layers, 
  ShieldAlert, 
  AlertTriangle,
  ExternalLink,
  Target,
  Sparkles,
  Compass,
  Satellite
} from 'lucide-react';
import { AnalysisResults, ViewMode } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { WorkflowBanner } from '../components/dashboard/WorkflowBanner';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface DashboardViewProps {
  results: AnalysisResults;
  onNavigate: (view: ViewMode) => void;
  onOpenExport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  results,
  onNavigate,
  onOpenExport,
}) => {
  const { summary, impact, location, priorityZones } = results;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* 1. Large Hero Command Section */}
      <div className="relative bg-gradient-to-br from-space-900 via-space-950 to-space-900 border border-cyan-electric/25 rounded-2xl p-6 lg:p-8 shadow-2xl overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-vivid/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left 8 Cols: Mission Headline & Subtitle */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Tagline Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-glow/15 border border-cyan-electric/40 text-[11px] font-mono font-bold tracking-widest text-cyan-electric uppercase shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <Satellite className="w-3.5 h-3.5 text-cyan-electric animate-pulse" />
                SATELLITE-POWERED FLOOD INTELLIGENCE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-amber/15 border border-status-amber/40 text-[10px] font-mono font-bold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                DEMO MODE — Prepared Sentinel-1 SAR Data
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase leading-none">
                RAPID FLOOD <span className="bg-gradient-to-r from-cyan-electric via-sky-glow to-blue-400 bg-clip-text text-transparent">INTELLIGENCE</span>
              </h1>
              <div className="text-lg sm:text-xl font-display font-bold text-slate-300 tracking-wide mt-2">
                Detect. Assess. Respond.
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed font-sans">
              Autonomous satellite-powered flood detection and geospatial impact assessment utilizing Sentinel-1 Synthetic Aperture Radar (SAR) backscatter change detection across roads, settlements, and agricultural zones.
            </p>

            {/* Big Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('analysis')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-vivid to-cyan-glow hover:from-sky-400 hover:to-cyan-electric active:scale-95 text-space-950 font-black text-xs font-mono tracking-wider shadow-glow-cyan flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-space-950" />
                <span>RUN FLOOD ANALYSIS</span>
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="py-3 px-6 rounded-xl bg-space-900/90 hover:bg-space-850 active:scale-95 text-cyan-electric hover:text-white border border-cyan-electric/40 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <MapIcon className="w-4 h-4 text-cyan-electric" />
                <span>OPEN LIVE MAP</span>
              </button>

              <button
                onClick={() => onNavigate('priority')}
                className="py-3 px-5 rounded-xl bg-space-900/60 hover:bg-space-900 text-slate-300 hover:text-white border border-space-800 font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all"
              >
                <Target className="w-3.5 h-3.5 text-status-emergency" />
                <span>PRIORITY ZONES</span>
              </button>
            </div>

          </div>

          {/* Right 4 Cols: Stylized Glowing Radar Scanner Visual */}
          <div className="lg:col-span-4 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-electric/30 bg-space-950/90 flex items-center justify-center shadow-radar overflow-hidden">
              
              {/* Concentric Radar Rings */}
              <div className="absolute inset-4 rounded-full border border-cyan-electric/20" />
              <div className="absolute inset-12 rounded-full border border-cyan-electric/15" />
              <div className="absolute inset-20 rounded-full border border-cyan-electric/25 border-dashed" />
              <div className="absolute inset-28 rounded-full border border-cyan-electric/30" />

              {/* Crosshair Grids */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-cyan-electric/20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-[1px] bg-cyan-electric/20" />
              </div>

              {/* Diagonal Reticle ticks */}
              <div className="absolute top-2 font-mono text-[9px] text-cyan-electric/60">000° N</div>
              <div className="absolute right-2 font-mono text-[9px] text-cyan-electric/60">090° E</div>
              <div className="absolute bottom-2 font-mono text-[9px] text-cyan-electric/60">180° S</div>
              <div className="absolute left-2 font-mono text-[9px] text-cyan-electric/60">270° W</div>

              {/* Animated Radar Scanning Line */}
              <div className="absolute inset-0 rounded-full radar-sweep-effect pointer-events-none" />

              {/* Target Inundation Cluster Blips */}
              <div className="absolute top-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-status-emergency shadow-[0_0_10px_#ef4444] animate-ping" />
              <div className="absolute top-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-status-emergency" />
              
              <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-cyan-electric shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-status-amber shadow-[0_0_8px_#f59e0b]" />

              {/* Center Core */}
              <div className="relative z-10 flex flex-col items-center justify-center p-3 rounded-xl bg-space-900/90 border border-cyan-electric/40 text-center shadow-lg">
                <Radio className="w-5 h-5 text-cyan-electric animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-white tracking-widest mt-1">SENTINEL-1A</span>
                <span className="font-mono text-[8px] text-cyan-electric font-semibold">ORBIT 142 • IW</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 2. Premium KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="FLOOD EXTENT"
          value={summary.floodedAreaKm2}
          unit="km²"
          icon={<Droplets className="w-5 h-5 text-cyan-electric" />}
          trendText={`▲ ${summary.percentageAreaFlooded}% detected area`}
          trendType="up"
          statusBadge={summary.severity.toUpperCase()}
          accentGlow="cyan"
          isDemo={results.isDemo}
        />

        <StatCard
          title="AFFECTED ROADS"
          value={impact.roads.affectedRoadsKm}
          unit="km"
          icon={<Navigation className="w-5 h-5 text-sky-glow" />}
          trendText={`▲ ${impact.roads.criticalCorridorsCut} cut evacuation routes`}
          trendType="down"
          statusBadge={`${impact.roads.affectedSegmentsCount} SEGMENTS`}
          accentGlow="sky"
          isDemo={results.isDemo}
        />

        <StatCard
          title="SETTLEMENTS"
          value={impact.settlements.affectedBuildings}
          unit="structures"
          icon={<Building2 className="w-5 h-5 text-status-emergency" />}
          trendText={`▲ ${impact.settlements.criticalFacilitiesFlooded} critical civic sites`}
          trendType="down"
          statusBadge={`${impact.settlements.affectedSettlementClusters} CLUSTERS`}
          accentGlow="rose"
          isDemo={results.isDemo}
        />

        <StatCard
          title="AGRICULTURE"
          value={impact.agriculture.floodedAgriAreaKm2}
          unit="km²"
          icon={<Wheat className="w-5 h-5 text-status-safe" />}
          trendText={`${impact.agriculture.percentageAgriAffected}% cultivated land`}
          trendType="neutral"
          statusBadge="HIGH RISK"
          accentGlow="emerald"
          isDemo={results.isDemo}
        />
      </div>

      {/* 3. HERO MAP DISPLAY (Prominent large map panel as requested) */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-4 shadow-2xl space-y-3 relative">
        
        {/* Header Bar above Map */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-space-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-electric" />
            <h2 className="font-display font-bold text-base text-white tracking-wide uppercase">
              LIVE FLOOD EXTENT INTELLIGENCE MAP
            </h2>
            <span className="font-mono text-[10px] text-cyan-electric bg-cyan-glow/10 border border-cyan-electric/30 px-2 py-0.5 rounded">
              EPSG:4326
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">
              Active AOI: <strong className="text-white">{location.name}</strong>
            </span>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs font-mono font-bold text-cyan-electric hover:text-white flex items-center gap-1 bg-space-950 px-3 py-1.5 rounded-lg border border-cyan-electric/30 transition-all hover:shadow-glow-cyan"
            >
              <span>EXPAND MAP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Huge Leaflet Map Canvas */}
        <div className="relative rounded-xl overflow-hidden border border-space-800/80">
          <InteractiveMap results={results} className="h-[520px] w-full" />
        </div>

        {/* Map Bottom Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="bg-space-950/80 border border-space-800 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px] uppercase block">Area of Interest</span>
            <span className="font-bold text-white">{location.name}</span>
          </div>
          <div className="bg-space-950/80 border border-space-800 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px] uppercase block">Inundation Extent</span>
            <span className="font-bold text-cyan-electric">{summary.floodedAreaKm2} km²</span>
          </div>
          <div className="bg-space-950/80 border border-space-800 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px] uppercase block">Observation Date</span>
            <span className="font-bold text-slate-300">{location.postFloodDate}</span>
          </div>
          <div className="bg-space-950/80 border border-space-800 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px] uppercase block">Sensor Polarization</span>
            <span className="font-bold text-status-safe">C-SAR VV (10m Res)</span>
          </div>
        </div>

      </div>

      {/* 4. Processing Pipeline Banner */}
      <WorkflowBanner />

      {/* 5. Priority Zones Decision Support Summary */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-space-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-status-emergency" />
            <div>
              <h3 className="font-display font-bold text-base text-white uppercase">
                EMERGENCY PRIORITY DECISION ZONES
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Ranked by spatial overlap of flood depth, severed highway bottlenecks, and residential density
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('priority')}
            className="text-xs font-mono font-bold text-cyan-electric hover:text-white flex items-center gap-1"
          >
            VIEW FULL PRIORITY MATRIX →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityZones.slice(0, 2).map((pz) => (
            <div
              key={pz.id}
              className="bg-space-950/90 border border-space-800 rounded-xl p-4 hover:border-cyan-electric/40 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  pz.level === 'High Priority'
                    ? 'bg-status-emergency/20 text-rose-300 border-status-emergency/40'
                    : 'bg-status-amber/20 text-amber-300 border-status-amber/40'
                }`}>
                  {pz.level.toUpperCase()}
                </span>
                <span className="font-mono text-xs font-bold text-cyan-electric">
                  SCORE: {pz.score}/100
                </span>
              </div>

              <h4 className="font-display font-bold text-white text-sm">
                {pz.name}
              </h4>

              <p className="text-xs text-slate-300 font-sans">
                <strong className="text-slate-400">Response Directive:</strong> {pz.recommendedAction}
              </p>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-space-800/80 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">FLOOD</span>
                  <span className="text-cyan-electric font-bold">{pz.floodedAreaKm2} km²</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ROADS</span>
                  <span className="text-sky-glow font-bold">{pz.affectedRoadsKm} km</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">HOUSES</span>
                  <span className="text-rose-400 font-bold">{pz.affectedSettlements}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">AGRI</span>
                  <span className="text-status-safe font-bold">{pz.agriculturalLossKm2} km²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
