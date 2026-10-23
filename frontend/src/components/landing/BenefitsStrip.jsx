import { BENEFITS } from "../../constants/content";

export default function BenefitsStrip() {
  return (
    <section className="border-y border-emerald-950/[0.06] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-9 sm:px-6 sm:py-11 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center px-3 text-center"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Icon size={23} strokeWidth={1.8} />
            </div>
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">
              {title}
            </h2>
            <p className="mt-1.5 max-w-[190px] text-xs leading-5 text-gray-500 sm:text-sm">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
