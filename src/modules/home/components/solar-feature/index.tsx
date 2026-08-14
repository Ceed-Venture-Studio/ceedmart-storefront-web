import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Solar estimator feature band.
 *
 * This is Ceedmart's genuine differentiator and the only true quote flow in
 * the app: `/solar` sizes inverter + battery + panel bundles from an
 * appliance load profile (see modules/solar/templates/solar-assistant-view).
 * It earns a dedicated band rather than being buried as a nav link.
 */
export default function SolarFeature() {
  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-tech-dark via-tech to-ceedmart-navy">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full border border-white/10" />
      </div>

      <div className="relative p-8 small:p-12 grid grid-cols-1 medium:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-widest">
            Free tool
          </span>
          <h2 className="mt-4 text-white text-2xl small:text-4xl font-bold tracking-tight leading-tight">
            Not sure what solar you need?
          </h2>
          <p className="mt-4 text-white/75 text-sm small:text-lg leading-relaxed max-w-lg">
            Tell us the appliances that matter and we&apos;ll size three
            bundles — budget, recommended and premium — with the inverter,
            battery and panel count worked out for you.
          </p>
          <LocalizedClientLink
            href="/solar"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy text-sm font-bold hover:brightness-95 transition-all"
          >
            Size my system
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

        <ul className="flex flex-col gap-3">
          {[
            "Pick your appliances",
            "We calculate the load",
            "Three costed bundles",
          ].map((label, i) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 px-4 py-3"
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-white text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
