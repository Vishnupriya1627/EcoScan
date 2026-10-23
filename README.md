# EcoScan

**Scan a photo of your clothes and get an estimated carbon footprint, an item-by-item breakdown, and Eco Points for more sustainable choices.**

EcoScan uses a vision model (Google Gemini) to detect the clothing in a photo, then applies a transparent, rule-based carbon model to estimate each item's footprint (kg CO₂e), grade it from A to E, and show how much carbon could be saved by buying second-hand or wearing items longer.

- **Live demo:** https://eco-scan-vert.vercel.app/
- **Demo video:** 

https://github.com/user-attachments/assets/aac7b8c9-0524-419d-8c98-c9cbc47cf8ca



> **Heads up:** the backend and vision service run on Render's free tier and sleep when idle. The **first scan after a quiet period can take 30–60 seconds** while they wake up. Later scans are fast.

> **Important:** all carbon values are **illustrative estimates** from simple category averages, not certified lifecycle-assessment (LCA) data. See [docs/carbon-model.md](docs/carbon-model.md).

<!-- Add a screenshot or GIF here, e.g. ![EcoScan screenshot](docs/screenshot.png) -->

**Contents:** [Features](#features) · [Architecture](#architecture) · [Getting started](#getting-started) · [API](#api-summary) · [Deployment](#deployment) · [Limitations](#known-limitations)

**More docs:** [Carbon model](docs/carbon-model.md) · [API reference](docs/api.md) · [Roadmap](docs/roadmap.md)

## Features

- **Scan by upload or camera:** JPG, PNG or WebP, up to 5 MB (validated in the browser).
- **AI clothing detection:** finds each visible garment's type, colour and quantity.
- **Footprint results:** total and per-item kg CO₂e, an uncertainty range, a confidence level, an A–E grade, a lifecycle-stage split, and a "km driven" equivalent.
- **Detailed report page** with the calculation behind each number.
- **Scan history** kept in the browser, so past scans can be reopened or deleted.
- **Eco Points and rewards:** points for the carbon a scan could save, redeemable for demo offers.

## Architecture

```
┌──────────────┐   POST /api/scan    ┌──────────────────┐  POST /analyze  ┌──────────────────────┐
│  Frontend    │ ──────────────────► │  Backend API     │ ──────────────► │  Vision service      │
│  React+Vite  │ ◄────────────────── │  Node + Express  │ ◄────────────── │  Python + FastAPI    │
│  (Vercel)    │   scored result     │  (Render)        │  detected items │  (Render) → Gemini   │
└──────────────┘                     │  scoring engine  │                 └──────────────────────┘
                                     └──────────────────┘
```

| Service | Folder | Tech | Local port |
| --- | --- | --- | --- |
| Frontend | `frontend/` | React 19, Vite, Tailwind CSS 4, React Router | 5173 |
| Backend API | `backend/` | Node.js, Express 5, Multer | 5000 |
| Vision service | `vision-service/` | Python, FastAPI, Google Gemini | 8000 |

**Request flow:** the frontend uploads the image to the backend, the backend forwards it to the vision service, and the vision service returns detected items (`type`, `color`, `quantity`). The backend then scores them with the carbon engine and returns the result.

The AI only **detects** items. All carbon numbers come from a deterministic, unit-tested engine, so results are explainable and reproducible.

## Project structure

```
EcoScan/
├── frontend/          # React app (components, hooks, pages, services, utils)
├── backend/
│   └── src/
│       ├── server.js          # Express app: routes, upload handling, vision call
│       ├── carbonEngine.js    # Scoring engine (pure functions)
│       ├── config.js          # Tunable assumptions
│       └── data/carbonData.js # Base kg CO₂e per garment type
├── vision-service/
│   ├── app.py                 # FastAPI app (/health, /analyze)
│   ├── model.py               # Gemini detection with model fallback chain
│   └── requirements.txt
└── docs/                      # Carbon model, API reference, roadmap
```

## Getting started

### Prerequisites

- Node.js 18 or newer (the backend uses built-in `fetch`, `FormData` and `AbortSignal.timeout`)
- Python 3.10 or newer (3.12 recommended)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Install

```bash
git clone https://github.com/Vishnupriya1627/EcoScan.git
cd EcoScan

# vision service
cd vision-service
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
cd ..

# backend and frontend
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Environment variables

| Service | Variable | Required | Default | Purpose |
| --- | --- | --- | --- | --- |
| Vision service | `GEMINI_API_KEY` | **Yes** | none | Gemini API key |
| Backend | `VISION_URL` | No locally | `http://127.0.0.1:8000` | URL of the vision service (no trailing slash) |
| Backend | `PORT` | No | `5000` | Port the API listens on |
| Frontend | `VITE_API_URL` | No locally | `http://localhost:5000` | Backend base URL (no trailing slash, no `/api`) |

Never commit real keys. `.env` files and `.venv/` are in `.gitignore`.

### Run locally

Start the three services in separate terminals, in this order:

```bash
# 1. Vision service (set GEMINI_API_KEY first)
cd vision-service
set GEMINI_API_KEY=your_key_here          # Windows cmd; use export on macOS/Linux
uvicorn app:app --host 127.0.0.1 --port 8000

# 2. Backend
cd backend
npm start                                  # or: npm run dev

# 3. Frontend
cd frontend
npm run dev
```

| What | URL |
| --- | --- |
| Web app | http://localhost:5173 |
| Backend health | http://localhost:5000/api/health |
| Vision health | http://127.0.0.1:8000/health |
| Vision interactive docs | http://127.0.0.1:8000/docs |

## Tests

```bash
cd backend && npm test        # scoring engine, Node's built-in test runner
cd frontend && npm run lint   # oxlint
cd frontend && npm run build  # production build check
```

The vision service has no automated tests yet. Check it manually through `/docs`.

## API summary

| Service | Method | Path | Description |
| --- | --- | --- | --- |
| Backend | GET | `/api/health` | Health check |
| Backend | POST | `/api/scan` | Multipart upload (field `image`); returns the scored result |
| Backend | POST | `/api/score` | Score items you supply as JSON, no image needed |
| Backend | GET | `/api/offers?points=N` | Offers unlocked at `N` points |
| Vision | GET | `/health` | Health check |
| Vision | POST | `/analyze` | Multipart upload (field `file`); returns detected items |

Backend errors return `{ "error": "..." }`: `400` bad image, `422` no clothing detected or analysis failed, `503` vision service unavailable, `504` timeout. Full details and an example response are in [docs/api.md](docs/api.md).

## Deployment

| Part | Platform | Settings |
| --- | --- | --- |
| Frontend | Vercel | Root directory `frontend`, env `VITE_API_URL` = backend URL |
| Backend | Render (Web Service) | Root directory `backend`, build `npm install`, start `npm start`, env `VISION_URL` = vision service URL |
| Vision service | Render (Web Service) | Root directory `vision-service`, build `pip install -r requirements.txt`, start `uvicorn app:app --host 0.0.0.0 --port $PORT`, env `GEMINI_API_KEY` and `PYTHON_VERSION=3.12.7` |

Deploy in this order: vision service, then backend, then frontend. Environment variables in Vite are baked in at build time, so redeploy the frontend after changing `VITE_API_URL`.

## Design decisions

- **AI detects, rules score.** The model only reports what is visible. Carbon numbers come from a deterministic engine that can be unit-tested and explained line by line.
- **Defensive scoring.** Unknown types, bad quantities and malformed input are clamped or defaulted, and invalid conditions score as `new`, so bad input can never inflate rewards.
- **Honest uncertainty.** Every result carries a range, a confidence level and a disclaimer.
- **Resilient detection.** The vision service tries a list of Gemini models in order (two attempts each, 25-second overall limit) and returns a clear error if all fail.
- **Tunable assumptions.** Every constant lives in one config file with a version tag.

## Known limitations

- Carbon values are illustrative placeholders, not certified LCA data.
- Material is not detected from photos, so scans use the neutral material multiplier.
- Scans are treated as second-hand by default, because the UI does not yet ask for the item's condition.
- Detection can miscount or mislabel items, especially with overlapping garments.
- If Gemini is unavailable, the scan fails with an error rather than returning a lower-quality guess.
- History and rewards live in the browser, so they are per device and not synced.
- Rewards and offers are demonstrations; there are no user accounts.
- Free-tier hosting means slow first requests after idle periods.

## Roadmap highlights

- Replace placeholder carbon factors with sourced LCA data
- Detect fabric from the photo or care label
- Ask for item condition on the scan screen
- Async scan jobs with a queue, plus server-side history and user accounts
- Sustainability comparisons and trends over time

The full list is in [docs/roadmap.md](docs/roadmap.md).
