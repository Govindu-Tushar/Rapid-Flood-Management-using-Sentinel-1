/**
 * Sentinel-1 SAR Rapid Flood Mapping Algorithm
 * Official Earth Engine Script for Google Earth Engine Code Editor
 */

export const GEE_JAVASCRIPT_CODE = `/**
 * RAPID FLOOD DETECTION & IMPACT ASSESSMENT USING SENTINEL-1 SAR
 * Implementation for Google Earth Engine (JavaScript API)
 * Copernicus Sentinel-1 Synthetic Aperture Radar (SAR)
 */

// 1. DEFINE AREA OF INTEREST (AOI)
var aoi = ee.Geometry.Polygon([
  [[91.65, 24.70], [92.05, 24.70], [92.05, 25.08], [91.65, 25.08]]
]);
Map.centerObject(aoi, 11);

// 2. DEFINE TIME PERIODS
var preFloodStart = '2022-05-15';
var preFloodEnd   = '2022-05-30';
var postFloodStart = '2022-06-15';
var postFloodEnd   = '2022-06-25';

// 3. SENTINEL-1 GRD COLLECTION FILTERING
// Polarization: VV is optimal for specular surface water reflection
var s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .filterBounds(aoi);

// 4. SPECKLE FILTERING HELPER (Refined Lee / Focal Median)
function toNatural(img) {
  return ee.Image(10.0).pow(img.select(0).divide(10.0));
}
function toDb(img) {
  return ee.Image(img).log10().multiply(10.0);
}
function applySpeckleFilter(img) {
  return toDb(toNatural(img).focal_median(50, 'circle', 'meters'));
}

// 5. GENERATE PRE- AND POST-FLOOD MOSAICS
var preFloodRaw = s1Collection.filterDate(preFloodStart, preFloodEnd).select('VV').mosaic().clip(aoi);
var postFloodRaw = s1Collection.filterDate(postFloodStart, postFloodEnd).select('VV').mosaic().clip(aoi);

var preFloodFiltered = applySpeckleFilter(preFloodRaw);
var postFloodFiltered = applySpeckleFilter(postFloodRaw);

// 6. BACKSCATTER CHANGE DETECTION (Difference in dB)
// Smooth water mirrors radar pulses away from satellite, causing sharp dB drop
var difference = postFloodFiltered.subtract(preFloodFiltered);

// 7. INITIAL FLOOD MASK THRESHOLDING
var THRESHOLD_DB = -3.2; // Typical threshold: -3.0 to -3.5 dB drop
var floodMaskRaw = difference.lt(THRESHOLD_DB);

// 8. REMOVE PERMANENT WATER (JRC Global Surface Water)
var gsw = ee.Image('JRC/GSW1_4/GlobalSurfaceWater');
var permanentWater = gsw.select('seasonality').gte(10).clip(aoi);
var floodedOnly = floodMaskRaw.where(permanentWater, 0);

// 9. REMOVE STEEP SLOPES (Copernicus DEM > 5% slope to avoid radar shadow)
var dem = ee.ImageCollection("COPERNICUS/DEM/GLO30").mosaic();
var slope = ee.Terrain.slope(dem);
var floodInundation = floodedOnly.updateMask(slope.lt(5));

// 10. CALCULATE INUNDATED AREA
var floodPixelArea = floodInundation.multiply(ee.Image.pixelArea());
var totalFloodedAreaSqMeters = floodPixelArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 10,
  maxPixels: 1e9
});

print('Total Inundated Area (km²):', 
      ee.Number(totalFloodedAreaSqMeters.get('VV')).divide(1e6));

// 11. MAP VISUALIZATION
Map.addLayer(preFloodFiltered, {min: -25, max: 0}, 'Pre-Flood SAR (VV)', false);
Map.addLayer(postFloodFiltered, {min: -25, max: 0}, 'Post-Flood SAR (VV)', false);
Map.addLayer(permanentWater.updateMask(permanentWater), {palette: ['#0369a1']}, 'Permanent Water');
Map.addLayer(floodInundation.updateMask(floodInundation), {palette: ['#0284c7']}, 'Detected Flood Inundation');
`;

export const GEE_PYTHON_CODE = `# Google Earth Engine Python API (geemap / earthengine-api)
import ee

ee.Initialize()

aoi = ee.Geometry.Polygon([
  [[91.65, 24.70], [92.05, 24.70], [92.05, 25.08], [91.65, 25.08]]
])

s1 = (ee.ImageCollection('COPERNICUS/S1_GRD')
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filterBounds(aoi))

pre = s1.filterDate('2022-05-15', '2022-05-30').select('VV').mosaic().clip(aoi)
post = s1.filterDate('2022-06-15', '2022-06-25').select('VV').mosaic().clip(aoi)

diff = post.subtract(pre)
flood_mask = diff.lt(-3.2)

# Remove permanent water bodies
gsw = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
permanent_water = gsw.select('seasonality').gte(10).clip(aoi)
flood_inundation = flood_mask.where(permanent_water, 0)
`;
