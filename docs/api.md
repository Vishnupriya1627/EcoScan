[← Back to README](../README.md)

# API reference

## Backend API

Local: `http://localhost:5000`. Production: your Render backend URL.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Returns `{ "status": "ok" }` |
| POST | `/api/scan` | Multipart upload with field `image` (JPEG, PNG or WebP, max 8 MB). Optional fields `condition` (`new`, `secondhand`, `owned`) and `months_owned`. Detects items, then returns the scored result |
| POST | `/api/score` | JSON `{ items, condition, months_owned, fallback }`. Scores items you supply, no image needed |
| GET | `/api/offers?points=N` | Returns offers unlocked at `N` points and the next offer to aim for |

### Errors

Errors return `{ "error": "..." }`.

| Status | Meaning |
| --- | --- |
| 400 | Missing, unsupported or invalid image, or file over 8 MB |
| 422 | No clothing detected, or image analysis failed on the vision service |
| 503 | Vision service unavailable |
| 504 | Vision service timed out |

### Example `/api/scan` result

One white T-shirt (abridged):

```json
{
  "items": [
    {
      "type": "tshirt", "name": "T-Shirt", "color": "white", "material": "unknown",
      "quantity": 1, "unit_kg": 5, "footprint_kg": 5,
      "range_kg": [3.25, 6.75], "grade": "B", "grade_label": "Low",
      "equivalent_km": 29.41, "savings_kg": 1.58, "confidence": "medium",
      "stages_kg": { "materials": 2.25, "manufacturing": 1.5, "transport": 0.4, "use": 0.7, "end_of_life": 0.15 }
    }
  ],
  "total": {
    "footprint_kg": 5, "range_kg": [3.25, 6.75], "grade": "B",
    "equivalent_km": 29.41, "savings_kg": 1.58, "vs_typical_pct": 0, "confidence": "medium"
  },
  "fallback": false,
  "assumptions": { "displacement_rate": 0.35, "resale_reduction": 0.9, "kg_per_km_driving": 0.17, "version": "ecoscan-assumptions-v1" },
  "disclaimer": "Illustrative estimates from simple category averages, not certified lifecycle-assessment (LCA) data."
}
```

## Vision service

Local: `http://127.0.0.1:8000`. Interactive docs at `/docs`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Returns `{ "status": "ok" }` |
| POST | `/analyze` | Multipart upload with field `file` (JPEG, PNG or WebP, 1 byte to 8 MB) |

### Success response

```json
{ "items": [{ "type": "tshirt", "color": "white", "quantity": 1 }], "fallback": false }
```

### If analysis fails

When every Gemini model fails or the 25-second limit is hit, the service returns a normal response with no items and an error flag:

```json
{ "items": [], "fallback": false, "error": "analysis_failed" }
```

The backend treats this as a failed analysis rather than an empty outfit.

### Gemini model chain

`vision-service/model.py` tries each name in `GEMINI_MODELS` in order, with two attempts each, skipping models that return 404. Remove names that don't exist for your API key so the chain stays fast.
