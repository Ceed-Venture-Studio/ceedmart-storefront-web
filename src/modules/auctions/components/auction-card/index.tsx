import { clx } from "@medusajs/ui"

import type { AuctionListItem } from "@lib/data/auctions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// An auction on the listing page (BRD §8.11, §9.1).
//
// "Customers can distinguish upcoming, live, ended and cancelled auctions",
// and §9.1 wants product cards to show fulfilment type, condition, current
// price and the primary action. State is carried by a labelled pill rather
// than colour alone — §12.3 forbids time-sensitive content relying on colour.

const naira = (kobo: number | null) =>
  kobo == null ? "—" : `₦${(kobo / 100).toLocaleString()}`

const CONDITION_LABEL: Record<string, string> = {
  new: "New",
  open_box: "Open box",
  refurbished: "Refurbished",
  used: "Used",
  for_parts: "For parts",
}

const STATE: Record<string, { label: string; className: string }> = {
  scheduled: { label: "Upcoming", className: "bg-grey-20 text-grey-80" },
  live: { label: "Live now", className: "bg-ceedmart-navy text-white" },
  ended: { label: "Ended", className: "bg-grey-20 text-grey-60" },
  awaiting_winner_payment: { label: "Sold", className: "bg-grey-20 text-grey-60" },
  reserve_not_met: { label: "Unsold", className: "bg-grey-20 text-grey-60" },
  paid: { label: "Sold", className: "bg-grey-20 text-grey-60" },
  fulfilment: { label: "Sold", className: "bg-grey-20 text-grey-60" },
  completed: { label: "Sold", className: "bg-grey-20 text-grey-60" },
  cancelled: { label: "Cancelled", className: "bg-grey-20 text-grey-60" },
}

const remaining = (seconds: number): string => {
  if (seconds <= 0) return "Ended"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h left`
  if (h > 0) return `${h}h ${m}m left`
  return `${m}m left`
}

const AuctionCard = ({ auction }: { auction: AuctionListItem }) => {
  const state = STATE[auction.status] ?? {
    label: auction.status,
    className: "bg-grey-20 text-grey-60",
  }
  const isLive = auction.status === "live" && auction.seconds_remaining > 0

  return (
    <LocalizedClientLink
      href={`/auctions/${auction.reference}`}
      className="flex flex-col border border-grey-20 rounded-lg overflow-hidden hover:border-ceedmart-navy/40 transition-colors"
    >
      <div className="aspect-square bg-grey-5 relative">
        {auction.images?.[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auction.images[0]}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
        )}
        <span
          className={clx(
            "absolute top-2 left-2 rounded-full text-[11px] font-medium px-2 py-0.5",
            state.className
          )}
        >
          {state.label}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3 flex-1">
        <span className="txt-small text-ui-fg-muted">
          {CONDITION_LABEL[auction.condition] ?? auction.condition}
        </span>

        <h3 className="text-sm text-ui-fg-base leading-snug line-clamp-2">
          {auction.title}
        </h3>

        <div className="mt-auto flex flex-col gap-0.5">
          <span className="txt-small text-ui-fg-muted">
            {auction.bid_count > 0 ? "Current bid" : "Starting at"}
          </span>
          <span className="text-lg font-bold text-ceedmart-navy tabular-nums">
            {naira(auction.current_price ?? auction.starting_price)}
          </span>
          <span
            className={clx(
              "txt-small",
              isLive && auction.seconds_remaining <= 3600
                ? "text-ui-fg-error font-medium"
                : "text-ui-fg-subtle"
            )}
          >
            {isLive
              ? remaining(auction.seconds_remaining)
              : auction.status === "scheduled"
                ? `Opens ${new Date(auction.starts_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}`
                : `${auction.bid_count} bid${auction.bid_count === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default AuctionCard
