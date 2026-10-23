
export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="11" fill="#065f46" />

      <g
        stroke="#bef264"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 12V8.5a3 3 0 0 1 3-3H12" />
        <path d="M28 5.5h3.5a3 3 0 0 1 3 3V12" />
        <path d="M34.5 28v3.5a3 3 0 0 1-3 3H28" />
        <path d="M12 34.5H8.5a3 3 0 0 1-3-3V28" />
      </g>

      <g
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 17.2v-1.1c0-.9.7-1.4 1.5-1.7 1.2-.5 1.9-1.4 1.9-2.4a3.4 3.4 0 1 0-6.8 0" />
        <path d="M20 17.2 10.4 24.4a1.6 1.6 0 0 0 1 2.9h17.2a1.6 1.6 0 0 0 1-2.9L20 17.2Z" />
      </g>

      <path
        d="M9 21.5h22"
        stroke="#bef264"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}

export default function Logo({ size = 40, tone = "dark", className = "" }) {
  const base = tone === "light" ? "text-white" : "text-[#173c32]";
  const accent = tone === "light" ? "text-lime-300" : "text-emerald-700";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} className="shrink-0 drop-shadow-sm" />
      <span
        className={`text-xl font-extrabold tracking-tight sm:text-2xl ${base}`}
      >
        Eco<span className={accent}>Scan</span>
      </span>
    </span>
  );
}
