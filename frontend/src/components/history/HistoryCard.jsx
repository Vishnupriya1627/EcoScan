
import {
  CalendarDays,
  Eye,
  Trash2,
} from "lucide-react";

function formatKg(value) {
  const number = Number(value || 0);
  return `${number < 0.1 && number > 0 ? number.toFixed(3) : number.toFixed(2)} kg`;
}

function formatDate(date) {
  const parsed = new Date(date);

  if (!date || Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryCard({ entry, onView, onDelete }) {
  const items = entry.items || [];
  const footprint = Number(
    entry.total?.footprint_kg ?? entry.totalCarbon ?? 0
  );

  const grade = entry.total?.grade ?? entry.grade ?? "—";

  const itemNames = items
    .map(
      (item) =>
        item.name ||
        item.item_name ||
        item.category ||
        "Clothing item"
    )
    .slice(0, 4)
    .join(", ");

  function handleDelete() {
    if (window.confirm("Delete this scan from your history?")) {
      onDelete(entry.scanId);
    }
  }

  return (
    <article className="rounded-2xl border border-[#e4eadf] bg-white p-5 shadow-sm transition hover:border-[#cbd9c5] sm:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e6f0df] px-3 py-1 text-xs font-bold text-[#315b37]">
              Grade {grade}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-[#728173]">
              <CalendarDays size={14} />
              {formatDate(entry.scannedAt)}
            </span>
          </div>

          <h3 className="text-lg font-bold">
            {items.length}{" "}
            {items.length === 1 ? "clothing item" : "clothing items"} analyzed
          </h3>

          <p className="mt-1 truncate text-sm text-[#728173]">
            {itemNames}
            {items.length > 4 ? "…" : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <div>
              <span className="block text-xs text-[#728173]">
                Estimated footprint
              </span>
              <span className="mt-1 block font-bold text-[#203c2b]">
                {formatKg(footprint)} CO₂e
              </span>
            </div>

            <div>
              <span className="block text-xs text-[#728173]">
                Carbon calories
              </span>
              <span className="mt-1 block font-bold text-[#203c2b]">
                {Number(
                  entry.total?.carbon_calories ??
                    Math.round(footprint * 1000)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onView(entry)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#315b37] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#25472b] md:flex-none"
          >
            <Eye size={16} />
            View report
          </button>

          <button
            onClick={handleDelete}
            aria-label="Delete scan"
            title="Delete scan"
            className="inline-flex items-center justify-center rounded-xl border border-[#e4eadf] px-3 py-3 text-[#728173] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
