import { Gift, LockKeyhole, Sparkles } from "lucide-react";

export default function OffersList({ offers, points }) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Rewards
          </p>
          <h2 className="mt-1 text-xl font-bold">Good choices, good perks.</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your available rewards, based on your points.
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
          <Gift size={23} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#f5f8ef] p-4">
        <p className="text-sm text-gray-600">Your rewards balance</p>
        <p className="mt-1 text-3xl font-bold text-green-900">
          {points} <span className="text-sm font-medium">points</span>
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {offers.map((offer) => {
          const canRedeem = points >= offer.pointsRequired;

          return (
            <div
              key={offer.id}
              className="rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  {canRedeem ? <Sparkles size={20} /> : <LockKeyhole size={20} />}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{offer.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    {offer.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-green-800">
                    {offer.pointsRequired} points required
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!canRedeem}
                onClick={() =>
                  window.alert(
                    "Demo only: connect a redemption API to claim this reward."
                  )
                }
                className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  canRedeem
                    ? "bg-green-800 text-white hover:bg-green-900"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
              >
                {canRedeem ? "Redeem reward" : `Earn ${offer.pointsRequired - points} more points`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-400">
        Rewards are demo offers. Redemption and point persistence are not enabled.
      </p>
    </section>
  );
}