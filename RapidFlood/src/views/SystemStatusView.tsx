import React from 'react';
import { 
  Server, 
  Radio, 
  Satellite, 
  Database, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Wifi, 
  Clock 
} from 'lucide-react';
import { AnalysisResults } from '../types';

interface SystemStatusViewProps {
  results: AnalysisResults;
}

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({ results }) => {
  const subsystems = [
    { name: 'SATELLITE DATA STREAM', status: 'READY', desc: 'Copernicus Sentinel-1 SAR IW GRD ingestion channel', icon: <Satellite className="w-5 h-5 text-cyan-electric" />, latency: '42 ms' },
    { name: 'SAR PROCESSING ENGINE', status: 'READY', desc: 'Radiometric calibration & Refined Lee speckle filter', icon: <Cpu className="w-5 h-5 text-sky-glow" />, latency: '128 ms' },
    { name: 'GIS SPATIAL OVERLAY', status: 'READY', desc: 'OpenStreetMap vector topology intersection pipeline', icon: <HardDrive className="w-5 h-5 text-status-amber" />, latency: '65 ms' },
    { name: 'MAP TILE ENGINE', status: 'READY', desc: 'Leaflet 1.9 WebGL canvas with CartoDB & Esri layers', icon: <Radio className="w-5 h-5 text-cyan-electric" />, latency: '18 ms' },
    { name: 'IMPACT ANALYSIS MATRIX', status: 'READY', desc: 'Multi-sectoral damage quantification & priority model', icon: <Activity className="w-5 h-5 text-status-safe" />, latency: '35 ms' },
    { name: 'HYDROLOGICAL BASELINE', status: 'READY', desc: 'JRC Global Surface Water seasonality raster cache', icon: <Database className="w-5 h-5 text-cyan-glow" />, latency: '12 ms' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-status-safe bg-status-safe/15 px-2.5 py-0.5 rounded border border-status-safe/30">
              MISSION TELEMETRY
            </span>
          </div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight uppercase">
            SYSTEM STATUS & TELEMETRY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operational status of satellite downlinks, SAR pipelines, and GIS raster compute
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-space-900 border border-status-safe/40 text-status-safe font-mono text-xs font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-status-safe shadow-[0_0_8px_#22c55e] animate-pulse" />
          <span>ALL SUBSYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Subsystem Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subsystems.map((sub, idx) => (
          <div
            key={idx}
            className="bg-space-900/90 border border-space-800 hover:border-cyan-electric/40 rounded-xl p-4 shadow-xl transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-space-950 border border-space-800">
                  {sub.icon}
                </div>
                <div>
                  <h3 className="font-mono font-bold text-white text-xs tracking-wider">
                    {sub.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                    {sub.desc}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-status-safe bg-status-safe/10 border border-status-safe/30 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-ping" />
                <span>{sub.status}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-space-800/80 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Telemetry Latency: <strong className="text-slate-200">{sub.latency}</strong>
              </span>
              <span className="text-cyan-electric font-semibold">100% Uptime</span>
            </div>
          </div>
        ))}
      </div>

      {/* Satellite Orbital Information */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
          <Satellite className="w-4 h-4 text-cyan-electric" />
          ACTIVE SATELLITE CONSTELLATION TELEMETRY
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-space-950 p-3 rounded-xl border border-space-800">
            <span className="text-slate-400 text-[10px] uppercase block">Platform</span>
            <span className="font-bold text-white mt-1 block">Sentinel-1A C-SAR</span>
          </div>
          <div className="bg-space-950 p-3 rounded-xl border border-space-800">
            <span className="text-slate-400 text-[10px] uppercase block">Radar Frequency</span>
            <span className="font-bold text-cyan-electric mt-1 block">5.405 GHz (C-Band)</span>
          </div>
          <div className="bg-space-950 p-3 rounded-xl border border-space-800">
            <span className="text-slate-400 text-[10px] uppercase block">Swath & Resolution</span>
            <span className="font-bold text-sky-glow mt-1 block">250 km • 10m GRD</span>
          </div>
          <div className="bg-space-950 p-3 rounded-xl border border-space-800">
            <span className="text-slate-400 text-[10px] uppercase block">Temporal Repeat</span>
            <span className="font-bold text-status-safe mt-1 block">12 Days Constellation</span>
          </div>
        </div>
      </div>

    </div>
  );
};
