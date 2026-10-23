import { BAR_COLORS } from "../../constants/content";
import { getItemName } from "../../utils/footprint";
import { formatKg } from "../ClothingItemCard";

export default function FootprintBreakdown({ items, itemWeights, weightSum }) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">Your footprint breakdown</h3>
        <p className="mt-1 text-xs text-gray-500">
          Contribution by clothing item
        </p>
      </div>

      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100"
        role="img"
        aria-label="Carbon footprint distribution by clothing item"
      >
        {itemWeights.map((weight, index) => (
          <span
            key={index}
            title={`${getItemName(items[index])}: ${formatKg(weight)}`}
            className={`${BAR_COLORS[index % BAR_COLORS.length]} transition-all duration-500`}
            style={{ width: `${(weight / weightSum) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={`${getItemName(item)}-legend-${index}`}
            className="flex min-w-0 items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
            />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700">
              {getItemName(item)}
            </span>
            <span className="shrink-0 text-xs font-semibold text-gray-900">
              {formatKg(itemWeights[index])}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
