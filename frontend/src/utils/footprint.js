import { KG_PER_KM_DRIVEN } from "../constants/content";

export function getItemName(item) {
  return item?.name || item?.item_name || "Item";
}

export function getItemWeight(item) {
  return Number(item?.footprint_kg ?? item?.carbon_kg ?? item?.carbon ?? 0);
}

/** Derives everything the results UI needs from the API response. */
export function summarizeResult(result) {
  const totalFootprint = Number(
    result?.total?.footprint_kg ?? result?.totalCarbon ?? 0
  );

  const items = result?.items || [];
  const itemWeights = items.map(getItemWeight);
  const weightSum = itemWeights.reduce((a, b) => a + b, 0);
  const kmDriven = Math.round(totalFootprint / KG_PER_KM_DRIVEN);

  return { totalFootprint, items, itemWeights, weightSum, kmDriven };
}
