import LocalizedClientLink from "@modules/common/components/localized-client-link"

// One destination in the top-right cluster: account, cart.
//
// ── Why a shared component ──────────────────────────────────────────────
// The cart's trigger lives in cart-dropdown (a client component, because it
// opens on hover) and its loading fallback lives in the nav. That is two
// copies of the same button before you count the account link. They had
// already drifted — the account icon rendered at 32px and the cart's at
// 24px — so the two things sitting side by side were different sizes.
//
// ── Why the icon is not on its own ──────────────────────────────────────
// A bare glyph asks the customer to recognise a silhouette. Naming the
// thing is what makes it findable, which is why every large storefront puts
// a word next to the icon rather than trusting the picture alone. The label
// is hidden below `medium` so the nav still fits once the search bar and
// the location chip are competing for the same row; the icon carries it
// there, and the mobile bottom nav carries it below `small`.
type Props = {
  href: string
  icon: React.ReactNode
  /** Small first line — the greeting or state. */
  hint: string
  /** Bold second line — what the thing is called. */
  label: string
  /** Count to show on the icon. Omitted or 0 renders nothing. */
  badge?: number
  testId?: string
}

const NavAction = ({ href, icon, hint, label, badge = 0, testId }: Props) => (
  <LocalizedClientLink
    href={href}
    data-testid={testId}
    // A hover border rather than a permanent one: at rest the cluster stays
    // quiet next to the logo, and the box appears where the pointer is, so
    // the target reads as a button the moment it matters.
    className="flex items-center gap-3.5 rounded-lg border border-transparent px-2 py-1.5 hover:border-grey-20 hover:bg-grey-5 transition-colors"
    aria-label={`${label} — ${hint}`}
  >
    <span className="relative shrink-0 text-ceedmart-navy">
      {icon}
      {badge > 0 && (
        // Gold on navy, the same pairing the hero uses. The white ring cuts
        // the badge away from the glyph underneath it — without it the
        // count reads as part of the drawing rather than a number on top of
        // it. It protrudes 6px into a 14px gap. A longer count grows
        // leftward from a fixed right edge, so "99+" does not close that
        // gap either.
        // min-w with px handles two and three digits; the old badge was
        // sized w-4.5, which is not in the spacing scale, so it resolved to
        // no width at all and the count floated loose beside the bag.
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-ceedmart-gold text-ceedmart-navy text-[11px] font-bold leading-none flex items-center justify-center ring-2 ring-white tabular-nums"
          aria-hidden
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </span>

    <span className="hidden medium:flex flex-col leading-tight text-left">
      <span className="text-[11px] text-grey-50">{hint}</span>
      <span className="text-sm font-bold text-ceedmart-navy">{label}</span>
    </span>
  </LocalizedClientLink>
)

export default NavAction
