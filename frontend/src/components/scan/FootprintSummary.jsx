import { Link } from "react-router-dom";
import { Leaf, Sparkles, Car, ArrowRight } from "lucide-react";
import { formatKg } from "../ClothingItemCard";
import FootprintBreakdown from "./FootprintBreakdown";

export default function FootprintSummary({
  totalFootprint,
  items,
  itemWeights,
  weightSum,
  kmDriven,
  earned,
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-[#102e25] p-5 text-white sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/[0.07]"
        />

        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-100/80">
              <Leaf size={14} className="text-lime-300" />
              Total estimated footprint
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {formatKg(totalFootprint)}
            </p>

            <p className="mt-2 text-sm text-emerald-100/70">
              kg CO₂e estimated for your scan
            </p>

            {kmDriven > 0 && (
              <div className="mt-4 inline-flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-emerald-50/90">
                <Car size={17} className="mt-0.5 shrink-0 text-lime-300" />
                <span className="leading-5">
                  Roughly equivalent to driving{" "}
                  <strong className="text-white">
                    {kmDriven.toLocaleString()} km
                  </strong>{" "}
                  in a petrol car.
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2.5">
            <div className="min-w-[76px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 text-center">
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="mt-1 text-[11px] text-emerald-100/70">
                {items.length === 1 ? "Item" : "Items"}
              </p>
            </div>

            <div className="min-w-[88px] rounded-2xl bg-lime-300 px-3 py-3 text-center text-[#173326]">
              <Sparkles size={16} className="mx-auto mb-1" />
              <p className="text-2xl font-bold">{earned}</p>
              <p className="mt-1 text-[11px] font-semibold">Eco Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {weightSum > 0 && (
          <FootprintBreakdown
            items={items}
            itemWeights={itemWeights}
            weightSum={weightSum}
          />
        )}

        <Link
          to="/report"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
        >
          View detailed report
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
