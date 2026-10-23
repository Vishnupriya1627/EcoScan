// Grade bands for the footprint of ONE garment (kg CO2e).
// Illustrative thresholds: document them in the README as design assumptions.
export const GRADE_BANDS = [
  { grade: "A", maxKg: 2, label: "Very low" },
  { grade: "B", maxKg: 5, label: "Low" },
  { grade: "C", maxKg: 10, label: "Medium" },
  { grade: "D", maxKg: 18, label: "High" },
  { grade: "E", maxKg: Infinity, label: "Very high" },
];

export const GRADE_STYLES = {
  A: "bg-green-600 text-white",
  B: "bg-lime-400 text-lime-950",
  C: "bg-yellow-300 text-yellow-950",
  D: "bg-orange-400 text-orange-950",
  E: "bg-red-600 text-white",
};

// Approximate conversion factors. Verify against a published source
// (for example the EPA greenhouse gas equivalencies calculator) and cite it in the README.
const KG_CO2E_PER_KM_CAR = 0.25; // average passenger car
const KG_CO2E_PER_PHONE_CHARGE = 0.008; // one full smartphone charge

const round2 = (n) => Math.round(n * 100) / 100;

export function gradeForKg(kg) {
  const value = Number(kg);
  if (!Number.isFinite(value) || value < 0) return null;
  return GRADE_BANDS.find((band) => value <= band.maxKg) ?? null;
}

// Outfit grade = grade of the average footprint per item row, so a 1-item scan
// and a 5-item scan are judged on the same scale.
export function outfitGrade(items) {
  const values = (items ?? [])
    .map((item) => Number(item.carbon))
    .filter((n) => Number.isFinite(n) && n >= 0);
  if (values.length === 0) return null;

  const averageKg = values.reduce((sum, n) => sum + n, 0) / values.length;
  const band = gradeForKg(averageKg);
  return band ? { ...band, averageKg: round2(averageKg) } : null;
}

export function equivalents(totalKg) {
  const kg = Number(totalKg);
  if (!Number.isFinite(kg) || kg <= 0) return [];

  const km = kg / KG_CO2E_PER_KM_CAR;
  const charges = kg / KG_CO2E_PER_PHONE_CHARGE;

  return [
    { key: "car", text: `${km < 10 ? km.toFixed(1) : Math.round(km)} km driven in an average car` },
    { key: "phone", text: `${Math.round(charges).toLocaleString()} smartphone charges` },
  ];
}