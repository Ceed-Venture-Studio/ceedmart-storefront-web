import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { MenuSection } from "@lib/data/menu"

/**
 * "Shop by range" grid — the six supply ranges, driven by the same
 * STORE_SECTIONS config as the mega menu so the two can never drift apart.
 * Replaces the old four hand-written StoreCards, which had no Groceries or
 * Power Solutions and duplicated copy already living in store-config.
 *
 * Accent colours are keyed by href rather than stored in the config, so
 * merchandising data stays free of presentation concerns.
 */
type Accent = {
  /** Full-card gradient. */
  bg: string
  /** Title/CTA colour — navy on the light gold card, white elsewhere. */
  text: string
  sub: string
}

const ACCENTS: Record<string, Accent> = {
  "/store/wholefoods": {
    bg: "bg-gradient-to-br from-wholefoods-dark via-wholefoods to-wholefoods-accent",
    text: "text-white",
    sub: "text-white/80",
  },
  "/store/solar-energy-power": {
    bg: "bg-gradient-to-br from-tech-dark via-tech to-tech-light",
    text: "text-white",
    sub: "text-white/80",
  },
  "/store/cctv-access-control": {
    // Gold is high-contrast against white text — use navy for legibility,
    // same call the old StoreCards made.
    bg: "bg-gradient-to-br from-yellow-500 via-ceedmart-gold to-amber-300",
    text: "text-ceedmart-navy",
    sub: "text-ceedmart-navy/75",
  },
  "/store/computer-accessories": {
    bg: "bg-gradient-to-br from-slate-800 via-slate-600 to-slate-400",
    text: "text-white",
    sub: "text-white/80",
  },
  "/store/groceries": {
    bg: "bg-gradient-to-br from-amber-700 via-amber-500 to-orange-300",
    text: "text-white",
    sub: "text-white/85",
  },
  "/store/power-solutions": {
    bg: "bg-gradient-to-br from-slate-900 via-teal-800 to-emerald-500",
    text: "text-white",
    sub: "text-white/80",
  },
}

const FALLBACK: Accent = {
  bg: "bg-gradient-to-br from-ceedmart-navy to-ceedmart-navy-light",
  text: "text-white",
  sub: "text-white/80",
}

export default function SectionGrid({
  sections,
}: {
  sections: MenuSection[]
}) {
  if (!sections.length) return null

  return (
    <section className="w-full">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl small:text-3xl font-bold text-grey-90 tracking-tight">
            Shop by range
          </h2>
          <p className="mt-1.5 text-grey-60 text-sm small:text-base">
            Six supply lines, all available at quantity.
          </p>
        </div>
        <LocalizedClientLink
          href="/store"
          className="hidden small:inline text-sm font-semibold text-ceedmart-navy hover:underline shrink-0"
        >
          View everything &rarr;
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-4">
        {sections.map((section) => {
          const accent = ACCENTS[section.href] ?? FALLBACK
          // Sparse sections have no populated children worth listing, so the
          // card shows the range on its own rather than an empty sub-list.
          const preview = section.groups
            .flatMap((g) => g.children)
            .slice(0, 4)

          return (
            <LocalizedClientLink
              key={section.href}
              href={section.href}
              className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl p-6 min-h-[200px] shadow-md hover:shadow-xl transition-all small:hover:scale-[1.02] ${accent.bg}`}
            >
              {/* Subtle geometry for depth, consistent with the section pages */}
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/15" />
                <div className="absolute bottom-2 left-20 w-16 h-16 rounded-full border border-white/10" />
              </div>

              <div className="relative">
                <h3
                  className={`text-xl font-bold leading-tight drop-shadow-sm ${accent.text}`}
                >
                  {section.title}
                </h3>

                {preview.length > 0 && (
                  <p className={`mt-2 text-sm leading-relaxed ${accent.sub}`}>
                    {preview.map((c) => c.name).join(" · ")}
                  </p>
                )}
              </div>

              <span
                className={`relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text}`}
              >
                Shop range
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
              </span>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
