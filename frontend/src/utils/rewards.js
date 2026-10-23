
export const REWARDS_STORAGE_KEY = "ecoscan_rewards_v1";

export const REWARD_OFFERS = [
  {
    id: "eco-5",
    brand: "Eco Essentials",
    title: "5% off your next purchase",
    description: "A small reward for making a more sustainable choice.",
    pointsCost: 50,
    codePrefix: "GREEN5",
    category: "Sustainable shopping",
  },
  {
    id: "eco-10",
    brand: "Conscious Closet",
    title: "10% off your next purchase",
    description: "Save more on qualifying sustainable clothing.",
    pointsCost: 100,
    codePrefix: "GREEN10",
    category: "Sustainable clothing",
  },
  {
    id: "eco-200",
    brand: "Rewear Club",
    title: "₹200 off your purchase",
    description: "A reward for choosing reuse and circular fashion.",
    pointsCost: 200,
    codePrefix: "REWEAR200",
    category: "Second-hand fashion",
  },
];

export function calculateEcoPoints(entry) {
  const savings = Number(
    entry?.total?.savings_kg ??
      entry?.totalSavings ??
      entry?.savings_kg ??
      0
  );

  if (!Number.isFinite(savings) || savings <= 0) {
    return 0;
  }

  return Math.min(100, Math.round(savings * 10));
}

export function loadRewards() {
  try {
    const stored = localStorage.getItem(REWARDS_STORAGE_KEY);

    if (!stored) {
      return {
        balance: 0,
        processedScanIds: [],
        redeemedCoupons: [],
      };
    }

    const parsed = JSON.parse(stored);

    return {
      balance: Math.max(0, Number(parsed.balance) || 0),
      processedScanIds: Array.isArray(parsed.processedScanIds)
        ? parsed.processedScanIds
        : [],
      redeemedCoupons: Array.isArray(parsed.redeemedCoupons)
        ? parsed.redeemedCoupons
        : [],
    };
  } catch {
    return {
      balance: 0,
      processedScanIds: [],
      redeemedCoupons: [],
    };
  }
}

export function saveRewards(rewards) {
  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
    return true;
  } catch {
    return false;
  }
}
