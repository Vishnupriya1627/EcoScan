
import { useState } from "react";
import {
  loadScanHistory,
  createHistoryEntry,
  saveScanHistory,
  removeScanFromStorage,
  clearScanStorage,
} from "../utils/scanHistory";

export default function useScanHistory() {
  const [history, setHistory] = useState(loadScanHistory);

  function addScan(data) {
    const entry = createHistoryEntry(data);

    setHistory((current) => {
      const updated = [entry, ...current];
      saveScanHistory(updated);
      return updated;
    });

    return entry;
  }

  function deleteScan(scanId) {
    setHistory((current) => {
      const updated = current.filter(
        (entry) => entry.scanId !== scanId
      );

      removeScanFromStorage(updated);
      return updated;
    });
  }

  function clearHistory() {
    clearScanStorage();
    setHistory([]);
  }

  return {
    history,
    addScan,
    deleteScan,
    clearHistory,
  };
}
