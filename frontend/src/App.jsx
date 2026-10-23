import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import ScanPage from "./pages/ScanPage";
import ReportPage from "./pages/ReportPage";
import HistoryPage from "./pages/HistoryPage";
import OffersPage from "./pages/OffersPage";

import EcoRewardModal from "./components/rewards/EcoRewardModal";
import useScanHistory from "./hooks/useScanHistory";
import useEcoRewards from "./hooks/useEcoRewards";
import { HOME_PATH } from "./constants/navigation";

function EcoScanApp() {
  const navigate = useNavigate();

  const { history, addScan, deleteScan, clearHistory } = useScanHistory();

  const {
    balance: earned,
    redeemedCoupons,
    awardForScan,
    redeemOffer,
  } = useEcoRewards();

  const [result, setResult] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardEntry, setRewardEntry] = useState(null);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  function handleResult(data) {
    if (!data) {
      setResult(null);
      return;
    }

    const entry = addScan(data);

    setResult(entry);
    setRewardEntry(entry);

    const pointsAwarded = awardForScan(entry);
    setLastPointsEarned(pointsAwarded);

    setShowReward(true);
  }

  function closeReward() {
    setShowReward(false);
  }

  function openHistoricalReport(entry) {
    setResult(entry);
    navigate("/report");
  }

  return (
    <Layout earned={earned} hasReport={Boolean(result)}>
      <Routes>
        <Route path="/" element={<Navigate to={HOME_PATH} replace />} />

        <Route
          path={HOME_PATH}
          element={
            <ScanPage
              result={result}
              onResult={handleResult}
              earned={earned}
            />
          }
        />

        <Route
          path="/report"
          element={
            result ? (
              <ReportPage result={result} />
            ) : (
              <Navigate to={HOME_PATH} replace />
            )
          }
        />

        <Route
          path="/history"
          element={
            <HistoryPage
              history={history}
              onView={openHistoricalReport}
              onDelete={deleteScan}
              onClear={clearHistory}
            />
          }
        />

        <Route
          path="/offers"
          element={
            <OffersPage
              balance={earned}
              redeemedCoupons={redeemedCoupons}
              onRedeem={redeemOffer}
            />
          }
        />

        <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
      </Routes>

      <EcoRewardModal
        open={showReward}
        entry={rewardEntry}
        pointsEarned={lastPointsEarned}
        totalPoints={earned}
        onClose={closeReward}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <EcoScanApp />
    </BrowserRouter>
  );
}
