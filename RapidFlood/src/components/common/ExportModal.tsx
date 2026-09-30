import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Database, 
  Printer, 
  Check, 
  Copy, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { AnalysisResults } from '../../types';
import { exportResultsAsCSV, exportResultsAsGeoJSON } from '../../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: AnalysisResults;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  results,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `RAPID FLOOD IMPACT ASSESSMENT REPORT
Location: ${results.location.name} (${results.location.country})
Observation Period: Pre-flood (${results.parameters.preFloodDate}) vs Post-flood (${results.parameters.postFloodDate})
Sensor: Sentinel-1 C-SAR IW GRD (Threshold: ${results.parameters.thresholdDb} dB)

KEY METRICS:
- Flooded Area: ${results.summary.floodedAreaKm2} km² (${results.summary.percentageAreaFlooded}% of AOI)
- Affected Settlements: ${results.impact.settlements.affectedBuildings} structures (${results.impact.settlements.criticalFacilitiesFlooded} critical facilities)
- Affected Roads: ${results.impact.roads.affectedRoadsKm} km (${results.impact.roads.criticalCorridorsCut} cut evacuation corridors)
- Flooded Agriculture: ${results.impact.agriculture.floodedAgriAreaKm2} km²
- Decision Support Severity: ${results.summary.severity}

DISCLAIMER: Generated as part of the RapidFlood decision-support system. Prepared demo mode data for hackathon demonstration.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-xl">
      <div className="bg-space-900 border border-cyan-electric/40 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-space-950 border-b border-space-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-space-900 border border-cyan-electric/30 text-cyan-electric">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-base uppercase">
                EXPORT FLOOD INTELLIGENCE DATA & REPORTS
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Tabular CSV metrics, GIS GeoJSON vector bundles, or printable briefings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 font-mono">
          
          {/* Quick Download Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => exportResultsAsCSV(results)}
              className="p-4 bg-space-950 hover:bg-space-850 border border-space-800 hover:border-cyan-electric/50 rounded-xl flex flex-col items-center text-center transition-all group"
            >
              <FileText className="w-6 h-6 text-cyan-electric mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-sm">CSV METRICS SHEET</span>
              <span className="text-[11px] text-slate-400 mt-1 font-sans">Full tabular indicators for Excel, Python & R</span>
            </button>

            <button
              onClick={() => exportResultsAsGeoJSON(results)}
              className="p-4 bg-space-950 hover:bg-space-850 border border-space-800 hover:border-cyan-electric/50 rounded-xl flex flex-col items-center text-center transition-all group"
            >
              <Database className="w-6 h-6 text-sky-glow mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-sm">GEOJSON GIS LAYER</span>
              <span className="text-[11px] text-slate-400 mt-1 font-sans">Vector layers for QGIS, ArcGIS, or Mapbox</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-4 bg-space-950 hover:bg-space-850 border border-space-800 hover:border-cyan-electric/50 rounded-xl flex flex-col items-center text-center transition-all group"
            >
              <Printer className="w-6 h-6 text-status-safe mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-sm">PRINTABLE SUMMARY</span>
              <span className="text-[11px] text-slate-400 mt-1 font-sans">Printer-ready or PDF-saveable executive briefing</span>
            </button>
          </div>

          {/* Report Preview */}
          <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-space-800">
              <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                EXECUTIVE SUMMARY BRIEFING PREVIEW
              </span>
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1 text-[11px] text-cyan-electric hover:text-white font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-status-safe" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'COPIED!' : 'COPY BRIEFING'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center py-2.5 bg-space-900/60 rounded-xl border border-space-800/80">
              <div>
                <div className="text-slate-400 text-[10px]">FLOOD EXTENT</div>
                <div className="text-base font-black text-cyan-electric">{results.summary.floodedAreaKm2} km²</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">AFFECTED HOUSES</div>
                <div className="text-base font-black text-rose-400">{results.impact.settlements.affectedBuildings.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">SUBMERGED ROADS</div>
                <div className="text-base font-black text-orange-400">{results.impact.roads.affectedRoadsKm} km</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">CROPLAND LOSS</div>
                <div className="text-base font-black text-status-safe">{results.impact.agriculture.floodedAgriAreaKm2} km²</div>
              </div>
            </div>

            <div className="text-slate-400 text-[11px] space-y-1">
              <div><strong>LOCATION:</strong> {results.location.name}, {results.location.region}</div>
              <div><strong>SENSOR:</strong> Sentinel-1 C-SAR IW Mode (VV Polarization, 10m GRD)</div>
              <div><strong>TEMPORAL PAIR:</strong> Pre-flood {results.parameters.preFloodDate} vs Post-flood {results.parameters.postFloodDate}</div>
              <div><strong>THRESHOLD:</strong> ΔdB &lt; {results.parameters.thresholdDb} dB with JRC surface water masking</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-status-amber/10 border border-status-amber/25 rounded-xl p-3 flex items-start gap-2.5 font-sans">
            <ShieldAlert className="w-4 h-4 text-status-amber shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-200/90 leading-relaxed">
              <strong>Decision Support Notice:</strong> This analysis is intended for rapid situational awareness and resource prioritization. It does not replace ground-truth civil defense evaluations. In demo mode, results are derived from prepared demonstration datasets based on real Sentinel-1 acquisitions.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-space-950 border-t border-space-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-white font-mono text-xs font-bold transition-colors"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
