import { Text, clx } from "@medusajs/ui"

import type { PreorderOffer } from "@lib/data/preorder"

// The pre-order disclosure block on a product page (BRD §6.3, §6.4).
//
// §6.3 requires the page show specifications, source, condition, landed
// price basis, the delivery explanation, cancellation terms, warranty and
// return eligibility BEFORE the customer commits. §6.4 requires it state
// clearly whether duty, clearing and local delivery are included.
//
// The estimate is broken into its three legs rather than asserted as a
// single number. "About 14 days" invites suspicion; "3 days to source, 7 in
// transit, 4 through customs" reads as a plan someone actually has.

type Props = {
  offer: PreorderOffer
  /** The state used to compute the estimate, for the "delivered to" line. */
  state?: string | null
}

const CONDITION_LABEL: Record<string, string> = {
  new: "Brand new",
  open_box: "Open box",
  refurbished: "Refurbished",
  used: "Used",
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

const PreorderPanel = ({ offer, state }: Props) => {
  const legs = offer.estimate_breakdown

  return (
    <div className="flex flex-col gap-4 border border-ceedmart-navy/20 rounded-lg p-4 bg-ceedmart-navy/[0.03]">
      <div className="flex flex-col gap-1">
        <span className="inline-flex self-start items-center rounded-full bg-ceedmart-navy text-white text-[11px] font-medium px-2 py-0.5">
          Ships from the US
        </span>
        <Text className="txt-medium-plus text-ui-fg-base mt-1">
          {offer.available
            ? `Estimated delivery ${formatDate(offer.estimated_delivery_date)}`
            : "Currently unavailable"}
        </Text>
        {offer.available && (
          <Text className="txt-small text-ui-fg-subtle">
            About {offer.estimate_days} days
            {state ? ` to ${state}` : ""}, from the day we confirm your order.
          </Text>
        )}
      </div>

      {!offer.available && offer.unavailable_reason && (
        <Text className="txt-small text-ui-fg-error">
          {offer.unavailable_reason}
        </Text>
      )}

      {offer.available && (
        <div className="flex flex-col gap-1.5">
          <span className="txt-small-plus text-ui-fg-base">
            How the timeline breaks down
          </span>
          <ul className="flex flex-col gap-1">
            {[
              [legs.procurement_days, "to buy it from our US supplier"],
              [legs.transit_days, "in transit to Nigeria"],
              [legs.customs_days, "to clear customs and reach you"],
            ].map(([days, label]) => (
              <li
                key={label as string}
                className="flex items-baseline gap-2 txt-small text-ui-fg-subtle"
              >
                <span className="font-semibold text-ui-fg-base tabular-nums min-w-[3.5rem]">
                  {days} day{days === 1 ? "" : "s"}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="txt-small-plus text-ui-fg-base">
          {offer.price_is_final
            ? "Your price is locked — nothing more to pay"
            : "Price may be adjusted before we buy"}
        </span>
        {offer.includes.length > 0 && (
          <Text className="txt-small text-ui-fg-subtle">
            Includes {offer.includes.join(", ").toLowerCase()}.
          </Text>
        )}
        {offer.excludes.length > 0 && (
          <Text className="txt-small text-ui-fg-error">
            Not included: {offer.excludes.join(", ").toLowerCase()}. You'll be
            billed for these separately.
          </Text>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {[
          ["Condition", CONDITION_LABEL[offer.condition] ?? offer.condition],
          ["Warranty", offer.warranty_text],
          ["Returns", offer.return_policy_text],
        ]
          .filter(([, value]) => !!value)
          .map(([label, value]) => (
            <div key={label as string} className="flex flex-col">
              <dt className="txt-small text-ui-fg-muted">{label}</dt>
              <dd className="txt-small text-ui-fg-base">{value}</dd>
            </div>
          ))}
      </dl>

      {offer.condition_notes && (
        <Text className="txt-small text-ui-fg-subtle border-t border-ceedmart-navy/10 pt-3">
          {offer.condition_notes}
        </Text>
      )}
    </div>
  )
}

export default PreorderPanel
