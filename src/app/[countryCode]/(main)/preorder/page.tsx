import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listPreorderOffers } from "@lib/data/preorder"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import PreorderCard from "@modules/products/components/preorder-card"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ state?: string }>
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
  const { state } = await props.searchParams

  if (!(await isFeatureEnabled("preorder"))) {
    notFound()
  }

  const offers = await listPreorderOffers(state)
  const available = offers.filter((o) => o.available)
  const unavailable = offers.filter((o) => !o.available)

  return (
    <div className="content-container py-12 small:py-16">
      <header className="flex flex-col gap-4 mb-10 max-w-2xl">
        <h1 className="text-3xl small:text-4xl font-bold text-ceedmart-navy">
          Pre-order from the US
        </h1>
        <p className="text-ui-fg-subtle text-lg">
          Things we don&apos;t hold in Nigeria, sourced from the United States
          and delivered to you. You pay one price up front — there&apos;s no
          customs bill waiting at the other end.
        </p>
      </header>

      {/* The three facts that decide whether someone pre-orders at all. */}
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4 mb-12">
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
            className="border border-grey-20 rounded-lg p-4 flex flex-col gap-1"
          >
            <span className="txt-medium-plus text-ui-fg-base">{title}</span>
            <span className="txt-small text-ui-fg-subtle">{body}</span>
          </div>
        ))}
      </div>

      {offers.length === 0 ? (
        <div className="border border-grey-20 rounded-lg p-8 text-center">
          <p className="txt-medium-plus text-ui-fg-base mb-1">
            Nothing available to pre-order right now
          </p>
          <p className="txt-small text-ui-fg-subtle">
            We add items as we confirm them with our US suppliers. Check back
            soon.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-ui-fg-base">
              Available now
            </h2>
            <div className="grid grid-cols-2 small:grid-cols-3 large:grid-cols-4 gap-4">
              {available.map((offer) => (
                <PreorderCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>

          {unavailable.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-ui-fg-base">
                Temporarily unavailable
              </h2>
              <div className="grid grid-cols-2 small:grid-cols-3 large:grid-cols-4 gap-4">
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
