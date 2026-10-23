import { useEffect } from "react";
import { Camera, SwitchCamera, X } from "lucide-react";

const CORNERS = [
  "-left-px -top-px rounded-tl-lg border-l-2 border-t-2",
  "-right-px -top-px rounded-tr-lg border-r-2 border-t-2",
  "-bottom-px -left-px rounded-bl-lg border-b-2 border-l-2",
  "-bottom-px -right-px rounded-br-lg border-b-2 border-r-2",
];

export default function CameraModal({
  videoRef,
  error,
  onClose,
  onSwitch,
  onCapture,
}) {
  // Close on Escape
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#07130f]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-title"
    >
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <Camera size={20} />
            </div>
            <div>
              <h2
                id="camera-title"
                className="font-bold tracking-tight text-gray-950"
              >
                Capture your clothing
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Position your outfit inside the frame
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close camera"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-[#101d18] p-3 sm:p-5">
          {error ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-red-50 px-6 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Camera size={22} />
              </div>
              <p className="font-semibold text-red-900">Camera unavailable</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-[60vh] min-h-64 w-full object-contain"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 rounded-xl border border-white/30"
              >
                {CORNERS.map((cls) => (
                  <span
                    key={cls}
                    className={`absolute h-6 w-6 border-lime-300 ${cls}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-3 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onSwitch}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <SwitchCamera size={17} />
            Switch camera
          </button>

          <button
            type="button"
            onClick={onCapture}
            disabled={Boolean(error)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera size={17} />
            Take picture
          </button>
        </div>
      </div>
    </div>
  );
}
