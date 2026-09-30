import React from 'react';
import { 
  BookOpen, 
  Satellite, 
  HelpCircle, 
  Target, 
  Layers, 
  FileText, 
  CheckCircle,
  Database,
  Radio,
  ShieldAlert
} from 'lucide-react';
import { WorkflowBanner } from '../components/dashboard/WorkflowBanner';

export const ProjectInfoView: React.FC = () => {
  const glossary = [
    { term: 'SAR', definition: 'Synthetic Aperture Radar. Radar technology used by Sentinel-1 to observe Earth\'s surface through clouds, rain, and nighttime darkness.' },
    { term: 'Backscatter (Sigma0 / dB)', definition: 'The radar energy reflected back toward the satellite antenna. Smooth standing water acts as a mirror, dropping backscatter sharply below -18 dB.' },
    { term: 'Pre-Flood Baseline', definition: 'Satellite observation acquired before the flood event representing baseline dry land and normal river levels.' },
    { term: 'Post-Flood Observation', definition: 'Satellite observation acquired during or shortly after the peak flood event.' },
    { term: 'Change Detection (ΔdB)', definition: 'Temporal log-ratio comparison between pre- and post-flood radar backscatter images to identify newly submerged pixels.' },
    { term: 'Flood Mask', definition: 'A binary geographic raster or polygon dataset identifying pixels detected as newly submerged by floodwater.' },
    { term: 'Inundation', definition: 'Terrestrial land surface temporarily submerged under floodwater.' },
    { term: 'GIS', definition: 'Geographic Information System used to capture, store, analyze, and visualize location-based spatial data.' },
    { term: 'Overlay Analysis', definition: 'Combining multiple spatial vector and raster layers (roads, buildings, agriculture) to determine intersecting affected features.' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="pb-3 border-b border-space-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric bg-cyan-glow/15 px-2.5 py-0.5 rounded border border-cyan-electric/30">
            MISSION DOCUMENTATION
          </span>
          <span className="font-mono text-[10px] text-slate-400">6-Hour Geospatial Hackathon</span>
        </div>
        <h1 className="text-3xl font-black font-display text-white tracking-tight uppercase">
          PROJECT INFORMATION & METHODOLOGY
        </h1>
      </div>

      {/* Formal Problem Statement Card (Exact Required Text) */}
      <div className="bg-gradient-to-r from-space-900 via-space-950 to-space-900 border-2 border-cyan-electric/40 rounded-2xl p-6 shadow-glow-cyan relative overflow-hidden">
        <div className="flex items-center gap-2 text-cyan-electric font-mono font-bold text-xs uppercase tracking-widest mb-3">
          <Target className="w-4 h-4" />
          FORMAL PROBLEM STATEMENT
        </div>
        <blockquote className="text-base sm:text-lg font-display font-medium text-slate-100 italic leading-relaxed border-l-4 border-cyan-electric pl-4 py-1">
          "Develop an automated satellite-based system for rapid flood detection and impact assessment using Sentinel-1 SAR imagery by comparing pre-flood and post-flood conditions, identifying newly inundated areas, and determining the affected settlements, roads, and agricultural land."
        </blockquote>
      </div>

      {/* Introduction & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-display font-bold text-white text-base uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-electric" />
            Introduction
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Floods are among the most frequent and damaging natural disasters, causing loss of life, damage to infrastructure, disruption of transportation, and destruction of agricultural land. Rapid identification of inundated areas is essential for emergency response and resource allocation.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            This project uses Sentinel-1 Synthetic Aperture Radar imagery to compare pre-flood and post-flood conditions, detect newly inundated areas, and assess the impact on settlements, roads, and agricultural land.
          </p>
        </div>

        <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-display font-bold text-white text-base uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-status-safe" />
            Primary Objective
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-bold font-sans">
            "To develop a rapid satellite-based flood detection and impact assessment system using Sentinel-1 SAR imagery."
          </p>
          <div className="space-y-2 pt-2 border-t border-space-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
              <span>All-weather day & night microwave active sensing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
              <span>Permanent water masking via JRC Global Surface Water</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
              <span>Instant algorithmic decision-support prioritization</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Workflow Representation */}
      <div className="space-y-2">
        <h3 className="font-display font-bold text-white text-sm uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-electric" />
          End-to-End Processing Workflow
        </h3>
        <WorkflowBanner />
      </div>

      {/* Technical Glossary Section */}
      <div className="bg-space-900/90 border border-space-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-space-800">
          <h3 className="font-display font-bold text-white text-base uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-electric" />
            Technical Terms & Geospatial Glossary
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Definitions & Principles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {glossary.map((item, idx) => (
            <div
              key={idx}
              className="bg-space-950 border border-space-800 rounded-xl p-3.5 space-y-1 hover:border-cyan-electric/40 transition-colors"
            >
              <span className="font-mono font-bold text-cyan-electric text-xs tracking-wide">
                {item.term}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accuracy & Ethics Disclaimer */}
      <div className="p-4 bg-status-amber/10 border border-status-amber/25 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-status-amber shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed space-y-1 font-sans">
          <strong className="text-status-amber font-semibold block font-mono">Important Accuracy & Decision-Support Notice:</strong>
          <p>
            This system provides satellite-based flood detection and impact indicators for decision support. It does not replace official civil defense evacuation mandates. In demo mode, results are derived from prepared demonstration datasets based on real Sentinel-1 acquisitions.
          </p>
        </div>
      </div>

    </div>
  );
};
