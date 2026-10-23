import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Leaf, Sparkles } from "lucide-react";
import ClothingItemCard, { formatKg } from "../components/ClothingItemCard";
import LifecycleBreakdown from "../components/LifecycleBreakdown";
import CalculationDetails from "../components/CalculationDetails";
import SustainabilityComparison from "../components/comparison/SustainabilityComparison";

export default function ReportPage({ result }) {
  if (!result) {
    return <Navigate to="/scan" replace />;
  }

  const total = result.total || {};
  const footprint = Number(total.footprint_kg ?? result.totalCarbon ?? 0);
  const calories = total.carbon_calories ?? Math.round(footprint * 1000);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <Link
        to="/scan"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#315b3d] hover:text-[#203c2b]"
      >
        <ArrowLeft size={17} />
        Back to Scan Summary
      </Link>

      <div className="mt-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#e5f2dd] px-4 py-2 text-sm font-semibold text-[#315b31]">
          <Leaf size={16} />
          EcoScan · Detailed Report
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-[#203c2b] md:text-5xl">
          Your clothing impact report
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          Explore how your clothing's estimated footprint is distributed,
          what assumptions were used, and what you can do next.
        </p>
      </div>

      <section className="mt-8 rounded-3xl bg-[#203c2b] p-6 text-white md:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-white/10 p-3">
            <Sparkles size={24} />
          </span>
          <div>
            <p className="text-sm text-white/70">Total outfit footprint</p>
            <h2 className="mt-1 text-3xl font-black md:text-4xl">
              {formatKg(footprint)} kg CO₂e
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-white/70">Carbon calories</p>
            <p className="mt-2 text-xl font-bold">
              {Number(calories).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-white/70">Overall grade</p>
            <p className="mt-2 text-xl font-bold">
              {total.grade || "N/A"}
              {total.grade_label ? ` · ${total.grade_label}` : ""}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-white/70">Estimated savings</p>
            <p className="mt-2 text-xl font-bold">
              {formatKg(total.savings_kg ?? result.totalSavings ?? 0)} kg
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-white/70">Confidence</p>
            <p className="mt-2 text-xl font-bold capitalize">
              {total.confidence || "Not specified"}
            </p>
          </div>
        </div>

        {total.range_kg && (
          <p className="mt-5 text-sm text-white/80">
            Estimated range: {formatKg(total.range_kg[0])}–
            {formatKg(total.range_kg[1])} kg CO₂e
          </p>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-[#203c2b]">
            Item-by-item analysis
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Each item has its own footprint estimate, grade, and confidence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {result.items.map((item, index) => (
            <ClothingItemCard
              key={`${item.type || item.name}-${index}`}
              item={item}
              detailed
            />
          ))}
        </div>
      </section>

      <SustainabilityComparison result={result} />

      <section className="mt-10">
        <h2 className="mb-2 text-2xl font-black text-[#203c2b]">
          Lifecycle breakdown
        </h2>
        <p className="mb-5 text-sm leading-6 text-gray-500">
          See the estimated emissions from producing, transporting, using,
          and disposing of each garment.
        </p>

        <div className="space-y-5">
          {result.items.map((item, index) => (
            <div
              key={`${item.type || item.name}-lifecycle-${index}`}
              className="space-y-3"
            >
              <h3 className="font-bold capitalize text-[#203c2b]">
                {item.name || item.type || `Clothing item ${index + 1}`}
              </h3>

              {item.stages_kg ? (
                <LifecycleBreakdown stagesKg={item.stages_kg} />
              ) : (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  Lifecycle stage details are not available for this item.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-black text-[#203c2b]">
          Calculations and recommendations
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {result.items.map((item, index) => (
            <CalculationDetails
              key={`${item.type || item.name}-calculation-${index}`}
              item={item}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#dce5d7] bg-[#f8faf5] p-5">
        <h2 className="font-bold text-[#203c2b]">About these estimates</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {result.disclaimer ||
            "These are illustrative estimates based on category averages and available item details. They are not certified lifecycle assessment results."}
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Potential savings depend on assumptions about reuse and whether
          reusing or buying secondhand actually replaces a new purchase.
          They should not be interpreted as guaranteed emissions reductions.
        </p>
      </section>

      <div className="mt-8">
        <Link
          to="/scan"
          className="inline-flex items-center justify-center rounded-xl bg-[#203c2b] px-6 py-3 font-bold text-white transition hover:bg-[#315b3d]"
        >
          <ArrowLeft size={17} className="mr-2" />
          Back to Summary
        </Link>
      </div>
    </main>
  );
}