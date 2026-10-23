import { ArrowRight, Camera, Sprout } from "lucide-react";
import { STEPS } from "../../constants/content";
import { scrollToSection } from "../../utils/scroll";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="flex min-h-[calc(100svh-72px)] scroll-mt-[72px] items-center bg-[#f1f6ec] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
            <Sprout size={15} />
            HOW IT WORKS
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#173c32] sm:text-4xl">
            From your wardrobe
            <br className="hidden sm:block" /> to real impact.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
            Four simple steps to understand the environmental impact of the
            clothes you wear.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STEPS.map(({ icon: Icon, number, title, description }, index) => (
            <div key={number} className="relative text-center">
              <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-white bg-white text-emerald-800 shadow-sm">
                <Icon size={31} strokeWidth={1.6} />
              </div>

              <span className="mx-auto mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white">
                {number}
              </span>

              <h3 className="mt-3 text-base font-bold text-gray-900">
                {title}
              </h3>

              <p className="mx-auto mt-2 max-w-[230px] text-sm leading-6 text-gray-500">
                {description}
              </p>

              {index < STEPS.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  size={20}
                  className="absolute right-[-14px] top-7 hidden text-emerald-500/70 lg:block"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => scrollToSection("scanner")}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >
            <Camera size={18} />
            Scan my clothing
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
