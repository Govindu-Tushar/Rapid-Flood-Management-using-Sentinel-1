require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initializeEarthEngine, analyzeFlood } = require("./geeService.cjs");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (req, res) => {
  try {
    await initializeEarthEngine();

    res.json({
      ok: true,
      gee: true,
      message: "RapidFlood GEE backend is running",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      gee: false,
      error: error.message,
    });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { params, location } = req.body;

    if (!params) {
      return res.status(400).json({
        error: "Missing analysis parameters",
      });
    }

    if (!location || !location.bbox) {
      return res.status(400).json({
        error: "Missing location or bbox",
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

    res.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("GEE analysis failed:", error);

    res.status(500).json({
      ok: false,
      error: error.message || "Unknown GEE error",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`RapidFlood GEE server running on http://localhost:${PORT}`);
});
