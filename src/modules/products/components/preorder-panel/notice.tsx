import { Text } from "@medusajs/ui"

// Shown when a listing IS a pre-order but its offer could not be loaded.
//
// ── Why a degraded panel rather than nothing ────────────────────────────
// The full panel needs the offer: the delivery estimate, the landed-price
// basis, what duty and clearing include. getPreorderOffer returns null on
// any failure — a 404, an expired offer, a momentary network fault — and the
// page used to respond by rendering no pre-order block at all.
//
// That failure mode is the dangerous one. The product does not become
// ordinary stock because a fetch failed; it is still sourced abroad and
// still takes weeks. Silently dropping the disclosure leaves an ordinary buy
// box on a listing that will not arrive this week, which is the one
// impression a pre-order page exists to prevent.
//
// So the fact survives even when the detail does not. The customer is told
// what they are buying and that the timing is unavailable, which is honest
// about both the item and our own state.

const PreorderNotice = ({ label }: { label?: string | null }) => (
  <div className="flex flex-col gap-2 border border-ceedmart-navy/20 rounded-lg p-4 bg-ceedmart-navy/[0.03]">
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center rounded-full bg-ceedmart-navy text-white text-[11px] font-medium px-2 py-0.5">
        {label || "Ships from the US"}
      </span>
    </div>
    <Text className="txt-medium text-ui-fg-subtle">
      This is a pre-order sourced from the United States, not stock held in
      Nigeria. It is bought in for you after you order, so it arrives in
      weeks rather than days.
    </Text>
    <Text size="small" className="text-ui-fg-muted">
      The delivery estimate and landed-cost breakdown could not be loaded just
      now. Refresh the page, or message us on WhatsApp and we will confirm the
      timing before you pay.
    </Text>
  </div>
)

export default PreorderNotice
