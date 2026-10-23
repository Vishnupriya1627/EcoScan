const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { scoreOutfit, offersFor } = require("./carbonEngine");

const VISION_URL = process.env.VISION_URL || "http://127.0.0.1:8000";
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

async function detectItems(file) {
  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname || "upload.jpg");
  const res = await fetch(`${VISION_URL}/analyze`, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    const err = new Error(`Vision service returned ${res.status}`);
    err.status = res.status === 400 ? 400 : 502;
    throw err;
  }
  return res.json();
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/scan", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded (field name: image)" });
  if (!ALLOWED.has(req.file.mimetype))
    return res.status(400).json({ error: "Unsupported image type. Use JPEG, PNG or WebP" });

  try {
    const detected = await detectItems(req.file);
    const result = scoreOutfit(detected.items, {
      condition: req.body.condition,
      monthsOwned: req.body.months_owned,
      fallback: detected.fallback,
    });
    result.fallback = Boolean(detected.fallback);
    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.status === 400) return res.status(400).json({ error: "Invalid image file" });
    if (err.name === "TimeoutError")
      return res.status(504).json({ error: "Image analysis timed out, please try again" });
    res.status(503).json({ error: "Image analysis is unavailable right now, please try again" });
  }
});

// Score items you already have (no image)
app.post("/api/score", (req, res) => {
  const { items, condition, months_owned, fallback } = req.body || {};
  res.json(scoreOutfit(items, { condition, monthsOwned: months_owned, fallback }));
});

app.get("/api/offers", (req, res) => res.json(offersFor(req.query.points)));

// Multer errors (e.g. file too large)
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError)
    return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "Image must be under 8 MB" : err.message });
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`EcoScan API on :${PORT}`));
module.exports = app;