
import { useCallback, useRef, useState } from "react";
import {
  calculateEcoPoints,
  loadRewards,
  saveRewards,
  REWARD_OFFERS,
} from "../utils/rewards";

export default function useEcoRewards() {
  const rewardsRef = useRef(null);

  if (rewardsRef.current === null) {
    rewardsRef.current = loadRewards();
  }

  const [rewards, setRewards] = useState(() => rewardsRef.current);

  const commit = useCallback((updated) => {
    rewardsRef.current = updated;
    setRewards(updated);
    return saveRewards(updated);
  }, []);

  const awardForScan = useCallback(
    (entry) => {
      const scanId = entry?.scanId;

      if (!scanId) return 0;

      const current = rewardsRef.current;

      if (current.processedScanIds.includes(scanId)) return 0;

      const points = calculateEcoPoints(entry);

      commit({
        ...current,
        balance: current.balance + points,
        processedScanIds: [...current.processedScanIds, scanId],
      });

      return points;
    },
    [commit]
  );

  const redeemOffer = useCallback(
    (offerId) => {
      const current = rewardsRef.current;
      const offer = REWARD_OFFERS.find((item) => item.id === offerId);

      if (!offer) {
        return { ok: false, message: "Offer not found." };
      }

      if (
        current.redeemedCoupons.some((coupon) => coupon.offerId === offerId)
      ) {
        return {
          ok: false,
          message: "You have already redeemed this coupon.",
        };
      }

      if (current.balance < offer.pointsCost) {
        return {
          ok: false,
          message: `You need ${offer.pointsCost - current.balance} more points.`,
        };
      }

      const code = `${offer.codePrefix}-${crypto.randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;

      const coupon = {
        id: `${offer.id}-${Date.now()}`,
        offerId: offer.id,
        brand: offer.brand,
        title: offer.title,
        code,
        pointsSpent: offer.pointsCost,
        redeemedAt: new Date().toISOString(),
      };

      const updated = {
        ...current,
        balance: current.balance - offer.pointsCost,
        redeemedCoupons: [...current.redeemedCoupons, coupon],
      };

      if (!commit(updated)) {
        return {
          ok: false,
          message: "Could not save your reward. Please try again.",
        };
      }

      return {
        ok: true,
        message: "Coupon redeemed successfully!",
        coupon,
      };
    },
    [commit]
  );

  return {
    balance: rewards.balance,
    redeemedCoupons: rewards.redeemedCoupons,
    awardForScan,
    redeemOffer,
  };
}
