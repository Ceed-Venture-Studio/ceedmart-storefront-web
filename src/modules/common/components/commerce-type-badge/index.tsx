import { clx } from "@medusajs/ui"

import type { CommerceType, ListingPolicy } from "@lib/data/listing-policy"

// Commerce-type badge (BRD §5.1).
//
// "Badges and plain-language labels must show the type on product cards,
// search results, product pages, cart/order surfaces, receipts, and account
// history." A shopper has to know an item is a US pre-order, a custom build
// or an auction lot BEFORE they commit — so this renders wherever a listing
// is shown, not only on the detail page.
//
// Standard stock renders nothing: badging the ordinary case would make the
// exceptional cases harder to spot, which is the opposite of the point.

type Props = {
  policy?: ListingPolicy | null
  size?: "sm" | "md"
  className?: string
}

// Each type gets its own colour so the four are distinguishable at a glance,
// and its own wording so the badge reads as a sentence fragment rather than
// a category label. Colours are drawn from the Ceedmart palette in
// tailwind.config.js rather than invented here.
const STYLES: Record<
  Exclude<CommerceType, "standard">,
  { label: string; className: string }
> = {
  preorder: {
    label: "Ships from the US",
    className: "bg-ceedmart-navy text-white",
  },
  custom_build: {
    label: "Built to order",
    className: "bg-ceedmart-blue text-white",
  },
  auction: {
    label: "Auction",
    className: "bg-ceedmart-gold text-ceedmart-navy",
  },
}

const CommerceTypeBadge = ({ policy, size = "sm", className }: Props) => {
  if (!policy) return null

  if (!policy.is_active) {
    // An inactive listing is still whatever kind of listing it is.
    //
    // This used to render a bare "Unavailable", which answered the wrong
    // question: a paused US pre-order and a sold-out shelf item looked
    // identical, so the one fact a shopper most needs — that this is bought
    // in from abroad and takes weeks — disappeared exactly when the listing
    // was in the state most likely to prompt "when can I get it?".
    //
    // Standard stock keeps the plain wording; there is no type to preserve.
    const kind =
      policy.commerce_type === "standard"
        ? null
        : policy.label || STYLES[policy.commerce_type]?.label

    return (
      <span
        className={clx(
          "inline-flex items-center rounded-full font-medium bg-grey-20 text-grey-60",
          size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
          className
        )}
      >
        {kind ? `${kind} — currently unavailable` : "Unavailable"}
      </span>
    )
  }

  if (policy.commerce_type === "standard") return null

  const style = STYLES[policy.commerce_type]
  if (!style) return null

  return (
    <span
      className={clx(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        style.className,
        className
      )}
    >
      {policy.label || style.label}
    </span>
  )
}

export default CommerceTypeBadge
