const carbonData = require("./data/carbonData");
const C = require("./config");

const CONF_ORDER = ["low", "medium", "high"];
const r2 = (n) => Math.round(n * 100) / 100;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));

function cleanType(t) {
  const s = String(t ?? "other").toLowerCase().trim();
  return Object.hasOwn(carbonData, s) ? s : "other";
}
function cleanMaterial(m) {
  let s = String(m ?? "unknown").toLowerCase().trim();
  if (s === "denim") s = "cotton";
  return Object.hasOwn(C.MATERIAL_MULT, s) ? s : "unknown";
}
function cleanQty(q) {
  const n = Number.parseInt(q, 10);
  return Number.isNaN(n) ? 1 : clamp(n, 1, C.MAX_QTY);
}
function cleanMonths(m) {
  const n = Number.parseInt(m, 10);
  return Number.isNaN(n) ? 0 : clamp(n, 0, C.MAX_MONTHS);
}

// ---------- pure helpers ----------
function gradeFor(kgPerItem) {
  for (const [limit, g] of C.GRADE_LIMITS) if (kgPerItem <= limit) return g;
  return "E";
}
const kmEquivalent = (kg) => r2(Math.max(kg, 0) / C.KG_PER_KM_DRIVING);

/** Carbon actually avoided. Never negative; zero when buying new. */
function savingsKg(newKg, condition, monthsOwned) {
  let s = 0;
  if (condition === "secondhand") {
    s = newKg * C.RESALE_REDUCTION * C.DISPLACEMENT_RATE;
  } else if (condition === "owned") {
    const frac = Math.min(C.LONGEVITY_CAP, Math.max(monthsOwned, 0) * C.LONGEVITY_PER_MONTH);
    s = newKg * frac;
  }
  return Math.max(s, 0);
}

function savingsRule(condition, months) {
  if (condition === "secondhand")
    return `new footprint x ${C.RESALE_REDUCTION * 100}% reuse reduction x ${C.DISPLACEMENT_RATE * 100}% displacement rate`;
  if (condition === "owned")
    return `new footprint x ${months} months x ${(C.LONGEVITY_PER_MONTH * 100).toFixed(2)}%/month (capped at ${C.LONGEVITY_CAP * 100}%)`;
  return "No savings: buying new avoids nothing";
}

function reason(type, material, mult, grade) {
  const bits = [];
  if (material !== "unknown" && mult >= 1.15) bits.push(`it's ${material}, a higher-impact material`);
  if (material !== "unknown" && mult <= 0.85) bits.push(`it's ${material}, a lower-impact material`);
  if (carbonData[type].carbon >= 12) bits.push(`a ${type} is a heavy, material-intensive item`);
  const why = bits.length ? bits.join(" and ") : `typical footprint for a ${type}`;
  return `${C.GRADE_LABELS[grade]} impact: ${why}.`;
}

// ---------- core ----------
function scoreItem(raw, condition, months, fallback) {
  const type = cleanType(raw.type);
  const material = cleanMaterial(raw.material);
  const qty = cleanQty(raw.quantity ?? 1);
  const mult = C.MATERIAL_MULT[material];
  const base = carbonData[type].carbon;

  const unitKg = base * mult;
  const totalKg = unitKg * qty;

  let uncertainty = material !== "unknown" ? 0.2 : 0.35;
  if (fallback) uncertainty = Math.max(uncertainty, 0.5); // basic detection: widen the range
  const confidence = fallback ? "low" : material !== "unknown" ? "high" : "medium";

  const saved = savingsKg(totalKg, condition, months);
  const grade = gradeFor(unitKg);
  const [actionTitle, actionDetail] = carbonData[type].action;

  const item = {
    type,
    name: carbonData[type].name,
    color: String(raw.color ?? "uncertain").slice(0, 40),
    material,
    quantity: qty,
    unit_kg: r2(unitKg),
    footprint_kg: r2(totalKg),
    range_kg: [r2(totalKg * (1 - uncertainty)), r2(totalKg * (1 + uncertainty))],
    carbon_calories: Math.round(totalKg * 1000), // 1 g CO2e = 1 carbon calorie
    grade,
    grade_label: C.GRADE_LABELS[grade],
    equivalent_km: kmEquivalent(totalKg),
    savings_kg: r2(saved),
    confidence,
    reason: reason(type, material, mult, grade),
    stages_kg: Object.fromEntries(Object.entries(C.STAGE_SPLIT).map(([k, v]) => [k, r2(totalKg * v)])),
    next_action: { title: actionTitle, detail: actionDetail },
    how_calculated: {
      base_kg_per_item: base,
      material,
      material_multiplier: mult,
      quantity: qty,
      savings_rule: savingsRule(condition, months),
      source: C.DATA_VERSION,
    },
  };
  return { item, baselineKg: base * qty };
}

function offersFor(points) {
  const p = Math.max(Number.parseInt(points, 10) || 0, 0);
  const available = C.OFFERS.filter((o) => o.cost <= p);
  const locked = C.OFFERS.filter((o) => o.cost > p);
  let nextOffer = null;
  if (locked.length) {
    const n = locked.reduce((a, b) => (a.cost <= b.cost ? a : b));
    nextOffer = { ...n, points_needed: n.cost - p };
  }
  return { points: p, available, next_offer: nextOffer };
}

function scoreOutfit(items, { condition = "secondhand", monthsOwned = 0, fallback = false } = {}) {
  const cond = C.CONDITIONS.includes(condition) ? condition : "new"; // bad input never over-rewards
  const months = cleanMonths(monthsOwned);

  const list = Array.isArray(items)
    ? items.slice(0, C.MAX_ITEMS).filter((i) => i && typeof i === "object" && !Array.isArray(i))
    : [];
  const results = list.map((i) => scoreItem(i, cond, months, Boolean(fallback)));
  const scored = results.map((r) => r.item);

  const total = scored.reduce((s, i) => s + i.footprint_kg, 0);
  const lo = scored.reduce((s, i) => s + i.range_kg[0], 0);
  const hi = scored.reduce((s, i) => s + i.range_kg[1], 0);
  const saved = scored.reduce((s, i) => s + i.savings_kg, 0);
  const baseline = results.reduce((s, r) => s + r.baselineKg, 0);
  const units = scored.reduce((s, i) => s + i.quantity, 0);

  const grade = gradeFor(units ? total / units : 0);
  const vsTypical = baseline ? Math.round(((total - baseline) / baseline) * 1000) / 10 : 0;
  const confidence = scored.length
    ? CONF_ORDER[Math.min(...scored.map((i) => CONF_ORDER.indexOf(i.confidence)))]
    : "low";
  const points = Math.max(Math.round(saved * C.POINTS_PER_KG_SAVED), 0);

  return {
    items: scored,
    total: {
      footprint_kg: r2(total),
      range_kg: [r2(lo), r2(hi)],
      carbon_calories: Math.round(total * 1000),
      grade,
      grade_label: C.GRADE_LABELS[grade],
      equivalent_km: kmEquivalent(total),
      savings_kg: r2(saved),
      vs_typical_pct: vsTypical, // negative = below average for these items
      confidence,
    },
    points,
    offers: offersFor(points),
    condition: cond,
    months_owned: months,
    assumptions: {
      displacement_rate: C.DISPLACEMENT_RATE,
      resale_reduction: C.RESALE_REDUCTION,
      kg_per_km_driving: C.KG_PER_KM_DRIVING,
      version: C.DATA_VERSION,
    },
    disclaimer: C.DISCLAIMER,
  };
}

module.exports = { scoreOutfit, offersFor, savingsKg, gradeFor };