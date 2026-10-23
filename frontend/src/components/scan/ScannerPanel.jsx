import { useRef } from "react";
import {
  Upload,
  Shirt,
  Sparkles,
  RotateCcw,
  Camera,
  ArrowRight,
  ScanLine,
  CheckCircle2,
} from "lucide-react";

const FRAME_CORNERS = [
  "left-4 top-4 border-l-2 border-t-2 rounded-tl-xl",
  "right-4 top-4 border-r-2 border-t-2 rounded-tr-xl",
  "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
  "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
];

const FORMAT_CHIPS = ["JPG", "PNG", "WebP", "MAX 5 MB"];

export default function ScannerPanel({
  previewUrl,
  fileName,
  loading,
  error,
  onSelectFile,
  onOpenCamera,
  onAnalyze,
  onReset,
}) {
  const fileInputRef = useRef(null);

  return (
    <section className="overflow-hidden rounded-[26px] bg-[#102e25] p-4 text-white shadow-lg sm:p-5 lg:sticky lg:top-24">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lime-300">
            <ScanLine size={21} />
          </div>
          <div>
            <h3 className="font-semibold">EcoScan Studio</h3>
            <p className="mt-0.5 text-xs text-emerald-100/65">
              {loading ? "Analysis in progress" : "Your visual scanner"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-100/80">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              loading ? "animate-pulse bg-lime-300" : "bg-emerald-400"
            }`}
          />
          {loading ? "Scanning" : "Ready"}
        </span>
      </div>

      {/* Viewfinder */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#173b30]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(217,249,157,0.2) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {FRAME_CORNERS.map((cls) => (
          <span
            key={cls}
            aria-hidden="true"
            className={`pointer-events-none absolute z-20 h-7 w-7 border-lime-300 ${cls}`}
          />
        ))}

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Selected clothing"
              className="relative z-0 h-full w-full object-contain p-5"
            />

            <div className="absolute inset-x-5 bottom-5 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#102e25]/90 px-3 py-2.5 shadow-lg backdrop-blur-md">
              <CheckCircle2 size={16} className="shrink-0 text-lime-300" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">
                Image ready for analysis
              </span>
            </div>

            {loading && (
              <span className="ecoscan-sweep absolute left-4 right-4 z-10 h-0.5 bg-lime-300 shadow-[0_0_18px_4px_rgba(190,242,100,0.65)]" />
            )}
          </>
        ) : (
          <div className="relative z-[2] flex h-full flex-col items-center justify-center px-7 text-center">
            <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-lime-200/20 bg-lime-300/10 text-lime-300">
              <Shirt size={37} strokeWidth={1.5} />
            </div>

            <p className="text-xl font-semibold tracking-tight">
              Frame your clothing
            </p>
            <p className="mt-2 max-w-[240px] text-sm leading-6 text-emerald-100/70">
              Upload a photo or use your camera to get started.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {FORMAT_CHIPS.map((format) => (
                <span
                  key={format}
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-emerald-100/80"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <p className="mt-3 truncate px-1 text-xs text-emerald-100/75">
          {fileName}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 space-y-3">
        {!previewUrl ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-lime-300 px-3 py-3.5 text-sm font-bold text-[#163326] transition hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 active:scale-[0.98]"
            >
              <Upload size={17} />
              Upload photo
            </button>

            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 active:scale-[0.98]"
            >
              <Camera size={17} />
              Use camera
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-4 text-sm font-bold text-[#163326] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <Sparkles size={18} />
              {loading ? "Analysing with Gemini..." : "Analyse my clothing"}
              {!loading && <ArrowRight size={17} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = "";
                onReset();
              }}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-emerald-100/80 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={15} />
              Choose a different image
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          onSelectFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-300/20 bg-red-500/10 p-3.5 text-sm leading-5 text-red-100"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 rounded-xl border border-lime-200/10 bg-white/[0.04] p-3.5">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-lime-200">
            <Sparkles size={15} className="animate-pulse" />
            Understanding your outfit
          </div>
          <p className="text-xs leading-5 text-emerald-100/65">
            Identifying items and estimating environmental footprints. This may
            take a moment.
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[11px] text-emerald-100/55">
        <CheckCircle2 size={14} />
        <span>Ready to make more informed choices</span>
      </div>
    </section>
  );
}
