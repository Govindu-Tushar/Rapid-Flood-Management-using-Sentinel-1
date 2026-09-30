import React from 'react';
import { 
  Radar, 
  MapPin, 
  Download, 
  Play, 
  Bell, 
  ShieldCheck, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';
import { LocationInfo, ViewMode } from '../../types';
import { DEMO_LOCATIONS } from '../../data/locations';

interface HeaderProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onNavigate: (view: ViewMode) => void;
  onOpenExport: () => void;
  isAnalyzing: boolean;
  currentView: ViewMode;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onNavigate,
  onOpenExport,
  isAnalyzing,
  currentView,
}) => {
  const getBreadcrumbTitle = (view: ViewMode) => {
    switch (view) {
      case 'dashboard': return 'INTELLIGENCE OVERVIEW';
      case 'analysis': return 'FLOOD ANALYSIS';
      case 'map': return 'LIVE MAP & SATELLITE TILES';
      case 'impact': return 'INFRASTRUCTURE IMPACT';
      case 'analytics': return 'ANALYTICS & METRICS';
      case 'priority': return 'PRIORITY DECISION ZONES';
      case 'about': return 'PROJECT INFORMATION';
      case 'datasources': return 'DATA SOURCES';
      case 'system': return 'SYSTEM STATUS';
      default: return 'COMMAND CENTER';
    }
  };

  return (
    <header className="bg-space-950/90 border-b border-space-800 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-electric/80 font-bold uppercase">
              <span>RAPIDFLOOD</span>
              <ChevronRight className="w-3 h-3 text-space-700" />
              <span className="text-slate-300">{getBreadcrumbTitle(currentView)}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-base lg:text-lg font-black font-display tracking-tight text-white flex items-center gap-2">
                <span>{getBreadcrumbTitle(currentView)}</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 border border-space-700 text-slate-400 hidden sm:inline-block">
                C-SAR IW
              </span>
            </div>
          </div>
        </div>

        {/* Right: AOI selector, Telemetry Badges, and Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* AOI Selector Dropdown */}
          <div className="flex items-center bg-space-900 border border-space-800 rounded-lg px-2.5 py-1.5 shadow-inner">
            <MapPin className="h-3.5 w-3.5 text-cyan-electric mr-1.5 shrink-0" />
            <span className="text-[11px] font-mono text-slate-400 mr-1.5 hidden sm:inline">AOI:</span>
            <select
              aria-label="Area of Interest"
              value={currentLocation.id}
              onChange={(e) => {
                const found = DEMO_LOCATIONS.find(l => l.id === e.target.value);
                if (found) onSelectLocation(found);
              }}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              {DEMO_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-space-950 text-slate-200">
                  {loc.name} ({loc.country})
                </option>
              ))}
            </select>
          </div>

          {/* Sentinel-1 Ready Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-space-900/90 border border-space-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-status-safe shadow-[0_0_8px_#22c55e] animate-pulse"></span>
            <span className="text-slate-300 font-semibold tracking-wide">SENTINEL-1 READY</span>
          </div>

          {/* DEMO MODE Badge */}
          <div 
            className="flex items-center gap-1.5 bg-status-amber/15 border border-status-amber/40 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-amber-300 font-mono"
            title="Using prepared demonstration geospatial data."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>DEMO MODE</span>
          </div>

          {/* Run Analysis Trigger */}
          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-sky-vivid to-cyan-glow hover:from-sky-400 hover:to-cyan-electric text-space-950 text-xs font-black px-3 py-1.5 rounded-lg shadow-glow-cyan transition-all active:scale-95"
            title="Launch SAR Processing"
          >
            <Play className="h-3 w-3 fill-space-950" />
            <span className="hidden sm:inline">ANALYZE</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 bg-space-900 hover:bg-space-850 text-slate-200 hover:text-white border border-space-800 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            title="Export GeoJSON / CSV Report"
          >
            <Download className="h-3.5 w-3.5 text-cyan-electric" />
            <span className="hidden sm:inline">EXPORT</span>
          </button>

          {/* System Notifications / Telemetry */}
          <button
            onClick={() => onNavigate('system')}
            className="p-1.5 text-slate-400 hover:text-cyan-electric hover:bg-space-900 border border-transparent hover:border-space-800 rounded-lg transition-colors relative"
            title="System Status & Telemetry"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-electric rounded-full"></span>
          </button>
        </div>

      </div>
    </header>
  );
};
