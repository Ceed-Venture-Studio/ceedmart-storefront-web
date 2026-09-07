"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// One destination in the commerce strip, with its own active state.
//
// Split out as a client component because CommerceNav is async — it awaits
// the feature flags — and a server component cannot read the pathname. Only
// the highlight needs the client; the flag fetch stays on the server.

type Props = {
  href: string
  label: string
  blurb: string
}

const CommerceNavLink = ({ href, label, blurb }: Props) => {
  const pathname = usePathname()

  // The link is written as "/preorder" and rendered as "/ng/preorder", so
  // compare on the segment after the country code rather than the whole
  // path. startsWith, not equality: a detail page like /auctions/AUC-123
  // should keep Auctions lit rather than leaving the strip looking as
  // though the customer has wandered off it.
  const segment = pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, "") || "/"
  const active = segment === href || segment.startsWith(`${href}/`)

  return (
    <LocalizedClientLink
      href={href}
      aria-current={active ? "page" : undefined}
      data-testid={`commerce-nav-${href.replace("/", "")}`}
      className={
        active
          ? "flex flex-col py-2 border-b-2 border-ceedmart-navy transition-colors"
          : "flex flex-col py-2 border-b-2 border-transparent hover:border-ceedmart-navy/40 transition-colors"
      }
    >
      <span
        className={
          active
            ? "txt-small-plus text-ceedmart-navy font-semibold"
            : "txt-small-plus text-ceedmart-navy"
        }
      >
        {label}
      </span>
      <span className="txt-small text-ui-fg-muted hidden small:block">
        {blurb}
      </span>
    </LocalizedClientLink>
  )
}

export default CommerceNavLink
