import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Calendar, 
  Sliders, 
  Play, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  FileCode2, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Droplets,
  Radio,
  Cpu,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileDown,
  Activity,
  Layers as LayersIcon
} from 'lucide-react';
import { AnalysisResults, LocationInfo, AnalysisParameters } from '../types';
import { DEMO_LOCATIONS } from '../data/locations';
import { GEE_JAVASCRIPT_CODE } from '../data/geeScript';

// Analysis Sub-components
import { CustomDatePicker } from '../components/analysis/CustomDatePicker';
import { AoiSelector } from '../components/analysis/AoiSelector';
import { AnalysisWorkflowSteps } from '../components/analysis/AnalysisWorkflowSteps';
import { SatelliteRadarVisual } from '../components/analysis/SatelliteRadarVisual';
import { InPageProcessingView } from '../components/analysis/InPageProcessingView';
import { BeforeAfterComparison } from '../components/analysis/BeforeAfterComparison';
import { TechnicalWorkflowGuide } from '../components/analysis/TechnicalWorkflowGuide';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface FloodAnalysisViewProps {
  results: AnalysisResults;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onRunAnalysis: (params: AnalysisParameters) => void;
  isAnalyzing: boolean;
}

export const FloodAnalysisView: React.FC<FloodAnalysisViewProps> = ({
  results,
  currentLocation,
  onSelectLocation,
  onRunAnalysis,
  isAnalyzing,
}) => {
  const [preDate, setPreDate] = useState(currentLocation.preFloodDate);
  const [postDate, setPostDate] = useState(currentLocation.postFloodDate);
  const [polarization, setPolarization] = useState<'VV' | 'VH' | 'VV+VH'>('VV');
  const [thresholdDb, setThresholdDb] = useState<number>(-3.2);
  const [filterType, setFilterType] = useState<'Refined Lee (7x7)' | 'Frost (5x5)' | 'Gamma MAP'>('Refined Lee (7x7)');
  const [processingMode, setProcessingMode] = useState<string>('Standard Interferometric Wide (IW)');
  const [maskPermanentWater, setMaskPermanentWater] = useState<boolean>(true);
  const [maskSteepSlopes, setMaskSteepSlopes] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'gee_script'>('parameters');

  // In-page workflow state machine: 'idle' | 'processing' | 'results'
  // Initial state is 'results' if we already have valid results for this location, or 'idle'
  const [pageState, setPageState] = useState<'idle' | 'processing' | 'results'>('results');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync dates when location changes
  useEffect(() => {
    setPreDate(currentLocation.preFloodDate);
    setPostDate(currentLocation.postFloodDate);
  }, [currentLocation]);

  // Validation logic
  useEffect(() => {
    if (!preDate || !postDate) {
      setValidationError('BOTH PRE-FLOOD AND POST-FLOOD DATES ARE REQUIRED');
      return;
    }

    const tPre = new Date(preDate).getTime();
    const tPost = new Date(postDate).getTime();

    if (tPost <= tPre) {
      setValidationError('POST-FLOOD DATE MUST BE AFTER PRE-FLOOD DATE');
    } else {
      setValidationError(null);
    }
  }, [preDate, postDate]);

  // Handle location selection
  const handleLocationChange = (loc: LocationInfo) => {
    onSelectLocation(loc);
    setPreDate(loc.preFloodDate);
    setPostDate(loc.postFloodDate);
    setPageState('results');
  };

  // Trigger analysis execution
  const handleExecute = () => {
    if (validationError) return;
    setPageState('processing');
  };

  // Called when in-page satellite processing animation finishes
  const handleInPageProcessingComplete = () => {
    onRunAnalysis({
      locationId: currentLocation.id,
      preFloodDate: preDate,
      postFloodDate: postDate,
      polarization,
      thresholdDb,
      filterType,
      maskPermanentWater,
      maskSteepSlopes,
      slopeThresholdDeg: 8.0,
    });
    setPageState('results');
  };

  // Calculate current workflow step for banner
  const getWorkflowStep = (): number => {
    if (pageState === 'processing') return 4; // SAR PROCESSING / FLOOD DETECTION
    if (pageState === 'results') return 6; // RESULTS
    if (validationError) return 2; // SELECT DATES
    return 3; // SAR PROCESSING READY
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto selection:bg-cyan-electric selection:text-space-950">
      
      {/* ================================================== */}
      {/* 2. PAGE HEADER                                     */}
      {/* ================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-space-800">
        <div>
          {/* Breadcrumb */}
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-electric flex items-center gap-2 mb-2">
            <span>RAPIDFLOOD</span>
            <span className="text-slate-600">/</span>
            <span className="text-white">ANALYSIS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight uppercase flex items-center gap-3">
            FLOOD ANALYSIS
          </h1>

          {/* Subtitle */}
          <div className="text-sm sm:text-base font-mono font-bold text-cyan-electric mt-1">
            Sentinel-1 SAR Change Detection
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Compare pre-flood and post-flood satellite observations to identify potentially inundated areas and assess their spatial impact.
          </p>
        </div>

        {/* Status Indicators & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Sentinel-1 Ready Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081522] border border-cyan-500/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
            <span className="font-bold text-white tracking-wider">SENTINEL-1 READY</span>
          </div>

          {/* Demo Mode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>DEMO MODE</span>
          </div>

          {/* Earth Engine Tab Toggle */}
          <div className="flex bg-[#081522] border border-space-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'parameters'
                  ? 'bg-gradient-to-r from-sky-vivid to-cyan-electric text-space-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CONTROL CENTER
            </button>
            <button
              onClick={() => setActiveTab('gee_script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'gee_script'
                  ? 'bg-gradient-to-r from-sky-vivid to-cyan-electric text-space-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              EARTH ENGINE CODE
            </button>
          </div>

        </div>
      </div>

      {activeTab === 'parameters' ? (
        <div className="space-y-8">
          
          {/* ================================================== */}
          {/* 3. ANALYSIS WORKFLOW                               */}
          {/* ================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="uppercase tracking-wider font-bold text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-electric" />
                END-TO-END SATELLITE ANALYSIS WORKFLOW
              </span>
              <span className="text-cyan-electric font-bold">STEP 0{getWorkflowStep()} OF 06</span>
            </div>
            <AnalysisWorkflowSteps currentStep={getWorkflowStep()} />
          </div>

          {/* ================================================== */}
          {/* 4. MAIN CONTROL PANEL                              */}
          {/* ================================================== */}
          <div className="bg-[#081522]/90 border border-cyan-500/30 rounded-2xl p-6 lg:p-7 shadow-[0_0_40px_rgba(6,182,212,0.1)] space-y-7 backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-space-800">
              <div>
                <h2 className="font-display font-black text-white text-lg lg:text-xl uppercase tracking-wider flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-cyan-electric" />
                  ANALYSIS CONFIGURATION
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Configure satellite observations and processing parameters.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-space-950 border border-space-800 text-cyan-electric">
                  SAR C-Band 5.405 GHz
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-space-950 border border-space-800 text-slate-300">
                  10m Resolution
                </span>
              </div>
            </div>

            {/* Two-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: AOI + DATES */}
              <div className="space-y-6">
                
                {/* 5. AREA OF INTEREST */}
                <AoiSelector
                  currentLocation={currentLocation}
                  onSelectLocation={handleLocationChange}
                />

                {/* 6. DATE SELECTION (CRITICAL: Custom Dark Date Pickers that NEVER Turn White!) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-electric" />
                      TEMPORAL SAR OBSERVATION PAIR
                    </span>
                    <span className="text-[10px] font-mono text-cyan-electric">
                      Temporal Baseline
                    </span>
                  </div>

                  {/* Date Pickers with Visual Relationship Connector */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    
                    {/* PRE-FLOOD */}
                    <div className="flex-1">
                      <CustomDatePicker
                        label="PRE-FLOOD"
                        value={preDate}
                        onChange={setPreDate}
                        helperText="Baseline dry state"
                      />
                    </div>

                    {/* 8. DATE RELATIONSHIP VISUAL CONNECTOR */}
                    <div className="hidden sm:flex flex-col items-center justify-center shrink-0 pt-6">
                      <div className="p-2 rounded-xl bg-space-950 border border-cyan-500/40 text-cyan-electric shadow-[0_0_15px_rgba(6,182,212,0.2)] text-[10px] font-mono font-black flex items-center gap-1.5">
                        <span>CHANGE DETECTION</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-electric" />
                      </div>
                    </div>

                    {/* POST-FLOOD */}
                    <div className="flex-1">
                      <CustomDatePicker
                        label="POST-FLOOD"
                        value={postDate}
                        onChange={setPostDate}
                        helperText="Peak inundation state"
                      />
                    </div>

                  </div>

                  {/* Mobile Date Relationship Connector */}
                  <div className="sm:hidden flex items-center justify-center py-1">
                    <div className="px-3 py-1 rounded-lg bg-space-950 border border-cyan-500/40 text-cyan-electric text-[10px] font-mono font-bold flex items-center gap-2">
                      <span>[ PRE-FLOOD ]</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>[ CHANGE DETECTION ]</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>[ POST-FLOOD ]</span>
                    </div>
                  </div>

                  {/* 20. VALIDATION WARNING PANEL (Dark, No Native Alerts!) */}
                  {validationError && (
                    <div className="p-4 rounded-xl bg-status-amber/10 border border-status-amber/40 text-amber-300 flex items-start gap-3 animate-in fade-in duration-200">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                          {validationError}
                        </h4>
                        <p className="text-[11px] text-amber-200/80 mt-1 font-sans">
                          Temporal baseline change detection requires post-flood imagery to be acquired after the pre-flood baseline.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT COLUMN: SATELLITE CONFIGURATION & PROCESSING METHOD */}
              <div className="space-y-6">
                
                {/* 9. SATELLITE CONFIGURATION CARDS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Satellite className="w-3.5 h-3.5 text-cyan-electric" />
                      SATELLITE CONFIGURATION
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Copernicus Constellation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* SATELLITE CARD */}
                    <div className="p-3.5 rounded-xl bg-space-950 border border-cyan-500/30 space-y-1.5 hover:border-cyan-400 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-electric">
                        <span className="font-bold uppercase tracking-wider text-[10px]">◉ SATELLITE</span>
                      </div>
                      <div className="text-sm font-mono font-black text-white">
                        SENTINEL-1
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        Synthetic Aperture Radar
                      </div>
                    </div>

                    {/* POLARIZATION CARD */}
                    <div className="p-3.5 rounded-xl bg-space-950 border border-cyan-500/30 space-y-1.5 hover:border-cyan-400 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-electric">
                        <span className="font-bold uppercase tracking-wider text-[10px]">◉ POLARIZATION</span>
                        <span className="text-[9px] text-slate-400">CO-POL</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {(['VV', 'VH', 'VV+VH'] as const).map(pol => (
                          <button
                            key={pol}
                            type="button"
                            onClick={() => setPolarization(pol)}
                            className={`flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                              polarization === pol
                                ? 'bg-cyan-electric text-space-950 shadow-glow-cyan'
                                : 'bg-space-900 text-slate-400 hover:text-white border border-space-800'
                            }`}
                          >
                            {pol}
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] text-cyan-light/80 leading-tight truncate">
                        {polarization === 'VV' ? 'Optimal for open water' : polarization === 'VH' ? 'Vegetation penetration' : 'Dual-pol composite'}
                      </div>
                    </div>

                    {/* PROCESSING CARD */}
                    <div className="p-3.5 rounded-xl bg-space-950 border border-cyan-500/30 space-y-1.5 hover:border-cyan-400 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-electric">
                        <span className="font-bold uppercase tracking-wider text-[10px]">◉ PROCESSING</span>
                        <span className="text-[9px] text-emerald-400 font-bold">AUTO</span>
                      </div>
                      <div className="text-sm font-mono font-black text-white">
                        AUTOMATIC
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        IW GRD 10m Calibrated
                      </div>
                    </div>

                  </div>
                </div>

                {/* 10. PROCESSING METHOD CARD */}
                <div className="p-4 rounded-xl bg-space-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-electric" />
                      PROCESSING METHOD: CHANGE DETECTION
                    </span>
                    <span className="text-cyan-electric font-bold text-[10px]">
                      ΔdB &lt; {thresholdDb.toFixed(1)} dB
                    </span>
                  </div>

                  {/* Animated Chain Flow */}
                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                    <div className="p-1.5 rounded bg-space-900 border border-space-800 text-slate-300">
                      PRE-FLOOD
                    </div>
                    <div className="flex items-center justify-center text-cyan-electric animate-pulse">
                      →
                    </div>
                    <div className="p-1.5 rounded bg-space-900 border border-space-800 text-cyan-electric">
                      BACKSCATTER
                    </div>
                    <div className="flex items-center justify-center text-cyan-electric animate-pulse">
                      →
                    </div>
                    <div className="p-1.5 rounded bg-space-900 border border-cyan-500/40 text-cyan-light font-bold">
                      FLOOD MASK
                    </div>
                  </div>

                  {/* Flow description */}
                  <div className="text-[11px] font-sans text-slate-400 flex items-center justify-between pt-1 border-t border-space-800/80">
                    <span>Log-ratio specular drop isolation</span>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-cyan-electric hover:underline text-[10px] font-mono font-bold"
                    >
                      {showAdvanced ? 'HIDE ADVANCED PARAMS ▲' : 'ADVANCED PARAMETERS ▼'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Advanced Parameters Accordion (Threshold dB slider, DEM slope, JRC water mask) */}
            {showAdvanced && (
              <div className="p-5 rounded-xl bg-space-950 border border-cyan-500/30 space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-space-800 text-xs font-mono">
                  <span className="text-white font-bold uppercase tracking-wider">
                    CALIBRATED SAR ALGORITHM PARAMETERS
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Sigma0 Log-Ratio & Topographical Correction
                  </span>
                </div>

                {/* Threshold Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-cyan-electric" />
                      BACKSCATTER DROP THRESHOLD (ΔdB)
                    </span>
                    <span className="text-cyan-electric font-black text-sm bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {thresholdDb.toFixed(1)} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-6.0"
                    max="-1.5"
                    step="0.1"
                    value={thresholdDb}
                    onChange={(e) => setThresholdDb(parseFloat(e.target.value))}
                    className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer accent-cyan-electric"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>-6.0 dB (Strict: open deep water only)</span>
                    <span className="text-cyan-electric font-bold">-3.2 dB (Optimal Calibrated Value)</span>
                    <span>-1.5 dB (Permissive: includes damp soil)</span>
                  </div>
                </div>

                {/* Filter & Masks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="font-mono text-xs font-bold uppercase text-slate-300 block mb-1.5">
                      SPECKLE FILTER
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="w-full bg-[#081522] border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-electric focus:outline-none"
                    >
                      <option value="Refined Lee (7x7)">Refined Lee Filter (7x7 window)</option>
                      <option value="Frost (5x5)">Frost Filter (5x5 window)</option>
                      <option value="Gamma MAP">Gamma Maximum A Posteriori</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-[#081522] border border-cyan-500/25 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={maskPermanentWater}
                      onChange={(e) => setMaskPermanentWater(e.target.checked)}
                      className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <strong className="text-white block font-mono text-[11px]">JRC WATER MASK</strong>
                      <span className="text-slate-400 text-[10px]">Excludes permanent rivers & lakes</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#081522] border border-cyan-500/25 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={maskSteepSlopes}
                      onChange={(e) => setMaskSteepSlopes(e.target.checked)}
                      className="rounded bg-space-900 border-space-700 text-cyan-electric focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <strong className="text-white block font-mono text-[11px]">DEM SLOPE MASK</strong>
                      <span className="text-slate-400 text-[10px]">Excludes slopes &gt; 8° (radar shadows)</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ================================================== */}
            {/* 11. RUN ANALYSIS BUTTON (Large Premium CTA)       */}
            {/* ================================================== */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExecute}
                disabled={Boolean(validationError) || pageState === 'processing'}
                className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-electric to-cyan-300 hover:brightness-110 active:scale-[0.99] text-space-950 font-display font-black text-base sm:text-lg tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(6,182,212,0.6)] flex items-center justify-center gap-3 transition-all cursor-pointer uppercase disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Play className="w-5 h-5 fill-space-950" />
                <span>▶ RUN FLOOD ANALYSIS</span>
              </button>
            </div>

          </div>

          {/* ================================================== */}
          {/* 12 & 13. SATELLITE PROCESSING STATE                */}
          {/* ================================================== */}
          {pageState === 'processing' && (
            <InPageProcessingView
              locationName={currentLocation.name}
              preDate={preDate}
              postDate={postDate}
              onComplete={handleInPageProcessingComplete}
            />
          )}

          {/* ================================================== */}
          {/* 19. EMPTY STATE (When idle before running)        */}
          {/* ================================================== */}
          {pageState === 'idle' && (
            <div className="p-8 rounded-2xl bg-[#081522] border border-cyan-500/30 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Satellite className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-white text-xl uppercase tracking-wider">
                  SATELLITE ANALYSIS READY
                </h3>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                  Select an area and two observation dates above, then click RUN FLOOD ANALYSIS to begin temporal change detection.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExecute}
                disabled={Boolean(validationError)}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-vivid to-cyan-electric text-space-950 font-mono font-bold text-xs uppercase tracking-wider shadow-glow-cyan hover:brightness-110 cursor-pointer"
              >
                ▶ RUN FLOOD ANALYSIS
              </button>
            </div>
          )}

          {/* ================================================== */}
          {/* 14. RESULTS SECTION (Revealed after processing)     */}
          {/* ================================================== */}
          {pageState === 'results' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Results Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl bg-[#081522] border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-electric/15 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric">
                    <Droplets className="w-5 h-5 text-cyan-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                        ANALYSIS RESULTS
                      </h2>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        DEMO DATA
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Target AOI: <strong className="text-white">{currentLocation.name}</strong> · Calibrated ΔdB &lt; {thresholdDb.toFixed(1)} dB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Prepared geospatial demonstration data
                  </span>
                </div>
              </div>

              {/* 4 Large Result Cards (Section 14) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* FLOOD EXTENT */}
                <div className="bg-[#081522] border border-cyan-500/40 rounded-2xl p-5 space-y-2 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-electric transition-colors group">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-electric uppercase tracking-wider flex items-center gap-1.5">
                      <Droplets className="w-4 h-4" />
                      FLOOD EXTENT
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      DEMO DATA
                    </span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-mono font-black text-white group-hover:text-cyan-electric transition-colors">
                    {results.summary.floodedAreaKm2} <span className="text-base font-mono text-cyan-electric">km²</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans flex items-center justify-between pt-1 border-t border-space-800">
                    <span>Net newly inundated land</span>
                    <span className="font-mono text-cyan-light font-bold">{results.summary.percentageAreaFlooded}% area</span>
                  </div>
                </div>

                {/* AFFECTED ROADS */}
                <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-5 space-y-2 shadow-lg hover:border-cyan-electric transition-colors group">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      AFFECTED ROADS
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      DEMO DATA
                    </span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-mono font-black text-white group-hover:text-sky-300 transition-colors">
                    {results.impact.roads.affectedRoadsKm} <span className="text-base font-mono text-sky-400">km</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans flex items-center justify-between pt-1 border-t border-space-800">
                    <span>Submerged transit routes</span>
                    <span className="font-mono text-amber-400 font-bold">{results.impact.roads.criticalCorridorsCut} corridors cut</span>
                  </div>
                </div>

                {/* SETTLEMENTS */}
                <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-5 space-y-2 shadow-lg hover:border-cyan-electric transition-colors group">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      SETTLEMENTS
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      DEMO DATA
                    </span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-mono font-black text-white group-hover:text-amber-300 transition-colors">
                    {results.impact.settlements.affectedSettlementClusters || 12}
                  </div>
                  <div className="text-xs text-slate-400 font-sans flex items-center justify-between pt-1 border-t border-space-800">
                    <span>Clusters inundated</span>
                    <span className="font-mono text-amber-300 font-bold">{results.impact.settlements.affectedBuildings.toLocaleString()} bldgs</span>
                  </div>
                </div>

                {/* AGRICULTURE */}
                <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-5 space-y-2 shadow-lg hover:border-cyan-electric transition-colors group">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      AGRICULTURE
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      DEMO DATA
                    </span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-mono font-black text-white group-hover:text-emerald-300 transition-colors">
                    {results.impact.agriculture.floodedAgriAreaKm2} <span className="text-base font-mono text-emerald-400">km²</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans flex items-center justify-between pt-1 border-t border-space-800">
                    <span>Flooded cropland</span>
                    <span className="font-mono text-emerald-400 font-bold">{results.impact.agriculture.percentageAgriAffected}% loss risk</span>
                  </div>
                </div>

              </div>

              {/* 16. BEFORE / AFTER COMPARISON SECTION */}
              <BeforeAfterComparison
                results={results}
                preDate={preDate}
                postDate={postDate}
                thresholdDb={thresholdDb}
              />

              {/* ================================================== */}
              {/* 15. FLOOD MAP (Large Screen Space Map)            */}
              {/* ================================================== */}
              <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-space-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-electric">
                      <LayersIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-white text-base sm:text-lg uppercase tracking-wide">
                        DETECTED FLOOD EXTENT
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Interactive GIS multi-layer satellite visualization & spatial damage overlay
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-electric font-bold bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      LEAFLET HIGH-PRECISION GIS ENGINE
                    </span>
                  </div>
                </div>

                {/* Embedded Large Map */}
                <div className="rounded-xl overflow-hidden border border-space-800">
                  <InteractiveMap
                    results={results}
                    className="h-[650px] w-full"
                    showControls={true}
                    compact={false}
                  />
                </div>
              </div>

              {/* 17. TECHNICAL INFORMATION SECTION (Collapsible) */}
              <TechnicalWorkflowGuide />

            </div>
          )}

        </div>
      ) : (
        /* Google Earth Engine JavaScript Script Tab */
        <div className="bg-[#081522] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <div>
              <h3 className="font-display font-black text-white text-base uppercase">
                GOOGLE EARTH ENGINE SATELLITE SCRIPT
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Copernicus Sentinel-1 SAR IW GRD Change Detection Pipeline
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(GEE_JAVASCRIPT_CODE);
                alert('Earth Engine script copied to clipboard!');
              }}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-cyan-electric text-space-950 hover:bg-cyan-light transition-colors cursor-pointer"
            >
              COPY GEE CODE
            </button>
          </div>

          <pre className="bg-space-950 p-4 rounded-xl border border-space-800 text-[11px] font-mono text-cyan-light/90 overflow-x-auto max-h-[500px] custom-scrollbar">
            {GEE_JAVASCRIPT_CODE}
          </pre>
        </div>
      )}

    </div>
  );
};
