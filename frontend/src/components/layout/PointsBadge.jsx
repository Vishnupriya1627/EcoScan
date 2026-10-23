import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

/**
 * Eco Points badge for the navbar. Links to the rewards page and, whenever the
 * balance goes up (e.g. after a scan), pops and shows a floating "+N" chip.
 */
export default function PointsBadge({ points = 0, onNavigate }) {
  const total = Number(points) || 0;
  const previous = useRef(total);
  const [gain, setGain] = useState(0);

  useEffect(() => {
    const diff = total - previous.current;
    previous.current = total;

    if (diff <= 0) {
      setGain(0);
      return undefined;
    }

    setGain(diff);
    const timer = setTimeout(() => setGain(0), 2600);

    return () => clearTimeout(timer);
  }, [total]);

  return (
    <Link
      to="/offers"
      onClick={onNavigate}
      aria-label={`${total} Eco Points. Open rewards`}
      className={`relative inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
        gain > 0 ? "ecoscan-pop" : ""
      }`}
    >
      <Trophy size={15} className="text-amber-600" />
      <span>{total.toLocaleString()}</span>
      <span className="hidden sm:inline">Eco Points</span>

      {gain > 0 && (
        <span
          aria-hidden="true"
          className="ecoscan-gain absolute -top-3 right-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-md"
        >
          +{gain}
        </span>
      )}
    </Link>
  );
}
