[← Back to README](../README.md)

# Roadmap

## Technical scaling

**Scale the backend for larger user loads**

- **Make the vision step asynchronous.** Today a request waits on the vision model (up to a minute). Accept the upload, return a job ID, process it from a queue (Redis with BullMQ or Celery), and let the client poll or receive updates over Server-Sent Events.
- **Scale horizontally.** The Node API is stateless, so run several instances behind a load balancer and autoscale on request rate. Run vision workers as a separate pool, scaled on queue depth. Containerise each service with Docker.
- **Cache repeat work.** Hash each image (a perceptual hash catches near-duplicates) and cache its detection result, so identical scans skip the model call and its cost.
- **Protect the model budget.** Add per-user and per-IP rate limits, request-size checks at the edge, and a circuit breaker around Gemini.
- **Restore a cheap fallback.** Detection currently fails outright when Gemini is unavailable. A lightweight fallback (for example a quantised or ONNX CLIP classifier in a separate worker) could return a low-confidence result instead.
- **Persist data server-side.** Move scan history and rewards from the browser into PostgreSQL with user accounts, and store images in object storage (S3-compatible) with short-lived signed URLs and a retention policy.
- **Shrink uploads on the client.** Resize and compress images in the browser before upload to cut bandwidth and latency.
- **Observe everything.** Structured logs, request tracing across the three services, metrics (latency, error rate, cost per scan) and alerts. Keep secrets in a secrets manager and serve the frontend through a CDN.
- **Avoid cold starts.** Move off free-tier hosting, or add an uptime pinger, so the first scan after idle is fast.

## Improve the carbon scoring model

- **Replace placeholders with sourced data.** Use published lifecycle datasets (for example ecoinvent, the Higg Materials Sustainability Index, and WRAP studies) per garment and material, store the source and year with every factor, and version the dataset.
- **Detect materials.** Extend the vision prompt to estimate fabric, or read the care label with OCR, so the existing material multipliers apply to photo scans.
- **Model more drivers.** Garment weight and size, country of manufacture and its grid carbon intensity, transport mode and distance, and use-phase assumptions such as wash temperature, tumble drying and expected wears.
- **Per-wear footprint.** Report CO₂e per wear instead of per item, which rewards durable and frequently worn clothes.
- **Propagate uncertainty properly.** Replace fixed ± percentages with distributions (for example Monte Carlo sampling) and report a calibrated interval.
- **Ask for the item's condition.** The engine already supports `new`, `secondhand` and `owned` with months owned. Add this choice to the scan screen so savings reflect reality.
- **Validate.** Compare estimates against published LCAs for reference garments and use user corrections to calibrate detection and quantities.

## Product improvements

- **Sustainability comparisons.** Compare an outfit with the average wardrobe, show "what if" alternatives side by side (second-hand versus new, organic cotton versus polyester, one more year of wear), and show how each swap changes the grade.
- **Trends over time.** Use scan history to chart footprint per month, set goals, and reward streaks such as "three repairs this month".
- **Actionable next steps.** Turn each item's suggested action (repair, resell, keep wearing) into local options: nearby repair shops and resale links.
- **Richer equivalents.** Let users pick relatable comparisons (km driven, trees, flights, phone charges) and localise units and currency.
- **Sharing.** Shareable summary cards for a scan or monthly progress.
- **Quality of life.** Multi-photo scans, editing detected items before scoring, accessibility audits, and multiple languages.

## Integrate external APIs for real-time data

- **Emission factors.** Pull current factors from a service such as Climatiq instead of static constants, with caching and a fallback to the bundled values when the service is unavailable.
- **Grid carbon intensity.** Use a live source such as Electricity Maps or the UK Carbon Intensity API to model use-phase and manufacturing-region emissions by location and time.
- **Product and brand data.** Look up products by barcode or QR (GS1 Digital Link) for exact materials, and bring in brand sustainability ratings where licensing allows.
- **Local services.** Use a maps or places API to find repair, alteration and second-hand shops near the user.
- **Real rewards.** Replace demo offers with partner coupon or voucher APIs and track redemptions server-side.
- **Integration design.** Wrap each provider behind an adapter with timeouts, retries, caching with a time-to-live, and contract tests, so a provider outage never blocks a scan.
