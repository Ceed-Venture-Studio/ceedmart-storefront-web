import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getAuctionBids,
  getAuctionLive,
  listAuctions,
} from "@lib/data/auctions"
import { retrieveCustomer } from "@lib/data/customer"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import BidPanel from "@modules/auctions/components/bid-panel"

type Props = {
  params: Promise<{ countryCode: string; reference: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { reference } = await props.params
  const { auctions } = await listAuctions()
  const auction = auctions.find((a) => a.reference === reference)

  return {
    title: auction ? `${auction.title} — CeedMart Auctions` : "Auction",
    description: auction?.description ?? undefined,
  }
}

// A single auction (BRD §8.2).
//
// §8.2 lists what the page must show before anyone bids: condition, images,
// inspection information, start and end time, starting and current price,
// minimum next bid, reserve status, bid count, delivery rules and the
// payment deadline. The condition report is given in full rather than
// summarised — at auction, "used" covers a great deal of ground, and a
// bidder who felt misled about condition is a dispute under §8.10.
export default async function AuctionPage(props: Props) {
  const { reference } = await props.params

  if (!(await isFeatureEnabled("auction"))) {
    notFound()
  }

  const { auctions } = await listAuctions()
  const summary = auctions.find((a) => a.reference === reference)
  if (!summary) {
    notFound()
  }

  const [live, bids, customer] = await Promise.all([
    getAuctionLive(summary.id),
    getAuctionBids(summary.id),
    retrieveCustomer().catch(() => null),
  ])

  if (!live) {
    notFound()
  }

  return (
    <div className="content-container py-8 small:py-12">
      <div className="grid grid-cols-1 small:grid-cols-[minmax(0,1fr)_minmax(0,360px)] medium:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-6 small:gap-10 items-start">
        {/* On a phone the bid panel leads: the current price and the time
            left are why someone opened this page, and putting the images
            and condition report above them buries both. */}
        <div className="flex flex-col gap-5 small:gap-6 order-2 small:order-1">
          {summary.images?.[0] && (
            <div className="rounded-lg overflow-hidden bg-grey-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={summary.images[0]}
                alt={summary.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h1 className="text-xl xsmall:text-2xl small:text-3xl font-bold text-ceedmart-navy">
              {summary.title}
            </h1>
            <span className="txt-small text-ui-fg-muted font-mono">
              Lot {summary.reference}
            </span>

            {summary.description && (
              <p className="text-ui-fg-subtle whitespace-pre-line">
                {summary.description}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 xsmall:grid-cols-3 gap-3 small:gap-4 border-t border-ui-border-base pt-4">
            {[
              ["Condition", summary.condition.replace(/_/g, " ")],
              [
                "Opens",
                new Date(summary.starts_at).toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              ],
              [
                "Closes",
                new Date(summary.ends_at).toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="txt-small text-ui-fg-muted">{label}</dt>
                <dd className="txt-small text-ui-fg-base capitalize">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="txt-small text-ui-fg-muted border-t border-ui-border-base pt-4">
            Times shown in West Africa Time (WAT). Bids are accepted on our
            server clock, not your device&apos;s.
          </p>
        </div>

        <div className="order-1 small:order-2 small:sticky small:top-24">
          <BidPanel
            auctionId={summary.id}
            initial={live}
            initialBids={bids}
            eligibility={null}
            isSignedIn={!!customer}
          />
        </div>
      </div>
    </div>
  )
}
