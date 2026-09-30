export type ViewMode = 
  | 'dashboard'
  | 'analysis'
  | 'map'
  | 'impact'
  | 'analytics'
  | 'priority'
  | 'about'
  | 'datasources'
  | 'system';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface LocationInfo {
  id: string;
  name: string;
  region: string;
  country: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bbox: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  description: string;
  eventDate: string;
  preFloodDate: string;
  postFloodDate: string;
  satelliteMetadata: {
    mission: string;
    mode: string;
    orbit: string;
    pass: 'Ascending' | 'Descending';
    polarization: string;
    resolution: string;
  };
}

export interface AnalysisParameters {
  locationId: string;
  preFloodDate: string;
  postFloodDate: string;
  polarization: 'VV' | 'VH' | 'VV+VH';
  thresholdDb: number; // e.g., -3.2 dB
  filterType: 'Refined Lee (7x7)' | 'Frost (5x5)' | 'Gamma MAP';
  maskPermanentWater: boolean;
  maskSteepSlopes: boolean;
  slopeThresholdDeg: number;
}

export interface PipelineStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progressMs: number;
}

export interface PriorityZone {
  id: string;
  name: string;
  level: 'High Priority' | 'Medium Priority' | 'Low Priority';
  score: number; // 0 - 100
  floodedAreaKm2: number;
  affectedSettlements: number;
  affectedRoadsKm: number;
  agriculturalLossKm2: number;
  recommendedAction: string;
  center: [number, number];
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'Primary Highway' | 'Secondary Road' | 'Rural Link' | 'Bridge/Culvert';
  lengthKm: number;
  floodedLengthKm: number;
  status: 'Submerged' | 'Partial' | 'Open';
  evacuationRoute: boolean;
  coordinates: [number, number][];
}

export interface SettlementFeature {
  id: string;
  name: string;
  type: 'Township' | 'Village' | 'School' | 'Health Clinic' | 'Shelter';
  totalBuildings: number;
  floodedBuildings: number;
  severity: SeverityLevel;
  waterDepthEst: string;
  lat: number;
  lng: number;
}

export interface AgriculturalZone {
  id: string;
  cropType: string;
  totalHectares: number;
  floodedHectares: number;
  lossRisk: 'High' | 'Moderate' | 'Low';
  cropStage: string;
}

export interface AnalysisResults {
  timestamp: string;
  isDemo: boolean;
  location: LocationInfo;
  parameters: AnalysisParameters;
  summary: {
    totalAreaAnalyzedKm2: number;
    permanentWaterKm2: number;
    floodedAreaKm2: number;
    netInundationKm2: number;
    percentageAreaFlooded: number;
    preFloodMeanBackscatterDb: number;
    postFloodMeanBackscatterDb: number;
    meanDeltaDb: number;
    severity: SeverityLevel;
  };
  impact: {
    roads: {
      totalAnalyzedKm: number;
      affectedRoadsKm: number;
      percentageAffected: number;
      affectedSegmentsCount: number;
      criticalCorridorsCut: number;
      segments: RoadSegment[];
    };
    settlements: {
      totalAnalyzedBuildings: number;
      affectedBuildings: number;
      percentageAffected: number;
      affectedSettlementClusters: number;
      criticalFacilitiesFlooded: number;
      features: SettlementFeature[];
    };
    agriculture: {
      totalAgriAreaKm2: number;
      floodedAgriAreaKm2: number;
      percentageAgriAffected: number;
      majorCropsAffected: string[];
      zones: AgriculturalZone[];
    };
  };
  priorityZones: PriorityZone[];
  geojson: {
    floodExtent: any;
    permanentWater: any;
    priorityZones: any;
    roads: any;
    settlements: any;
    agriculture: any;
  };
}

export interface MapLayerVisibility {
  baseMap: 'dark' | 'satellite' | 'street';
  preFlood: boolean;
  postFlood: boolean;
  floodExtent: boolean;
  permanentWater: boolean;
  roads: boolean;
  settlements: boolean;
  agriculture: boolean;
  priorityZones: boolean;
}
