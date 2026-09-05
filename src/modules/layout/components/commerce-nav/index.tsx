import { getFeatureFlags } from "@lib/data/feature-flags"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Commerce-type destinations in the primary nav (BRD §9.1).
//
// The mega menu is built entirely from category IDs (see STORE_SECTIONS in
// lib/data/store-config). "Pre-Order from the US", "Build Your Device" and
// "Auctions" are not categories — they are ways of buying, and forcing them
// into the category tree would mean inventing empty categories whose
// contents contradict their name.
//
// So they get their own strip beneath the mega menu: a different kind of
// destination, presented as one. Each appears only when its feature flag is
// on, so the nav never advertises a page that 404s.

const DESTINATIONS = [
  {
    flag: "preorder" as const,
    href: "/preorder",
    label: "Pre-Order from the US",
    blurb: "Sourced and flown in for you",
  },
  {
    flag: "custom_build" as const,
    href: "/build",
    label: "Build Your Device",
    blurb: "Custom PCs and laptops",
  },
  {
    flag: "auction" as const,
    href: "/auctions",
    label: "Auctions",
    blurb: "Bid on limited stock",
  },
]

const CommerceNav = async () => {
  const flags = await getFeatureFlags()
  const live = DESTINATIONS.filter((d) => flags[d.flag])

  // Renders nothing at all until a feature is switched on, so the nav is
  // unchanged for everyone today.
  if (!live.length) return null

  return (
    <div className="border-b border-grey-20 bg-grey-5">
      <div className="content-container">
        <ul className="flex items-stretch gap-x-6 overflow-x-auto">
          {live.map((dest) => (
            <li key={dest.href} className="shrink-0">
              <LocalizedClientLink
                href={dest.href}
                className="flex flex-col py-2 border-b-2 border-transparent hover:border-ceedmart-navy transition-colors"
              >
                <span className="txt-small-plus text-ceedmart-navy">
                  {dest.label}
                </span>
                <span className="txt-small text-ui-fg-muted hidden small:block">
                  {dest.blurb}
                </span>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CommerceNav
