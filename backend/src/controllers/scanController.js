const { analyzeImage } = require("../services/imageAnalysis");
const { calculateEcoScore } = require("../services/ecoScore");
const offers = require("../data/offers");

function scanImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image.",
      });
    }

    const recognizedItems = analyzeImage(req.file);
    const result = calculateEcoScore(recognizedItems);

    return res.status(200).json({
      success: true,
      ...result,
      recognitionMode: "mock",
      message: "Demo results generated using mock recognition.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Image analysis failed.",
    });
  }
}

function getOffers(req, res) {
  const points = Number(req.query.points ?? 0);

  if (!Number.isInteger(points) || points < 0) {
    return res.status(400).json({
      message: "Points must be a non-negative integer.",
    });
  }

  const availableOffers = offers.map((offer) => ({
    ...offer,
    eligible: points >= offer.pointsRequired,
  }));

  return res.status(200).json({
    success: true,
    points,
    offers: availableOffers,
  });
}

module.exports = { scanImage, getOffers };