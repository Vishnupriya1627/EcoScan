
import { useState } from "react";
import "./SustainabilityComparison.css";

const SCENARIOS = [
  {
    id: "secondhand",
    name: "Buy second-hand",
    multiplier: 0.3,
    description: "An illustrative scenario for choosing a pre-owned item.",
    tag: "Lower new-production impact",
  },
  {
    id: "lower-impact",
    name: "Choose a lower-impact option",
    multiplier: 0.7,
    description: "An illustrative scenario for a comparable alternative.",
    tag: "Alternative material or production",
  },
];

function getFootprint(item) {
  return Number(item?.footprint_kg ?? item?.carbon ?? item?.unit_kg ?? 0);
}

function formatKg(value) {
  return `${value.toFixed(2)} kg CO₂e`;
}

export default function SustainabilityComparison({ result }) {
  const items = result?.items || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!items.length && !result?.total?.footprint_kg && !result?.totalCarbon) {
    return null;
  }

  const selectedItem =
    items[Math.min(selectedIndex, Math.max(items.length - 1, 0))];

  const baseline = items.length
    ? getFootprint(selectedItem)
    : Number(result?.total?.footprint_kg ?? result?.totalCarbon ?? 0);

  const itemName =
    selectedItem?.name ||
    selectedItem?.item_name ||
    selectedItem?.category ||
    selectedItem?.type ||
    "Scanned clothing item";

  const scenarios = [
    {
      id: "current",
      name: "Comparable new item",
      footprint: baseline,
      description: "Reference footprint from your scan.",
      tag: "Baseline",
    },
    ...SCENARIOS.map((scenario) => ({
      ...scenario,
      footprint: baseline * scenario.multiplier,
      savings: baseline * (1 - scenario.multiplier),
    })),
  ];

  const maxFootprint = Math.max(
    baseline,
    ...scenarios.map((scenario) => scenario.footprint),
    0.01
  );

  return (
    <section className="sustainability-comparison">
      <div className="comparison-heading">
        <div>
          <span className="comparison-eyebrow">MAKE A GREENER CHOICE</span>
          <h2>Sustainability comparison</h2>
          <p>
            See how different clothing choices could change the estimated
            carbon footprint.
          </p>
        </div>
        <span className="comparison-leaf" aria-hidden="true">
          🌱
        </span>
      </div>

      {items.length > 1 && (
        <div className="comparison-selector">
          <label htmlFor="comparison-item">Compare item</label>
          <select
            id="comparison-item"
            value={selectedIndex}
            onChange={(event) => setSelectedIndex(Number(event.target.value))}
          >
            {items.map((item, index) => (
              <option key={`${item.name || item.item_name || "item"}-${index}`} value={index}>
                {item.name ||
                  item.item_name ||
                  item.category ||
                  item.type ||
                  `Item ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="comparison-baseline">
        <span className="comparison-item-label">Selected item</span>
        <h3>{itemName}</h3>
        <div className="comparison-baseline-value">{formatKg(baseline)}</div>
        <p>Estimated footprint used as the comparison baseline</p>
      </div>

      <div className="comparison-scenarios">
        {scenarios.map((scenario) => {
          const reduction =
            baseline > 0
              ? Math.max(
                  0,
                  ((baseline - scenario.footprint) / baseline) * 100
                )
              : 0;

          return (
            <article
              className={`comparison-scenario ${
                scenario.id === "current" ? "is-baseline" : ""
              }`}
              key={scenario.id}
            >
              <div className="comparison-scenario-top">
                <div>
                  <h3>{scenario.name}</h3>
                  <p>{scenario.description}</p>
                </div>
                <span className="comparison-scenario-value">
                  {formatKg(scenario.footprint)}
                </span>
              </div>

              <div
                className="comparison-bar-track"
                role="img"
                aria-label={`${scenario.name}: ${formatKg(
                  scenario.footprint
                )}`}
              >
                <div
                  className={`comparison-bar ${
                    scenario.id === "current" ? "baseline-bar" : "alternative-bar"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (scenario.footprint / maxFootprint) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="comparison-scenario-bottom">
                <span>{scenario.tag}</span>
                {scenario.id !== "current" && baseline > 0 && (
                  <strong>
                    ~{Math.round(reduction)}% lower estimate
                  </strong>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="comparison-repair">
        <span className="comparison-repair-icon" aria-hidden="true">
          ♻️
        </span>
        <div>
          <h3>Keep, reuse or repair</h3>
          <p>
            Extending the life of clothing can help avoid the need to buy a
            replacement. If it prevents one comparable new purchase, the
            potential avoided footprint could be around {formatKg(baseline)}.
          </p>
          <span className="comparison-repair-note">
            Potential avoided emissions, not a guaranteed saving.
          </span>
        </div>
      </div>

      <p className="comparison-disclaimer">
        <strong>About these estimates:</strong> The current-item value comes
        from your scan. Alternative scenarios use illustrative assumptions
        (30% of baseline for second-hand and 70% for a lower-impact alternative).
        They are not verified product-specific measurements. Replace these
        assumptions with reliable material and lifecycle data when available.
        Actual emissions depend on materials, production, transport, use and
        end-of-life.
      </p>
    </section>
  );
}
