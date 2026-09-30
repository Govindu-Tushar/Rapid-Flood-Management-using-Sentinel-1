import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trendText?: string;
  trendType?: 'up' | 'down' | 'neutral';
  statusBadge?: string;
  accentGlow?: 'cyan' | 'sky' | 'rose' | 'amber' | 'emerald';
  isDemo?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trendText,
  trendType = 'up',
  statusBadge,
  accentGlow = 'cyan',
  isDemo = true,
}) => {
  const glowStyles = {
    cyan: 'border-cyan-electric/25 group-hover:border-cyan-electric/60 group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.25)]',
    sky: 'border-sky-glow/25 group-hover:border-sky-glow/60 group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]',
    rose: 'border-status-emergency/25 group-hover:border-status-emergency/60 group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.25)]',
    amber: 'border-status-amber/25 group-hover:border-status-amber/60 group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)]',
    emerald: 'border-status-safe/25 group-hover:border-status-safe/60 group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.25)]',
  }[accentGlow];

  const topAccentBar = {
    cyan: 'bg-gradient-to-r from-cyan-glow via-cyan-electric to-transparent',
    sky: 'bg-gradient-to-r from-sky-deep via-sky-glow to-transparent',
    rose: 'bg-gradient-to-r from-status-emergency via-rose-400 to-transparent',
    amber: 'bg-gradient-to-r from-status-amber via-yellow-300 to-transparent',
    emerald: 'bg-gradient-to-r from-status-safe via-emerald-300 to-transparent',
  }[accentGlow];

  return (
    <div className={`group relative bg-space-900/80 backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 ${glowStyles} overflow-hidden`}>
      
      {/* Top glowing accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${topAccentBar}`} />

      {/* Header: Title and Icon */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-space-950/80 border border-space-800 text-cyan-electric group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      {/* Metric Display */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl lg:text-4xl font-black tracking-tight text-white font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            {unit}
          </span>
        )}
      </div>

      {/* Trend & Status Row */}
      <div className="mt-4 pt-2.5 border-t border-space-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300 truncate max-w-[180px]">
          {trendType === 'up' && <span className="text-cyan-electric font-bold">▲</span>}
          {trendType === 'down' && <span className="text-status-emergency font-bold">▼</span>}
          <span>{trendText}</span>
        </div>

        {statusBadge && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-space-950 border border-space-700 text-slate-300 shrink-0">
            {statusBadge}
          </span>
        )}
      </div>

    </div>
  );
};
