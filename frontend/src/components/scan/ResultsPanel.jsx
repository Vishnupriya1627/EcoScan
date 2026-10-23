import ClothingItemCard from "../ClothingItemCard";
import EmptyResults from "./EmptyResults";
import FootprintSummary from "./FootprintSummary";
import { getItemName, summarizeResult } from "../../utils/footprint";

export default function ResultsPanel({ result, earned }) {
  if (!result) return <EmptyResults />;

  const { totalFootprint, items, itemWeights, weightSum, kmDriven } =
    summarizeResult(result);

  return (
    <div className="space-y-5">
      <FootprintSummary
        totalFootprint={totalFootprint}
        items={items}
        itemWeights={itemWeights}
        weightSum={weightSum}
        kmDriven={kmDriven}
        earned={earned}
      />

      {items.length > 0 && (
        <div>
          <div className="mb-4 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                Item analysis
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                Inside your wardrobe
              </h3>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              {items.length} detected
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item, index) => (
              <ClothingItemCard
                key={`${getItemName(item)}-${index}`}
                item={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
