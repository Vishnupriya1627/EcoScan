import { useState } from "react";
import { ScanLine } from "lucide-react";
import { scanClothing } from "../../services/api";
import useImagePicker from "../../hooks/useImagePicker";
import useCamera from "../../hooks/useCamera";
import ScannerPanel from "./ScannerPanel";
import ResultsPanel from "./ResultsPanel";
import CameraModal from "./CameraModal";

/** The scanner + results area (section id: "scanner"). */
export default function ScannerSection({ result, onResult, earned = 0 }) {
  const [loading, setLoading] = useState(false);

  const picker = useImagePicker();
  const camera = useCamera(picker.selectImage);

  async function handleAnalyze() {
    if (!picker.selectedFile) {
      picker.setError(
        "Please upload an image or capture one using your camera.",
      );
      return;
    }

    setLoading(true);
    picker.setError("");

    try {
      const data = await scanClothing(picker.selectedFile);

      if (!data) {
        throw new Error("No analysis result was returned. Please try again.");
      }

      onResult(data);
    } catch (err) {
      picker.setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.message ||
          "Image analysis failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    picker.reset();
    onResult(null);
  }

  return (
    <section
      id="scanner"
      className="flex min-h-[calc(100svh-72px)] scroll-mt-[72px] items-center border-t border-emerald-950/[0.06] bg-[#fbfcf8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              <ScanLine size={15} />
              The scanner
            </span>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              Let's scan your wardrobe.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Upload a clothing photo or use your camera. Your analysis will
              appear alongside the scanner.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            JPG, PNG or WebP · Max 5 MB
          </span>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-7">
          <ScannerPanel
            previewUrl={picker.previewUrl}
            fileName={picker.selectedFile?.name}
            loading={loading}
            error={picker.error}
            onSelectFile={picker.selectImage}
            onOpenCamera={camera.open}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />

          <div aria-live="polite" className="min-w-0">
            <ResultsPanel result={result} earned={earned} />
          </div>
        </div>
      </div>

      {camera.isOpen && (
        <CameraModal
          videoRef={camera.videoRef}
          error={camera.error}
          onClose={camera.close}
          onSwitch={camera.toggleFacing}
          onCapture={camera.capture}
        />
      )}
    </section>
  );
}
