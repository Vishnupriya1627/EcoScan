
import { History, Shirt, Leaf, Sparkles } from "lucide-react";

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-[#e4eadf] bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f0df] text-[#315b37]">
        {icon}
      </div>
      <p className="text-sm text-[#728173]">{label}</p>
      <p className="mt-1 break-words text-2xl font-bold text-[#203c2b]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#849184]">{detail}</p>
    </div>
  );
}

export default function HistoryStats({ history }) {
  const totalItems = history.reduce(
    (sum, scan) => sum + (scan.items?.length || 0),
    0
  );

  const totalFootprint = history.reduce(
    (sum, scan) =>
      sum + Number(scan.total?.footprint_kg ?? scan.totalCarbon ?? 0),
    0
  );

  const totalSavings = history.reduce(
    (sum, scan) =>
      sum + Number(scan.total?.savings_kg ?? scan.totalSavings ?? 0),
    0
  );

  const formatKg = (value) => `${value.toFixed(2)} kg`;

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<History size={20} />}
        label="Total scans"
        value={history.length}
        detail="Scans saved"
      />
      <StatCard
        icon={<Shirt size={20} />}
        label="Items analyzed"
        value={totalItems}
        detail="Across all saved scans"
      />
      <StatCard
        icon={<Leaf size={20} />}
        label="Estimated footprint"
        value={formatKg(totalFootprint)}
        detail="Combined across scans"
      />
      <StatCard
        icon={<Sparkles size={20} />}
        label="Potential savings"
        value={formatKg(totalSavings)}
        detail="Estimated, not guaranteed"
      />
    </section>
  );
}
