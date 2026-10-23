import { GRADE_BANDS, GRADE_STYLES } from "../lib/impact";

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-lg",
  lg: "h-14 w-14 text-3xl",
};

export default function GradeBadge({ grade, size = "md" }) {
  if (!grade) return null;
  return (
    <span
      aria-label={`Carbon grade ${grade}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-black ${SIZES[size]} ${GRADE_STYLES[grade]}`}
    >
      {grade}
    </span>
  );
}

export function GradeScale({ active, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        {GRADE_BANDS.map(({ grade }) => (
          <span
            key={grade}
            className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm font-black transition ${
              grade === active
                ? `${GRADE_STYLES[grade]} scale-110 shadow`
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {grade}
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-gray-400">
        <span>Lower impact</span>
        <span>Higher impact</span>
      </div>
    </div>
  );
}