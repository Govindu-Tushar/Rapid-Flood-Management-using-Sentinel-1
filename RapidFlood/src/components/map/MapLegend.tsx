import React from 'react';

export const MapLegend: React.FC = () => {
  const legendItems = [
    { label: 'Newly Inundated Area (Flood)', color: '#22d3ee', type: 'fill', desc: 'SAR ΔdB < -3.2 (Drop)' },
    { label: 'Permanent Water Body', color: '#0369a1', type: 'fill', desc: 'JRC Global Surface Water' },
    { label: 'Submerged Road Segment', color: '#ea580c', type: 'line', desc: 'OSM Cut / Inundated' },
    { label: 'Passable Road Segment', color: '#64748b', type: 'line', desc: 'OSM Highway Network' },
    { label: 'Inundated Settlement / Building', color: '#ef4444', type: 'point', desc: 'Cluster or Clinic/School' },
    { label: 'Inundated Agricultural Cropland', color: '#22c55e', type: 'fill', desc: 'Paddy / Horticultural Plot' },
    { label: 'High Priority Response Zone', color: '#ef4444', type: 'fill', desc: 'Urgent Action Area' },
    { label: 'Medium Priority Response Zone', color: '#f59e0b', type: 'fill', desc: 'Elevated Surveillance' },
  ];

  return (
    <div className="bg-space-950/95 border border-cyan-electric/30 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl max-w-xs text-xs select-none font-mono">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-space-800">
        <span className="font-bold text-white uppercase tracking-widest text-[10px]">
          GEOSPATIAL LEGEND
        </span>
        <span className="text-[10px] text-cyan-electric font-mono">10m SAR</span>
      </div>

      <div className="space-y-1.5">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {item.type === 'fill' && (
                <span
                  className="w-3.5 h-3.5 rounded shrink-0 border border-white/20"
                  style={{ backgroundColor: item.color, opacity: 0.9 }}
                />
              )}
              {item.type === 'line' && (
                <span
                  className="w-4 h-1 rounded shrink-0"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {item.type === 'point' && (
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white/40 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-slate-200 font-sans text-[11px] truncate max-w-[140px]" title={item.label}>
                {item.label}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono shrink-0">
              {item.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
