import { AnalysisResults } from '../types';

export function exportResultsAsCSV(results: AnalysisResults) {
  const headers = ['Category', 'Metric', 'Value', 'Unit', 'Notes'];
  const rows: (string | number)[][] = [
    ['Metadata', 'Location Name', `"${results.location.name}"`, '', ''],
    ['Metadata', 'Region & Country', `"${results.location.region}, ${results.location.country}"`, '', ''],
    ['Metadata', 'Analysis Timestamp', results.timestamp, 'UTC', ''],
    ['Metadata', 'Pre-Flood Reference Date', results.parameters.preFloodDate, 'YYYY-MM-DD', ''],
    ['Metadata', 'Post-Flood Observation Date', results.parameters.postFloodDate, 'YYYY-MM-DD', ''],
    ['Metadata', 'Sensor / Mission', `"${results.location.satelliteMetadata.mission}"`, '', results.location.satelliteMetadata.mode],
    ['Metadata', 'Polarization', results.parameters.polarization, '', ''],
    ['Metadata', 'Change Threshold (ΔdB)', results.parameters.thresholdDb, 'dB', 'Calibrated drop threshold'],
    ['Flood Extent', 'Total Area Analyzed', results.summary.totalAreaAnalyzedKm2, 'km²', ''],
    ['Flood Extent', 'Permanent Water Area', results.summary.permanentWaterKm2, 'km²', 'Filtered via JRC GSW baseline'],
    ['Flood Extent', 'Detected Flooded Area', results.summary.floodedAreaKm2, 'km²', 'Newly inundated surface'],
    ['Flood Extent', 'Area Flooded Percentage', `${results.summary.percentageAreaFlooded}%`, '%', 'Relative to analyzed AOI'],
    ['Flood Extent', 'Overall Severity Assessment', results.summary.severity, '', 'Decision support classification'],
    ['Road Network', 'Total Roads in AOI', results.impact.roads.totalAnalyzedKm, 'km', 'OSM Highway Network'],
    ['Road Network', 'Affected / Submerged Roads', results.impact.roads.affectedRoadsKm, 'km', ''],
    ['Road Network', 'Affected Road Segments', results.impact.roads.affectedSegmentsCount, 'segments', ''],
    ['Road Network', 'Severed Evacuation Corridors', results.impact.roads.criticalCorridorsCut, 'routes', 'Arterial link cuts'],
    ['Settlements', 'Total Analyzed Buildings', results.impact.settlements.totalAnalyzedBuildings, 'structures', 'OSM Footprints'],
    ['Settlements', 'Inundated Structures', results.impact.settlements.affectedBuildings, 'structures', 'Intersects flood polygon'],
    ['Settlements', 'Critical Facilities Flooded', results.impact.settlements.criticalFacilitiesFlooded, 'facilities', 'Clinics, schools, shelters'],
    ['Agriculture', 'Total Agricultural Area', results.impact.agriculture.totalAgriAreaKm2, 'km²', 'Cropland / Paddy'],
    ['Agriculture', 'Flooded Agricultural Land', results.impact.agriculture.floodedAgriAreaKm2, 'km²', ''],
    ['Agriculture', 'Agricultural Land Flooded %', `${results.impact.agriculture.percentageAgriAffected}%`, '%', 'Loss risk evaluated']
  ];

  // Add priority zones
  results.priorityZones.forEach((pz, idx) => {
    rows.push([
      'Priority Zone',
      `Sector ${idx + 1} (${pz.level})`,
      `"${pz.name}"`,
      `Score: ${pz.score}/100`,
      `"${pz.recommendedAction.replace(/"/g, '""')}"`
    ]);
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RapidFlood_Report_${results.location.id}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportResultsAsGeoJSON(results: AnalysisResults) {
  const geojsonBundle = {
    type: "FeatureCollection",
    metadata: {
      generatedBy: "RapidFlood SAR Assessment Platform",
      location: results.location.name,
      timestamp: results.timestamp,
      isDemo: results.isDemo,
      parameters: results.parameters,
      summary: results.summary
    },
    features: [
      ...(results.geojson.floodExtent?.features || []),
      ...(results.geojson.permanentWater?.features || []),
      ...(results.geojson.priorityZones?.features || [])
    ]
  };

  const str = JSON.stringify(geojsonBundle, null, 2);
  const blob = new Blob([str], { type: 'application/geo+json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RapidFlood_GeoJSON_${results.location.id}_${Date.now()}.geojson`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
