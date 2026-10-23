
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Leaf,
  LockKeyhole,
  TicketPercent,
  Wallet,
} from "lucide-react";
import { REWARD_OFFERS } from "../utils/rewards";

export default function OffersPage({
  balance = 0,
  redeemedCoupons = [],
  onRedeem,
}) {
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  function handleRedeem(offer) {
    setMessage("");

    const result = onRedeem(offer.id);

    if (result?.ok) {
      setMessage(`Successfully redeemed ${offer.title}!`);
    } else {
      setMessage(result?.message || "Could not redeem this offer.");
    }
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      setMessage("Could not copy the code. Please copy it manually.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:underline"
      >
        <ArrowLeft size={17} />
        Back to scan
      </Link>

      <section className="overflow-hidden rounded-3xl bg-green-900 p-6 text-white sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-green-200">
              <Leaf size={19} />
              <span className="text-sm font-semibold">EcoScan Rewards</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Good choices. Great rewards.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
              Earn points from estimated potential carbon savings and redeem
              them for sustainable shopping rewards.
            </p>
          </div>

          <div className="min-w-40 rounded-2xl border border-white/20 bg-white/10 p-5">
            <Wallet size={23} />
            <p className="mt-3 text-sm text-green-100">Available balance</p>
            <p className="mt-1 text-3xl font-bold">{balance}</p>
            <p className="text-sm text-green-100">Eco Points</p>
          </div>
        </div>
      </section>

      {message && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900"
        >
          {message}
        </div>
      )}

      <section className="mt-9">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Available rewards
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Redeem each demo offer once. Locked rewards show how many more
            points you need.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REWARD_OFFERS.map((offer) => {
            const redeemed = redeemedCoupons.find(
              (coupon) => coupon.offerId === offer.id
            );
            const unlocked = balance >= offer.pointsCost;

            return (
              <article
                key={offer.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
                    <TicketPercent size={25} />
                  </div>

                  {redeemed ? (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      Redeemed
                    </span>
                  ) : unlocked ? (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      <LockKeyhole size={12} />
                      Locked
                    </span>
                  )}
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-green-800">
                  {offer.brand}
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {offer.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {offer.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">Points required</span>
                  <span className="font-bold text-gray-900">
                    {offer.pointsCost} points
                  </span>
                </div>

                {redeemed ? (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <CheckCircle2 size={17} />
                      Your coupon code
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <code className="break-all font-bold text-green-900">
                        {redeemed.code}
                      </code>

                      <button
                        type="button"
                        onClick={() => copyCode(redeemed.code)}
                        className="rounded-lg border border-green-200 p-2 text-green-800 hover:bg-green-100"
                        aria-label="Copy coupon code"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    {copiedCode === redeemed.code && (
                      <p className="mt-2 text-xs text-green-800">
                        Copied!
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRedeem(offer)}
                    disabled={!unlocked}
                    className="mt-4 w-full rounded-xl bg-green-800 px-4 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    {unlocked
                      ? "Redeem coupon"
                      : `Earn ${offer.pointsCost - balance} more points`}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-7 rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
        Demo notice: these coupon codes are generated by EcoScan for this
        prototype. They are not connected to real brands or checkout systems
        and cannot currently be used for actual purchases.
      </p>
    </main>
  );
}
