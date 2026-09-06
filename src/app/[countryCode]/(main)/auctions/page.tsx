import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listAuctions } from "@lib/data/auctions"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import AuctionCard from "@modules/auctions/components/auction-card"

export const metadata: Metadata = {
  title: "Auctions — CeedMart",
  description:
    "Bid on limited stock, open-box and clearance items. Every lot has a condition report and a fixed closing time.",
}

// The auctions index (BRD §8.11, §9.1).
//
// Grouped by state rather than sorted into one list, because "live" and
// "upcoming" call for different actions — one is bid now, the other is come
// back. Mixing them buries whatever is closing soonest.
export default async function AuctionsPage() {
  if (!(await isFeatureEnabled("auction"))) {
    notFound()
  }

  const { auctions } = await listAuctions()

  const live = auctions.filter(
    (a) => a.status === "live" && a.seconds_remaining > 0
  )
  const upcoming = auctions.filter((a) => a.status === "scheduled")
  const past = auctions.filter(
    (a) => !live.includes(a) && !upcoming.includes(a)
  )

  const sections = [
    ["Live now", live],
    ["Opening soon", upcoming],
    ["Recently ended", past.slice(0, 12)],
  ] as const

  return (
    <div className="content-container py-8 small:py-16">
      <header className="flex flex-col items-center text-center gap-3 mb-8 small:mb-12">
        <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-bold text-ceedmart-navy">
          Auctions
        </h1>
        <p className="text-ui-fg-subtle text-base small:text-lg max-w-2xl">
          Limited stock, open-box and clearance items sold to the highest
          bidder. Every lot lists its condition before you bid.
        </p>
      </header>

      {auctions.length === 0 ? (
        <p className="text-ui-fg-subtle">
          No auctions running right now. Check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-10 small:gap-12">
          {sections
            .filter(([, items]) => items.length > 0)
            .map(([title, items]) => (
              <section key={title} className="flex flex-col gap-4">
                <h2 className="text-lg small:text-xl font-semibold text-ui-fg-base">
                  {title}
                </h2>
                <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-6 small:gap-y-8">
                  {items.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  )
}
