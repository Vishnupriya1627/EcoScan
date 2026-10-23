
const HISTORY_KEY = "ecoscan_scan_history_v1";

export function normalizeResponse(data) {
  const footprint = Number(
    data.total?.footprint_kg ?? data.totalCarbon ?? 0
  );

  const items = (data.items || []).map((item) => ({
    ...item,
    footprint_kg: Number(
      item.footprint_kg ?? item.carbon ?? item.unit_kg ?? 0
    ),
    carbon: Number(
      item.footprint_kg ?? item.carbon ?? item.unit_kg ?? 0
    ),
  }));

  return {
    ...data,
    items,
    total: {
      ...(data.total || {}),
      footprint_kg: footprint,
      carbon_calories:
        data.total?.carbon_calories ?? Math.round(footprint * 1000),
    },
    totalCarbon: footprint,
    totalSavings: Number(
      data.total?.savings_kg ?? data.totalSavings ?? 0
    ),
  };
}

export function loadScanHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Could not save scan history:", error);
    return false;
  }
}

export function createHistoryEntry(data) {
  return {
    ...normalizeResponse(data),
    scanId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    scannedAt: new Date().toISOString(),
  };
}

export function saveScanHistory(history) {
  return persistHistory(history);
}

export function removeScanFromStorage(history) {
  return persistHistory(history);
}

export function clearScanStorage() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Could not clear scan history:", error);
  }
}
