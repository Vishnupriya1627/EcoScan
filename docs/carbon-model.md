[← Back to README](../README.md)

# Carbon scoring model

All values live in `backend/src/config.js` and `backend/src/data/carbonData.js`, and the version tag `ecoscan-assumptions-v1` is returned with every result.

> **These are illustrative placeholders chosen to be plausible and easy to tune. They are not sourced from certified lifecycle-assessment (LCA) data.** Replacing them with sourced values is the first item in the [roadmap](roadmap.md).

## Base footprint per garment

Kg CO₂e to make one new item.

| Type | kg | Type | kg |
| --- | --- | --- | --- |
| T-shirt | 5 | Skirt | 7 |
| Shirt | 7 | Sweater | 11 |
| Jeans | 10 | Jacket | 15 |
| Trousers | 9 | Shoes | 14 |
| Dress | 12 | Hoodie | 14 |
| Shorts | 6 | Other / unknown | 8 |

## Calculation

```
unit footprint  = base kg for the garment type × material multiplier
item footprint  = unit footprint × quantity
```

- **Material multiplier:** cotton 1.0, organic cotton 0.8, linen 0.7, polyester 1.15, nylon 1.2, wool 1.6, leather 2.0, unknown 1.0 (denim is treated as cotton). The vision service currently returns only type, colour and quantity, so photo scans use the neutral `unknown` multiplier. Materials apply when supplied to `/api/score`.
- **Quantity:** clamped to 1–20 per item, with at most 20 items per scan.
- **Unknown garment types** fall back to `other` (8 kg).

## Uncertainty and confidence

| Situation | Range around the estimate | Confidence |
| --- | --- | --- |
| Material known | ±20% | high |
| Material unknown (typical photo scan) | ±35% | medium |
| Low-confidence detection flag set | ±50% | low |

The low-confidence row applies when the `fallback` flag is passed to the engine. The vision service no longer sets it, but `/api/score` still accepts it.

## Lifecycle split

Each item's footprint is split using fixed shares: materials 45%, manufacturing 30%, transport 8%, use 14%, end of life 3%.

## Grades

Based on the footprint of a single item (kg CO₂e). For a whole outfit it uses the average footprint per unit.

| Grade | Per item | Label |
| --- | --- | --- |
| A | up to 3 kg | Very low |
| B | up to 6 kg | Low |
| C | up to 10 kg | Medium |
| D | up to 15 kg | High |
| E | over 15 kg | Very high |

## Potential savings

Savings depend on the condition of the item and are never negative.

| Condition | Savings |
| --- | --- |
| `new` | 0, because buying new avoids nothing |
| `secondhand` | footprint × 0.90 (reuse reduction) × 0.35 (displacement rate) |
| `owned` | footprint × min(30%, months owned × 1.25%) |

- **Reuse reduction (0.90):** a used item avoids about 90% of a new item's footprint (placeholder).
- **Displacement rate (0.35):** roughly one in three second-hand purchases replaces buying a new item (placeholder).
- **Longevity:** each extra month of wear saves 1.25% of the footprint, capped at 30% (placeholder).
- **Default condition:** the web app currently sends only the image, so scans are treated as `secondhand`. The savings shown are **potential** savings, not reductions already achieved.

## Equivalents

- **Driving:** 0.17 kg CO₂e per km of an average passenger car (placeholder). This is the same order of magnitude as published average-car factors, but it is not tied to a specific year or vehicle class.
- **Carbon calories:** 1 g CO₂e = 1 "carbon calorie", shown as a simple, relatable unit.

## Worked example

One T-shirt, material unknown, scanned as second-hand:

- Footprint: 5 kg × 1.0 = **5 kg CO₂e** (range 3.25–6.75 kg, grade B)
- Savings: 5 × 0.90 × 0.35 = **1.58 kg**

## Eco Points

- **Points per scan** (frontend): `min(100, round(savings_kg × 10))`. The T-shirt above earns **16 points**.
- **Balance and redeemed coupons** are stored in the browser (`localStorage`). A scan is only awarded points once.
- **Demo offers** (`frontend/src/utils/rewards.js`):

| Offer | Cost |
| --- | --- |
| 5% off your next purchase (Eco Essentials) | 50 points |
| 10% off your next purchase (Conscious Closet) | 100 points |
| ₹200 off your purchase (Rewear Club) | 200 points |

These offers and coupon codes are **demonstration only**; no real partner integration exists. The backend also exposes its own reference points (20 per kg saved) and offer thresholds through `/api/scan` and `/api/offers`, but the web app uses the frontend rules above.
