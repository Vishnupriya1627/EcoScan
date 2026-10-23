import {
  Leaf,
  Shirt,
  Sparkles,
  Camera,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { scrollToSection } from "../../utils/scroll";

const TRUST_POINTS = [
  "Simple to use",
  "AI-powered analysis",
  "Earn Eco Points",
];

function FloatingCard({
  className,
  iconBg,
  icon: Icon,
  iconSize = 20,
  children,
}) {
  return (
    <div
      className={`ecoscan-float absolute z-20 flex items-center rounded-2xl border border-white bg-white/95 shadow-[0_12px_35px_-12px_rgba(22,60,40,0.2)] ${className}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon size={iconSize} />
      </span>
      <div>{children}</div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[510px] py-5 sm:py-8 lg:py-5">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e4f0d7] sm:h-[400px] sm:w-[400px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[255px] w-[255px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/70 sm:h-[335px] sm:w-[335px]"
      />

      <div className="absolute right-6 top-1 z-0 rotate-[-35deg] text-emerald-700/80 sm:right-10">
        <Leaf size={66} strokeWidth={1.1} />
      </div>
      <div className="absolute bottom-8 left-0 z-0 rotate-[35deg] text-emerald-600/70">
        <Leaf size={45} strokeWidth={1.2} />
      </div>

      {/* Main clothing scan card */}
      <div className="relative z-10 mx-auto w-[72%] max-w-[320px] rounded-[30px] border-[8px] border-white bg-[#f2f0e6] p-3 shadow-[0_28px_70px_-25px_rgba(20,70,45,0.3)] sm:border-[10px] sm:p-4">
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[19px] bg-gradient-to-br from-[#f8f7ef] to-[#e5e9d8]">
          <span className="absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-[3px] border-t-[3px] border-emerald-700" />
          <span className="absolute right-3 top-3 h-7 w-7 rounded-tr-lg border-r-[3px] border-t-[3px] border-emerald-700" />
          <span className="absolute bottom-3 left-3 h-7 w-7 rounded-bl-lg border-b-[3px] border-l-[3px] border-emerald-700" />
          <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br-lg border-b-[3px] border-r-[3px] border-emerald-700" />

          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-x-6 top-1/2 h-32 -translate-y-1/2 rounded-full bg-lime-200/30 blur-2xl" />

            <Shirt
              size={160}
              strokeWidth={1.15}
              className="relative z-[1] h-[68%] w-[68%] text-emerald-800 drop-shadow-[0_14px_10px_rgba(20,60,40,0.12)] sm:h-[72%] sm:w-[72%]"
            />

            <div className="absolute bottom-[28%] left-0 right-0 z-[2] h-0.5 bg-lime-300 shadow-[0_0_18px_5px_rgba(163,230,53,0.65)]" />
          </div>
        </div>

        <div className="px-2 pb-1 pt-4 text-center">
          <p className="text-sm font-bold text-emerald-950">
            Your wardrobe, decoded.
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Every item tells a story.
          </p>
        </div>
      </div>

      <FloatingCard
        icon={Leaf}
        iconBg="bg-emerald-50 text-emerald-700"
        className="left-0 top-10 gap-3 px-3.5 py-3 sm:-left-1 sm:top-12 sm:px-4"
      >
        <p className="text-lg font-extrabold leading-5 text-emerald-800">
          CO₂e
        </p>
        <p className="mt-1 text-[10px] text-gray-500">Footprint insights</p>
      </FloatingCard>

      <FloatingCard
        icon={BarChart3}
        iconBg="bg-lime-100 text-emerald-800"
        className="right-0 top-[42%] gap-2.5 px-3 py-3 sm:-right-2 sm:px-4"
      >
        <p className="text-xs font-bold text-gray-900">Item by item</p>
        <p className="mt-1 text-[10px] text-gray-500">Clear breakdown</p>
      </FloatingCard>

      <FloatingCard
        icon={Sparkles}
        iconSize={19}
        iconBg="bg-lime-100 text-emerald-800"
        className="bottom-9 left-2 gap-2.5 px-3 py-3 sm:bottom-10 sm:left-0 sm:px-4"
      >
        <p className="text-xs font-bold text-gray-900">Eco Points</p>
        <p className="mt-1 text-[10px] text-gray-500">
          Better habits, rewarded
        </p>
      </FloatingCard>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100svh-72px)] scroll-mt-[72px] items-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-lime-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-2 shadow-sm">
            <Leaf size={15} className="text-emerald-700" />
            <span className="text-xs font-semibold tracking-wide text-emerald-800 sm:text-sm">
              Better choices. A greener tomorrow.
            </span>
          </div>

          <h1 className="max-w-2xl text-[2.7rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#153b32] sm:text-6xl lg:text-[4.15rem]">
            Scan your clothes.
            <br />
            Know their{" "}
            <span className="relative inline-block text-emerald-700">
              impact.
              <svg
                aria-hidden="true"
                viewBox="0 0 180 12"
                className="absolute -bottom-2 left-0 w-full text-lime-500"
                fill="none"
              >
                <path
                  d="M3 8C47 2 117 2 176 5"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Every outfit has a story. Discover the carbon footprint of your
            wardrobe, understand the impact of each item, and make more
            sustainable choices.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => scrollToSection("scanner")}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-7 py-4 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(4,120,87,0.6)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 active:translate-y-0"
            >
              <Camera size={20} />
              Scan my clothing
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
            >
              See how it works
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
            {TRUST_POINTS.map((point) => (
              <span key={point} className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-700" />
                {point}
              </span>
            ))}
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
