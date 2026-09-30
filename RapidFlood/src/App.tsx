import React, { useState } from "react";
import {
  ViewMode,
  LocationInfo,
  AnalysisResults,
  AnalysisParameters,
} from "./types";
import { DEMO_LOCATIONS, getMockAnalysisResults } from "./data/locations";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PipelineModal } from "./components/analysis/PipelineModal";
import { ExportModal } from "./components/common/ExportModal";

// Views
import { DashboardView } from "./views/DashboardView";
import { FloodAnalysisView } from "./views/FloodAnalysisView";
import { LiveMapView } from "./views/LiveMapView";
import { AnalyticsView } from "./views/AnalyticsView";
import { ImpactAssessmentView } from "./views/ImpactAssessmentView";
import { PriorityZonesView } from "./views/PriorityZonesView";
import { ProjectInfoView } from "./views/ProjectInfoView";
import { DataSourcesView } from "./views/DataSourcesView";
import { SystemStatusView } from "./views/SystemStatusView";

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      [
        "dashboard",
        "analysis",
        "map",
        "impact",
        "analytics",
        "priority",
        "about",
        "datasources",
        "system",
      ].includes(hash)
    ) {
      return hash as ViewMode;
    }
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (
      viewParam &&
      [
        "dashboard",
        "analysis",
        "map",
        "impact",
        "analytics",
        "priority",
        "about",
        "datasources",
        "system",
      ].includes(viewParam)
    ) {
      return viewParam as ViewMode;
    }
    return "analysis"; // Default to redesigned Flood Analysis view
  });
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(
    DEMO_LOCATIONS[0],
  );
  const [results, setResults] = useState<AnalysisResults>(() =>
    getMockAnalysisResults(DEMO_LOCATIONS[0].id),
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [pendingParams, setPendingParams] = useState<AnalysisParameters | null>(
    null,
  );

  // Switch location handler
  const handleSelectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
    const updated = getMockAnalysisResults(loc.id);
    setResults(updated);
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.location.hash = view;
  };

  // Trigger analysis pipeline
  const handleRunAnalysis = async (params: AnalysisParameters) => {
    setPendingParams(params);
    setIsAnalyzing(true);

    try {
      const location = DEMO_LOCATIONS.find(
        (loc) => loc.id === params.locationId,
      );

      if (!location) {
        throw new Error("Selected location was not found.");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          params,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "GEE analysis failed.");
      }

      console.log("LIVE GEE RESULT:", data.result);

      /*
       * For now, keep the existing result structure and replace
       * the important flood values with the real GEE result.
       */
      const updated = getMockAnalysisResults(
        params.locationId,
        params.thresholdDb,
      );

      const liveResults: AnalysisResults = {
        ...updated,

        isDemo: false,

        timestamp: new Date().toISOString(),

        parameters: params,

        summary: {
          ...updated.summary,
          floodedAreaKm2: data.result.floodedAreaKm2,
          percentageAreaFlooded:
            updated.summary.totalAreaAnalyzedKm2 > 0
              ? Number(
                  (
                    (data.result.floodedAreaKm2 /
                      updated.summary.totalAreaAnalyzedKm2) *
                    100
                  ).toFixed(2),
                )
              : 0,
        },

        geojson: {
          ...updated.geojson,
          floodExtent: data.result.floodGeoJSON,
        },
      };

      setResults(liveResults);

      if (currentView !== "analysis") {
        setCurrentView("analysis");
      }
    } catch (error) {
      console.error("LIVE GEE ANALYSIS ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to run the Earth Engine analysis.",
      );
    } finally {
      setIsAnalyzing(false);
      setPendingParams(null);
    }
  };

  // Pipeline modal completion
  const handlePipelineComplete = () => {
    setIsAnalyzing(false);
    if (pendingParams) {
      const updated = getMockAnalysisResults(
        pendingParams.locationId,
        pendingParams.thresholdDb,
      );
      setResults(updated);
      setPendingParams(null);
    }
    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-electric selection:text-space-950">
      {/* Top Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        onNavigate={handleNavigate}
        onOpenExport={() => setIsExportOpen(true)}
        isAnalyzing={isAnalyzing}
        currentView={currentView}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAnalyzing={isAnalyzing}
        />

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto bg-space-950/80 relative">
          {currentView === "dashboard" && (
            <DashboardView
              results={results}
              onNavigate={handleNavigate}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}

          {currentView === "analysis" && (
            <FloodAnalysisView
              results={results}
              currentLocation={currentLocation}
              onSelectLocation={handleSelectLocation}
              onRunAnalysis={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {currentView === "map" && (
            <LiveMapView
              results={results}
              onNavigate={handleNavigate}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}

          {currentView === "impact" && (
            <ImpactAssessmentView
              results={results}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === "analytics" && <AnalyticsView results={results} />}

          {currentView === "priority" && (
            <PriorityZonesView results={results} onNavigate={handleNavigate} />
          )}

          {currentView === "about" && <ProjectInfoView />}

          {currentView === "datasources" && <DataSourcesView />}

          {currentView === "system" && <SystemStatusView results={results} />}
        </main>
      </div>

      {/* 7-Step SAR Pipeline Progress Modal (Shown when triggered from other views) */}
      <PipelineModal
        isOpen={isAnalyzing && currentView !== "analysis"}
        onComplete={handlePipelineComplete}
        locationName={currentLocation.name}
      />

      {/* Export Report / GeoJSON / CSV Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        results={results}
      />
    </div>
  );
};

export default App;
