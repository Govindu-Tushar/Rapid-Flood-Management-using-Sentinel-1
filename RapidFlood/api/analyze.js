import {
  initializeEarthEngine,
  analyzeFlood,
} from "../server/geeService.cjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    await initializeEarthEngine();

    const { params, location } = req.body || {};

    if (!params || !location) {
      return res.status(400).json({
        ok: false,
        error: "Missing params or location",
      });
    }

    console.log("Starting GEE flood analysis:", {
      location: location.name,
      preFloodDate: params.preFloodDate,
      postFloodDate: params.postFloodDate,
      polarization: params.polarization,
      thresholdDb: params.thresholdDb,
    });

    const result = await analyzeFlood(params, location);

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("GEE analysis failed:", error);

    return res.status(500).json({
      ok: false,
      error: error?.message || String(error),
    });
  }
}
