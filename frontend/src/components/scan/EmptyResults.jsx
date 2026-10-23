import { Leaf, Sparkles, CheckCircle2 } from "lucide-react";

const DISCOVER_POINTS = [
  "The estimated footprint of your outfit",
  "Which clothing items contribute most",
  "Insights to support mindful choices",
];

export default function EmptyResults() {
  return (
    <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
            Your results
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
            Your impact starts here.
          </h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <Leaf size={24} />
        </div>
      </div>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
        Your analysis will show an estimated carbon footprint, a breakdown of
        individual clothing items, and the Eco Points you earn.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-[#f6faf4] p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
            <Leaf size={19} />
          </div>
          <p className="text-xs text-gray-500">Total carbon footprint</p>
          <p className="mt-1 text-xl font-bold text-gray-900">-- kg CO₂e</p>
        </div>

        <div className="rounded-2xl border border-lime-100 bg-[#fbfced] p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
            <Sparkles size={19} />
          </div>
          <p className="text-xs text-gray-500">Rewards for your scan</p>
          <p className="mt-1 text-xl font-bold text-gray-900">Eco Points</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-800">
          What you'll discover
        </p>

        <div className="mt-4 space-y-4">
          {DISCOVER_POINTS.map((label) => (
            <div
              key={label}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <CheckCircle2 size={17} className="shrink-0 text-emerald-700" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
