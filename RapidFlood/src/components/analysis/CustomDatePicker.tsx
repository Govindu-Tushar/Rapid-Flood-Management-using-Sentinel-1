import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CustomDatePickerProps {
  label: string;
  value: string; // ISO format: 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  minDate?: string;
  maxDate?: string;
  helperText?: string;
}

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const SHORT_MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const WEEK_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const parseDate = (str: string): Date => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return new Date();
    return new Date(y, m - 1, d);
  };

  const currentDate = parseDate(value);
  const [viewYear, setViewYear] = useState<number>(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(currentDate.getMonth());

  // Update view when value changes externally
  useEffect(() => {
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  // Click outside listener
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

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const newDateStr = `${viewYear}-${mm}-${dd}`;
    onChange(newDateStr);
    setIsOpen(false);
  };

  // Format display text: "15 MAY 2026"
  const formatDisplay = (str: string): string => {
    if (!str) return 'SELECT DATE';
    const d = parseDate(str);
    const day = d.getDate();
    const month = SHORT_MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Generate calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-light/90 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse" />
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] font-mono text-slate-400">
            {helperText}
          </span>
        )}
      </div>

      {/* Date Trigger Card */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
          isOpen
            ? 'bg-[#081522] border-cyan-electric shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-electric'
            : 'bg-[#081522] border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-electric group-hover:scale-105 group-hover:bg-cyan-500/20 transition-transform">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Observation Date
            </div>
            <div className="text-sm font-mono font-black text-white tracking-wide">
              {formatDisplay(value)}
            </div>
          </div>
        </div>

        <div className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-space-900 border border-space-700 text-cyan-electric group-hover:border-cyan-500/40">
          S1-SAR
        </div>
      </button>

      {/* Popover Calendar (Never Turns White!) */}
      {isOpen && (
        <div 
          className="absolute z-50 left-0 mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-[#081522] border border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
          style={{ backgroundColor: '#081522' }}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-space-900 border border-space-700 hover:border-cyan-electric text-slate-300 hover:text-cyan-electric transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-space-900 border border-space-700 hover:border-cyan-electric text-slate-300 hover:text-cyan-electric transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 border-b border-space-800/60 mb-2">
            {WEEK_DAYS.map((wd) => (
              <span key={wd} className="text-[10px] font-mono font-bold text-slate-400">
                {wd}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month filler days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-[11px] font-mono text-slate-700 cursor-not-allowed select-none"
                >
                  {dNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                currentDate.getFullYear() === viewYear &&
                currentDate.getMonth() === viewMonth &&
                currentDate.getDate() === day;

              return (
                <button
                  key={`cur-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-mono font-bold transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-space-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-105'
                      : 'text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-electric hover:border hover:border-cyan-500/40'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick actions footer */}
          <div className="mt-3 pt-2.5 border-t border-space-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 text-[10px]">
              Sentinel-1 Temporal Pair
            </span>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                onChange(`${today.getFullYear()}-${mm}-${dd}`);
                setIsOpen(false);
              }}
              className="text-cyan-electric hover:underline font-bold text-[10px]"
            >
              TODAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
