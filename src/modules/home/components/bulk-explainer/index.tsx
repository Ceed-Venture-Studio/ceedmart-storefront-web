import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * How bulk ordering works + the quantity-break promise.
 *
 * The price ladder shown here is illustrative of the mechanic, not a live
 * quote — real breaks are set per variant via `min_quantity` price rows and
 * surface on the product page. Kept deliberately generic (percentages, no
 * naira figures) so it cannot go stale against the catalogue.
 */
const STEPS = [
  {
    n: "1",
    title: "Find your range",
    body: "Browse six supply lines — foods, groceries, solar, power, security and IT.",
  },
  {
    n: "2",
    title: "Set your quantity",
    body: "Unit price drops automatically as you increase quantity. Every break is visible before checkout.",
  },
  {
    n: "3",
    title: "We deliver",
    body: "Free delivery across Lagos and Port Harcourt. Nationwide by arrangement.",
  },
]

export default function BulkExplainer() {
  return (
    <section className="w-full rounded-3xl bg-grey-5 border border-grey-15 p-8 small:p-12">
      <div className="grid grid-cols-1 medium:grid-cols-2 gap-10 medium:gap-16 items-center">
        <div>
          <h2 className="text-2xl small:text-3xl font-bold text-grey-90 tracking-tight">
            The more you order,
            <br />
            the less you pay per unit.
          </h2>
          <p className="mt-4 text-grey-60 text-sm small:text-base leading-relaxed max-w-md">
            No account tiers, no negotiation, no hidden trade list. One
            published price per product with quantity breaks anyone can see —
            whether you&apos;re buying one case or a pallet.
          </p>

          <LocalizedClientLink
            href="/store"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ceedmart-navy text-white text-sm font-bold hover:bg-ceedmart-navy-light transition-colors"
          >
            Start an order
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </LocalizedClientLink>
        </div>

        <ol className="flex flex-col gap-5">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-ceedmart-navy text-white text-sm font-bold flex items-center justify-center">
                {step.n}
              </span>
              <div>
                <h3 className="text-base font-bold text-grey-90">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-grey-60 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
