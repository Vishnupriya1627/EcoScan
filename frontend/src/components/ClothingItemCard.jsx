const gradeColors = {
  A: "bg-green-100 text-green-800",
  B: "bg-lime-100 text-lime-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
};

export function formatKg(value) {
  return Number(value ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function ClothingItemCard({ item, detailed = false }) {
  const grade = String(item.grade ?? "C").toUpperCase();
  const footprint = Number(item.footprint_kg ?? item.carbon ?? item.unit_kg ?? 0);

  return (
    <article className="rounded-2xl border border-[#dce5d7] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#203c2b]">
            {item.name || item.type || "Clothing item"}
          </h3>
          <p className="mt-1 text-sm capitalize text-gray-500">
            {[item.color, item.material].filter(Boolean).join(" · ") ||
              "Material details unavailable"}
          </p>
        </div>

        <span
          className={`rounded-lg px-3 py-1 text-sm font-bold ${
            gradeColors[grade] || gradeColors.C
          }`}
        >
          Grade {grade}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-[#203c2b]">
            {formatKg(footprint)} kg
          </p>
          <p className="text-xs text-gray-500">Estimated CO₂e</p>
        </div>

        <p className="text-sm text-gray-500">
          Qty: {item.quantity ?? 1}
        </p>
      </div>

      {detailed && (
        <>
          {item.reason && (
            <p className="mt-4 text-sm leading-6 text-gray-600">
              {item.reason}
            </p>
          )}

          {item.range_kg && (
            <p className="mt-2 text-sm text-gray-500">
              Estimated range: {formatKg(item.range_kg[0])}–
              {formatKg(item.range_kg[1])} kg CO₂e
            </p>
          )}

          {item.confidence && (
            <p className="mt-2 text-sm text-gray-500">
              Confidence:{" "}
              <span className="capitalize">{item.confidence}</span>
            </p>
          )}
        </>
      )}
    </article>
  );
}