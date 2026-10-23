import { Leaf, Sparkles, Shirt } from "lucide-react";

export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <Leaf size={38} className="text-green-600" />
        <h2 className="mt-4 text-lg font-bold">Your results will appear here</h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
          Upload an image and scan it to see the estimated carbon footprint of your clothing.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl bg-green-900 p-6 text-white sm:p-7">
        <div className="flex items-center gap-2 text-green-200">
          <Leaf size={19} />
          <span className="text-sm font-medium">Estimated carbon footprint</span>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {result.totalCarbon}
          </span>
          <span className="pb-1 text-green-200">kg CO₂e</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-green-100">
          Based on {result.items.length} identified clothing item(s).
          These are illustrative estimates, not verified lifecycle measurements.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
          <div className="rounded-xl bg-lime-300 p-3 text-green-950">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-sm text-green-100">Eco-reward points earned</p>
            <p className="text-2xl font-bold">+{result.points}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Identified items</h2>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            {result.items.length} items
          </span>
        </div>

        <div className="space-y-3">
          {result.items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff5e9] text-green-800">
                <Shirt size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Estimated footprint per item
                </p>
              </div>

              <p className="shrink-0 font-bold">
                {item.carbon} <span className="text-xs font-normal text-gray-500">kg</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-sm">
          <span className="text-gray-500">Total estimated footprint</span>
          <span className="font-bold">{result.totalCarbon} kg CO₂e</span>
        </div>
      </div>
    </section>
  );
}