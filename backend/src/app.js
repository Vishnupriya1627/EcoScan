const express = require("express");
const cors = require("cors");
const multer = require("multer");
const scanRoutes = require("./routes/scanRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/scan", scanRoutes);

app.use((error, req, res, next) => {
  console.error("Backend error:", error.response?.data || error.stack || error.message);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Image is too large or invalid"
    });
  }

  if (error.response?.data?.detail) {
    return res.status(error.response.status || 500).json({
      error: error.response.data.detail
    });
  }

  if (error.code === "ECONNREFUSED") {
    return res.status(503).json({
      error: "Qwen service is not running. Start the Python vision service."
    });
  }

  if (error.code === "ECONNABORTED") {
    return res.status(504).json({
      error: "Qwen took too long to respond. Try again."
    });
  }

  res.status(500).json({
    error: error.message || "Image analysis failed"
  });
});

module.exports = app;
