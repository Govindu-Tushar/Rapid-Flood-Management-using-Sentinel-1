const { initializeEarthEngine } = require("../server/geeService.cjs");

module.exports = async function handler(req, res) {
  try {
    await initializeEarthEngine();

    res.status(200).json({
      ok: true,
      gee: true,
      message: "RapidFlood GEE backend is running",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      gee: false,
      error: error?.message || String(error),
    });
  }
};
