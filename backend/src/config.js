module.exports = {
  DISCLAIMER:
    "Illustrative estimates from simple category averages, not certified lifecycle-assessment (LCA) data.",
  DATA_VERSION: "ecoscan-assumptions-v1",

  // Share of footprint by lifecycle stage (must sum to 1.0)
  STAGE_SPLIT: { materials: 0.45, manufacturing: 0.30, transport: 0.08, use: 0.14, end_of_life: 0.03 },

  MATERIAL_MULT: {
    unknown: 1.0, cotton: 1.0, "organic cotton": 0.8, linen: 0.7,
    polyester: 1.15, nylon: 1.2, wool: 1.6, leather: 2.0,
  },

  KG_PER_KM_DRIVING: 0.17,      // placeholder: verify and cite (e.g. UK DESNZ)
  RESALE_REDUCTION: 0.9,        // a used item avoids ~90% of a new item's footprint (placeholder)
  DISPLACEMENT_RATE: 0.35,      // ~1 in 3 second-hand buys replace a new one (Vinted: verify)
  LONGEVITY_PER_MONTH: 0.0125,  // footprint share saved per extra month of wear (placeholder)
  LONGEVITY_CAP: 0.3,
  POINTS_PER_KG_SAVED: 20,
  MAX_QTY: 20, MAX_ITEMS: 20, MAX_MONTHS: 240,

  CONDITIONS: ["new", "secondhand", "owned"],

  GRADE_LIMITS: [[3, "A"], [6, "B"], [10, "C"], [15, "D"]], // kg per single item, else "E"
  GRADE_LABELS: { A: "Very low", B: "Low", C: "Medium", D: "High", E: "Very high" },

  OFFERS: [
    { id: "tote", title: "Free reusable tote bag", cost: 10 },
    { id: "thrift5", title: "5% off at a partner thrift store", cost: 25 },
    { id: "repair", title: "Free clothing repair voucher", cost: 50 },
    { id: "tree", title: "We plant a tree in your name", cost: 100 },
    { id: "resale20", title: "20% off a second-hand marketplace", cost: 150 },
  ],
};