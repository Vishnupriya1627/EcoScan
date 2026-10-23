const express = require("express");
const multer = require("multer");
const { analyzeImage } = require("../services/visionClient");
const { calculateCarbon } = require("../services/carbonCalculator");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
    callback(null, true);
  }
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    const analysis = await analyzeImage(req.file.buffer, req.file.mimetype);

    if (!Array.isArray(analysis.items) || analysis.items.length === 0) {
      return res.status(422).json({ error: "No clothing items were detected" });
    }

    const result = calculateCarbon(analysis.items);

    res.json({
      ...result,
      message: "Carbon values are estimates based on predefined assumptions."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;