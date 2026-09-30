import React from 'react';
import { 
  Activity, 
  Cpu, 
  Map as MapIcon, 
  BarChart3, 
  AlertTriangle, 
  Info, 
  Database,
  Radio,
  Server,
  Layers,
  ShieldAlert,
  Terminal,
  Compass
} from 'lucide-react';
import { ViewMode } from '../../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isAnalyzing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isAnalyzing
}) => {
  const primaryNav: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { 
      id: 'analysis', 
      label: 'Flood Analysis', 
      icon: <Cpu className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-cyan-electric' : ''}`} />,
      badge: isAnalyzing ? 'RUNNING' : undefined
    },
    { id: 'map', label: 'Live Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact Assessment', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'priority', label: 'Priority Zones', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const secondaryNav: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'about', label: 'Information', icon: <Info className="w-4 h-4" /> },
    { id: 'datasources', label: 'Data Sources', icon: <Database className="w-4 h-4" /> },
    { id: 'system', label: 'System Status', icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-space-950 border-r border-space-800 flex flex-col shrink-0 min-h-[calc(100vh-60px)] justify-between select-none shadow-2xl">
      
      {/* Top Branding Section */}
      <div>
        <div className="p-4 border-b border-space-800/80 bg-space-900/40">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl bg-space-900 border border-cyan-electric/40 flex items-center justify-center shadow-glow-cyan">
              <Radio className="h-6 w-6 text-cyan-electric animate-pulse" />
              <div className="absolute inset-0 rounded-xl border border-cyan-electric/20 animate-ping-slow pointer-events-none" />
            </div>
            <div>
              <div className="font-display font-black text-lg tracking-wider text-white flex items-center leading-none">
                RAPID<span className="text-cyan-electric ml-1">FLOOD</span>
              </div>
              <div className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-1">
                FLOOD INTELLIGENCE PLATFORM
              </div>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            MISSION OPERATIONS
          </div>
          {primaryNav.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-glow/20 via-sky-vivid/10 to-transparent text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-900/60'
                }`}
              >
                {/* Active Cyan Neon Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-electric shadow-[0_0_12px_#22d3ee]" />
                )}

                <div className="flex items-center gap-3 pl-1">
                  <span className={`${isActive ? 'text-cyan-electric' : 'text-slate-400 group-hover:text-cyan-electric'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-electric text-space-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="px-5 my-2">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-space-800 to-transparent" />
        </div>

        {/* Secondary Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            DOCUMENTATION & TELEMETRY
          </div>
          {secondaryNav.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-space-900 text-cyan-electric font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-900/40'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-cyan-electric shadow-[0_0_8px_#22d3ee]" />
                )}
                <span className={isActive ? 'text-cyan-electric' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="p-3 m-3 bg-space-900/80 border border-space-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-safe opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-safe shadow-[0_0_8px_#22c55e]"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200">
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-space-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>COPERNICUS S-1</span>
          <span className="text-cyan-electric">10m C-SAR</span>
        </div>
      </div>

    </aside>
  );
};
