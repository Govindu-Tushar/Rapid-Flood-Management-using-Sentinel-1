import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Globe2, Radio } from 'lucide-react';
import { LocationInfo } from '../../types';
import { DEMO_LOCATIONS } from '../../data/locations';

interface AoiSelectorProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const AoiSelector: React.FC<AoiSelectorProps> = ({
  currentLocation,
  onSelectLocation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-light/90 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-cyan-electric" />
          AREA OF INTEREST
        </label>
        <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
          DEMO DATASET
        </span>
      </div>

      {/* Custom Trigger Card */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
          isOpen
            ? 'bg-[#081522] border-cyan-electric shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-electric'
            : 'bg-[#081522] border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-electric shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Selected Target AOI
            </div>
            <div className="text-sm font-mono font-black text-white truncate tracking-wide">
              {currentLocation.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
            {currentLocation.country}
          </span>
          <ChevronDown className={`w-4 h-4 text-cyan-electric transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Selected region summary footer */}
      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
        <span className="flex items-center gap-1.5 text-cyan-electric/90 truncate">
          <Radio className="w-3 h-3 text-cyan-electric animate-pulse shrink-0" />
          <span className="font-bold text-white uppercase text-[10px] tracking-wider">DEMO FLOOD ZONE:</span>{' '}
          <span className="truncate">{currentLocation.region}</span>
        </span>
        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
          10m SAR GRD
        </span>
      </div>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 left-0 right-0 mt-2 p-2 rounded-2xl bg-[#081522] border border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          style={{ backgroundColor: '#081522' }}
        >
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-space-800">
            PREDEFINED CALIBRATED FLOOD DEMO LOCATIONS
          </div>

          <div className="mt-1 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {DEMO_LOCATIONS.map((loc) => {
              const isSelected = loc.id === currentLocation.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-electric/60 text-white'
                      : 'hover:bg-space-900 border border-transparent text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-electric' : 'text-slate-500'}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-bold text-white truncate flex items-center gap-2">
                        {loc.name}
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-electric text-space-950">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {loc.region} · {loc.country}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-electric/80 mt-0.5">
                        {loc.preFloodDate} → {loc.postFloodDate}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-electric shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
