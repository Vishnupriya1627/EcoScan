export default function CalculationDetails({ item }) {
  const calculation = item.how_calculated || {};
  const action = item.next_action;

  return (
    <section className="rounded-2xl border border-[#dce5d7] bg-white p-6">
      <h2 className="text-xl font-bold text-[#203c2b]">
        How was this calculated?
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        This footprint is an estimate based on clothing-category averages
        and the available item details.
      </p>

      <dl className="mt-5 space-y-3">
        {calculation.base_kg_per_item != null && (
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-500">Base footprint per item</dt>
            <dd className="font-semibold text-[#203c2b]">
              {calculation.base_kg_per_item} kg
            </dd>
          </div>
        )}

        {calculation.material && (
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-500">Material used</dt>
            <dd className="font-semibold capitalize text-[#203c2b]">
              {calculation.material}
            </dd>
          </div>
        )}

        {calculation.material_multiplier != null && (
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-500">Material multiplier</dt>
            <dd className="font-semibold text-[#203c2b]">
              {calculation.material_multiplier}×
            </dd>
          </div>
        )}

        {calculation.source && (
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-500">Calculation version</dt>
            <dd className="text-right font-medium text-[#203c2b]">
              {calculation.source}
            </dd>
          </div>
        )}
      </dl>

      {action && (
        <div className="mt-6 rounded-xl bg-[#edf5e8] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#54844d]">
            Recommended next action
          </p>
          <h3 className="mt-2 font-bold text-[#203c2b]">
            {action.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {action.detail}
          </p>
        </div>
      )}
    </section>
  );
}