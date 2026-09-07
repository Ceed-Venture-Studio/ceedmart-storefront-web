import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listPreorderOffers } from "@lib/data/preorder"
import PreorderFilters from "@modules/preorder/components/preorder-filters"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import PreorderCard from "@modules/products/components/preorder-card"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    state?: string
    q?: string
    condition?: string
    source?: string
    max_days?: string
    max_price?: string
    sort?: string
  }>
}

export const metadata: Metadata = {
  title: "Pre-Order from the US — CeedMart",
  description:
    "Order products we source from the United States and have delivered in Nigeria. One all-inclusive naira price — duty, clearing and delivery included.",
}

// "Pre-Order from the US" (BRD §6.3, §9.1).
//
// The page has to answer two questions before anything else: how long will
// it take, and is the price I see the price I pay. §6.4 requires the
// inclusion of duty, clearing and local delivery be stated clearly, and
// D-02 made the price final — so both are said plainly at the top rather
// than left to the product page.
export default async function PreorderPage(props: Props) {
  const params = await props.searchParams

  if (!(await isFeatureEnabled("preorder"))) {
    notFound()
  }

  const { preorders, count, total, facets } = await listPreorderOffers(params)
  const available = preorders.filter((o) => o.available)
  const unavailable = preorders.filter((o) => !o.available)

  return (
    <div className="content-container py-8 small:py-16">
      {/* Header centred, content full width — the intro keeps a reading
          measure while the grid below uses the whole container. */}
      <header className="flex flex-col items-center text-center gap-3 mb-8 small:mb-12">
        <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-bold text-ceedmart-navy">
          Pre-order from the US
        </h1>
        <p className="text-ui-fg-subtle text-base small:text-lg max-w-2xl">
          Things we don&apos;t hold in Nigeria, sourced from the United States
          and delivered to you. You pay one price up front — there&apos;s no
          customs bill waiting at the other end.
        </p>
      </header>

      {/* The three facts that decide whether someone pre-orders at all.
          Carried on the brand navy so the reassurances read as CeedMart's
          promise rather than as three more boxes on a white page — a
          customer being asked to pay before an item exists is deciding
          whether to trust us, and this is where that case is made.
          Gold on navy for the headings: the two logo colours furthest apart,
          which is what makes each claim readable at a glance. */}
      <div className="grid grid-cols-1 xsmall:grid-cols-3 gap-px bg-ceedmart-navy-light rounded-lg overflow-hidden mb-8 small:mb-12">
        {[
          [
            "One price, locked",
            "Import duty, clearing and delivery within Nigeria are already in the price you see.",
          ],
          [
            "A date, not a maybe",
            "Every item shows how long it takes, broken down into sourcing, transit and customs.",
          ],
          [
            "Cancel before we buy",
            "Free cancellation any time before we purchase from our supplier.",
          ],
        ].map(([title, body]) => (
          <div
            key={title}
            className="bg-ceedmart-navy p-4 small:p-5 flex flex-col gap-1"
          >
            <span className="txt-medium-plus text-ceedmart-gold">{title}</span>
            {/* Not white/70: body text a customer is meant to read and
                believe should be legible, not decorative. */}
            <span className="txt-small text-white/90">{body}</span>
          </div>
        ))}
      </div>

      {/* Hidden when there is nothing to search. A filter bar above an empty
          list only asks the customer to rule out what is already absent. */}
      {total > 0 && (
        <PreorderFilters facets={facets} count={count} total={total} />
      )}

      {preorders.length === 0 ? (
        <div className="border border-grey-20 rounded-lg p-8 text-center">
          {total > 0 ? (
            <>
              {/* Filtered to nothing is a different situation from having
                  nothing, and telling someone to "check back soon" when the
                  answer is to widen their search is unhelpful. */}
              <p className="txt-medium-plus text-ui-fg-base mb-1">
                No pre-orders match that
              </p>
              <p className="txt-small text-ui-fg-subtle">
                Try a different search, or clear the filters to see all{" "}
                {total} pre-order{total === 1 ? "" : "s"}.
              </p>
            </>
          ) : (
            <>
              <p className="txt-medium-plus text-ui-fg-base mb-1">
                Nothing available to pre-order right now
              </p>
              <p className="txt-small text-ui-fg-subtle">
                We add items as we confirm them with our US suppliers. Check
                back soon.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h2 className="text-lg small:text-xl font-semibold text-ui-fg-base">
              Available now
            </h2>
            <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-6 small:gap-y-8">
              {available.map((offer) => (
                <PreorderCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>

          {unavailable.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg small:text-xl font-semibold text-ui-fg-base">
                Temporarily unavailable
              </h2>
              <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-6 small:gap-y-8">
                {unavailable.map((offer) => (
                  <PreorderCard key={offer.id} offer={offer} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
