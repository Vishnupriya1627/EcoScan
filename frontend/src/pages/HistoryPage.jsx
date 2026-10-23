
import { Link } from "react-router-dom";
import { ArrowRight, History, Trash2 } from "lucide-react";
import HistoryStats from "../components/history/HistoryStats";
import HistoryCard from "../components/history/HistoryCard";

export default function HistoryPage({
  history,
  onView,
  onDelete,
  onClear,
}) {
  function handleClear() {
    if (
      window.confirm(
        "Delete all scan history? This cannot be undone."
      )
    ) {
      onClear();
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e6f0df] px-3 py-1.5 text-sm font-medium text-[#315b37]">
            <History size={16} />
            Your EcoScan activity
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Scan History
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#728173] sm:text-base">
            Review previous scans and track the estimated carbon footprint
            across your scans.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:self-auto"
          >
            <Trash2 size={16} />
            Clear history
          </button>
        )}
      </div>

      <HistoryStats history={history} />

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">Previous scans</h2>
        <span className="text-sm text-[#728173]">
          {history.length} {history.length === 1 ? "scan" : "scans"}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#cbd9c5] bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f0df] text-[#315b37]">
            <History size={30} />
          </div>

          <h3 className="text-lg font-bold">No scans yet</h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#728173]">
            Complete a clothing scan and it will appear here automatically.
          </p>

          <Link
            to="/scan"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#315b37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#25472b]"
          >
            Start a scan
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <HistoryCard
              key={entry.scanId}
              entry={entry}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-[#849184]">
        The combined footprint counts every saved scan, including repeat
        scans of the same garment. Potential savings are estimates, not
        guaranteed reductions.
      </p>
    </main>
  );
}
