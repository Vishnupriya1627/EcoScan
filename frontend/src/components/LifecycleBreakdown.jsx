import { formatKg } from "./ClothingItemCard";

const stages = [
  { key: "materials", label: "Raw materials" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "transport", label: "Transportation" },
  { key: "use", label: "Use and care" },
  { key: "end_of_life", label: "End of life" },
];

export default function LifecycleBreakdown({ stagesKg = {} }) {
  const values = stages.map((stage) => ({
    ...stage,
    value: Number(stagesKg[stage.key] ?? 0),
  }));

  const total = values.reduce((sum, stage) => sum + stage.value, 0);
  const maxValue = Math.max(...values.map((stage) => stage.value), 0);

  return (
    <section className="rounded-2xl border border-[#dce5d7] bg-white p-6">
      <h2 className="text-xl font-bold text-[#203c2b]">
        Lifecycle emissions
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Estimated contribution from each stage of a garment's lifecycle.
      </p>

      <div className="mt-6 space-y-5">
        {values.map((stage) => (
          <div key={stage.key}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-gray-700">
                {stage.label}
              </span>
              <span className="font-semibold text-[#203c2b]">
                {formatKg(stage.value)} kg
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-[#edf1e9]">
              <div
                className="h-full rounded-full bg-[#54844d] transition-all"
                style={{
                  width: `${
                    maxValue > 0 ? (stage.value / maxValue) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 text-sm">
        <span className="text-gray-500">Sum of lifecycle stages</span>
        <span className="font-bold text-[#203c2b]">
          {formatKg(total)} kg CO₂e
        </span>
      </div>
    </section>
  );
}