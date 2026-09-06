import { clx } from "@medusajs/ui"

import type { PreorderListItem } from "@lib/data/preorder"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

// A pre-order listing on the /preorder index (BRD §6.3, §9.1).
//
// §9.1 wants product cards to carry fulfilment type, condition, price and
// timeline. The delivery date leads rather than the price: someone browsing
// imported goods is deciding whether they can wait, and the number that
// answers that should not be the one they have to hunt for.

const CONDITION_LABEL: Record<string, string> = {
  new: "Brand new",
  open_box: "Open box",
  refurbished: "Refurbished",
  used: "Used",
}

const naira = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`

const PreorderCard = ({ offer }: { offer: PreorderListItem }) => {
  const eta = new Date(offer.estimated_delivery_date).toLocaleDateString(
    "en-NG",
    { day: "numeric", month: "short" }
  )

  return (
    <LocalizedClientLink
      href={offer.handle ? `/products/${offer.handle}` : "#"}
      className={clx(
        "group flex flex-col border border-grey-20 rounded-lg overflow-hidden transition-colors",
        offer.available
          ? "hover:border-ceedmart-navy/40"
          : "opacity-70 pointer-events-none"
      )}
    >
      <div className="relative bg-grey-5">
        <Thumbnail thumbnail={offer.thumbnail} images={[]} size="square" />
        <span className="absolute top-2 left-2 rounded-full bg-ceedmart-navy text-white text-[11px] font-medium px-2 py-0.5">
          Ships from the US
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3 flex-1">
        <span className="txt-small text-ui-fg-muted">
          {CONDITION_LABEL[offer.condition] ?? offer.condition}
        </span>

        <h3 className="text-sm text-ui-fg-base leading-snug line-clamp-2">
          {offer.title}
          {offer.variant_title && (
            <span className="text-ui-fg-muted"> · {offer.variant_title}</span>
          )}
        </h3>

        <div className="mt-auto flex flex-col gap-0.5">
          {offer.available ? (
            <span className="txt-small text-ceedmart-navy font-medium">
              Arrives around {eta} · {offer.estimate_days} days
            </span>
          ) : (
            <span className="txt-small text-ui-fg-error">
              {offer.unavailable_reason}
            </span>
          )}

          <span className="text-lg font-bold text-ui-fg-base tabular-nums">
            {naira(offer.price)}
          </span>

          {offer.includes.length > 0 && (
            <span className="txt-small text-ui-fg-muted">
              {offer.excludes.length === 0
                ? "Duty & delivery included"
                : `Includes ${offer.includes.join(", ").toLowerCase()}`}
            </span>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default PreorderCard
