
import { useEffect, useState } from "react";
import {
  X,
  Leaf,
  Sparkles,
  Trophy,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./EcoRewardModal.css";

const CONFETTI_COLORS = [
  "#5C9B63",
  "#E9C46A",
  "#8ABF91",
  "#F4A261",
  "#7AA6A1",
];

function createConfetti() {
  return Array.from({ length: 48 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color:
      CONFETTI_COLORS[
        Math.floor(Math.random() * CONFETTI_COLORS.length)
      ],
    rotation: `${Math.random() * 360}deg`,
    size: `${6 + Math.random() * 6}px`,
  }));
}

function formatKg(value) {
  const number = Number(value || 0);
  return `${number < 0.1 && number > 0 ? number.toFixed(3) : number.toFixed(2)} kg`;
}

export default function EcoRewardModal({
  open,
  entry,
  pointsEarned = 10,
  totalPoints = 10,
  onClose,
}) {
  const [confetti] = useState(createConfetti);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !entry) return null;

  const savings = Number(
    entry.total?.savings_kg ??
      entry.totalSavings ??
      entry.savings_kg ??
      0
  );

  const hasSavings = savings > 0;

  return (
    <div
      className="eco-reward-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="eco-confetti-layer" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="eco-confetti-piece"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              width: piece.size,
              height: `calc(${piece.size} * 1.5)`,
              "--piece-rotation": piece.rotation,
            }}
          />
        ))}
      </div>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="eco-reward-title"
        className="eco-reward-modal"
      >
        <button
          onClick={onClose}
          aria-label="Close reward popup"
          className="eco-reward-close"
        >
          <X size={20} />
        </button>

        <div className="eco-reward-icon">
          <Leaf size={34} />
          <span className="eco-reward-sparkle">
            <Sparkles size={19} />
          </span>
        </div>

        <p className="eco-reward-eyebrow">YOUR ECO WIN</p>

        <h2 id="eco-reward-title" className="eco-reward-title">
          Scan complete!
        </h2>

        <p className="eco-reward-description">
          Every informed choice is a step towards more sustainable fashion.
        </p>

        <div className="eco-points-highlight">
          <div className="eco-points-icon">
            <Trophy size={25} />
          </div>
          <div>
            <p className="eco-points-number">+{pointsEarned} Eco Points</p>
            <p className="eco-points-caption">
              You've earned points for this scan!
            </p>
          </div>
        </div>

        <div className="eco-reward-stats">
          <div className="eco-reward-stat">
            <div className="eco-stat-icon">
              <Sprout size={21} />
            </div>
            <p className="eco-stat-label">Potential savings</p>
            <p className="eco-stat-value">
              {hasSavings ? formatKg(savings) : "Not available"}
            </p>
            <p className="eco-stat-unit">CO₂e estimate</p>
          </div>

          <div className="eco-reward-stat">
            <div className="eco-stat-icon eco-stat-icon-gold">
              <Trophy size={21} />
            </div>
            <p className="eco-stat-label">Your total</p>
            <p className="eco-stat-value">
              {totalPoints.toLocaleString()}
            </p>
            <p className="eco-stat-unit">Eco Points</p>
          </div>
        </div>

        <p className="eco-reward-note">
          {hasSavings
            ? "Your scan identified potential carbon savings. These are estimates, not reductions already achieved."
            : "Your scan is complete! Check your detailed report for recommendations to reduce your clothing footprint."}
        </p>

        <Link
          to="/report"
          onClick={onClose}
          className="eco-reward-primary"
        >
          View detailed report
          <ArrowRight size={18} />
        </Link>

        <button onClick={onClose} className="eco-reward-secondary">
          Continue exploring
        </button>
      </section>
    </div>
  );
}