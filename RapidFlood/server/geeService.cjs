const ee = require("@google/earthengine");

let initialized = false;

async function initializeEarthEngine() {
  if (initialized) return;

  const projectId = process.env.GEE_PROJECT_ID;
  const clientEmail = process.env.GEE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GEE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing GEE credentials. Check GEE_PROJECT_ID, GEE_SERVICE_ACCOUNT_EMAIL and GEE_PRIVATE_KEY.",
    );
  }

  const credentials = {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };

  await new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      credentials,
      () => {
        ee.initialize(
          null,
          null,
          () => {
            initialized = true;
            console.log("Google Earth Engine initialized");
            resolve();
          },
          reject,
          projectId,
        );
      },
      reject,
    );
  });
}

function dateRange(start, end) {
  return ee.DateRange(start, end);
}

function makeAoi(bbox) {
  // Frontend format:
  // [minLat, minLng, maxLat, maxLng]

  const [minLat, minLng, maxLat, maxLng] = bbox;

  // Earth Engine format:
  // [minLng, minLat, maxLng, maxLat]

  return ee.Geometry.Rectangle([minLng, minLat, maxLng, maxLat]);
}
async function analyzeFlood(params, location) {
  await initializeEarthEngine();

  const {
    preFloodDate,
    postFloodDate,
    polarization = "VV",
    thresholdDb = -3.2,
    maskPermanentWater = true,
    maskSteepSlopes = true,
    slopeThresholdDeg = 8,
  } = params;

  const aoi = makeAoi(location.bbox);

  // Sentinel-1 GRD is already provided in dB.
  const collection = ee
    .ImageCollection("COPERNICUS/S1_GRD")
    .filterBounds(aoi)
    .filter(ee.Filter.eq("instrumentMode", "IW"))
    .filter(
      ee.Filter.listContains("transmitterReceiverPolarisation", polarization),
    )
    .select(polarization);

  /*
   * Sentinel-1 does not necessarily have an acquisition
   * on the exact date selected by the user.
   *
   * Find the closest available image within +/- 12 days.
   */
  function nearestImage(dateString) {
    const target = ee.Date(dateString);

    const window = collection
      .filterDate(target.advance(-12, "day"), target.advance(12, "day"))
      .map(function (image) {
        const difference = ee
          .Number(image.get("system:time_start"))
          .subtract(target.millis())
          .abs();

        return image.set("dateDifference", difference);
      })
      .sort("dateDifference");

    return ee.Image(window.first()).clip(aoi);
  }

  const pre = nearestImage(preFloodDate);
  const post = nearestImage(postFloodDate);

  /*
   * Check that Sentinel-1 actually supplied images.
   */
  const imageInfo = await new Promise((resolve, reject) => {
    ee.Dictionary({
      count: collection
        .filterBounds(aoi)
        .filterDate(
          ee.Date(preFloodDate).advance(-12, "day"),
          ee.Date(postFloodDate).advance(12, "day"),
        )
        .size(),

      preBands: pre.bandNames(),

      postBands: post.bandNames(),

      preDate: pre.get("system:time_start"),

      postDate: post.get("system:time_start"),
    }).evaluate((result, error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

  console.log("Sentinel-1 image check:", imageInfo);

  if (!imageInfo.preBands || imageInfo.preBands.length === 0) {
    throw new Error(
      `No Sentinel-1 ${polarization} image found near pre-flood date ${preFloodDate}.`,
    );
  }

  if (!imageInfo.postBands || imageInfo.postBands.length === 0) {
    throw new Error(
      `No Sentinel-1 ${polarization} image found near post-flood date ${postFloodDate}.`,
    );
  }

  /*
   * SAR change detection.
   *
   * Sentinel-1 GRD values are already in dB.
   */
  const deltaDb = post.subtract(pre);

  let flood = deltaDb.lt(thresholdDb);

  /*
   * Remove permanent water.
   */
  if (maskPermanentWater) {
    const permanentWater = ee
      .Image("JRC/GSW1_4/GlobalSurfaceWater")
      .select("seasonality")
      .gte(10);

    flood = flood.and(permanentWater.not());
  }

  /*
   * Remove steep terrain.
   */
  if (maskSteepSlopes) {
    const dem = ee.ImageCollection("COPERNICUS/DEM/GLO30").mosaic().clip(aoi);

    const slope = ee.Terrain.slope(dem);

    flood = flood.and(slope.lt(slopeThresholdDeg));
  }

  /*
   * Remove very small isolated regions.
   */
  flood = flood.selfMask().connectedPixelCount(100, true).gte(8).selfMask();

  /*
   * Calculate flooded area.
   */
  const areaImage = ee.Image.pixelArea().updateMask(flood);

  const areaResult = await new Promise((resolve, reject) => {
    areaImage
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: aoi,
        scale: 10,
        maxPixels: 1e9,
        bestEffort: true,
      })
      .evaluate((result, error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
  });

  const floodedAreaM2 = Number(
    areaResult && areaResult.area ? areaResult.area : 0,
  );

  const floodedAreaKm2 = floodedAreaM2 / 1000000;

  /*
   * Convert flood raster to GeoJSON.
   */
  const vector = await new Promise((resolve, reject) => {
    flood
      .reduceToVectors({
        geometry: aoi,
        scale: 10,
        geometryType: "polygon",
        eightConnected: true,
        labelProperty: "flood",
        maxPixels: 1e9,
        bestEffort: true,
      })
      .evaluate((result, error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
  });

  return {
    floodedAreaKm2,
    floodGeoJSON: vector,
    thresholdDb,
    polarization,
    preFloodDate,
    postFloodDate,

    // Useful for showing exactly which satellite scenes
    // were actually used.
    actualPreFloodTimestamp: imageInfo.preDate,
    actualPostFloodTimestamp: imageInfo.postDate,
  };
}
module.exports = {
  initializeEarthEngine,
  analyzeFlood,
};
