import LocalizedClientLink from "@modules/common/components/localized-client-link"

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Use" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/shipping", label: "Shipping Policy" },
]

export default function LegalPage({
  title,
  effectiveDate = "May 29, 2026",
  children,
}: {
  title: string
  effectiveDate?: string
  children: React.ReactNode
}) {
  return (
    <article className="content-container py-10 small:py-14 max-w-4xl mx-auto">
      <header className="border-b border-grey-20 pb-5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-ceedmart-navy mb-2">
          Legal
        </p>
        <h1 className="text-3xl small:text-4xl font-bold text-ui-fg-base">
          {title}
        </h1>
        <p className="text-sm text-grey-50 mt-2">
          Effective date: {effectiveDate}
        </p>
      </header>

      <div className="flex flex-col gap-3 text-sm small:text-base text-grey-80 leading-relaxed">
        {children}
      </div>

      <footer className="mt-12 pt-6 border-t border-grey-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-grey-50 mb-3">
          More legal documents
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <LocalizedClientLink
                href={l.href}
                className="text-ceedmart-navy hover:text-ceedmart-navy-light hover:underline"
              >
                {l.label}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  )
}

// Helpers — keep markup terse + consistent across legal pages.

export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl small:text-2xl font-bold text-ui-fg-base mt-8 mb-2">
    {children}
  </h2>
)

export const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base small:text-lg font-semibold text-ui-fg-base mt-5 mb-1">
    {children}
  </h3>
)

export const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1">{children}</p>
)

export const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 mb-2">{children}</ul>
)

export const OL = ({ children }: { children: React.ReactNode }) => (
  <ol className="list-decimal pl-6 space-y-1.5 mb-2">{children}</ol>
)

export const ContactBlock = () => (
  <address className="not-italic mt-2 text-sm small:text-base leading-relaxed">
    <p className="font-semibold text-ui-fg-base">Ceedmart General Merchandise</p>
    <p>
      Email:{" "}
      <a
        href="mailto:hello@ceedmart.com"
        className="text-ceedmart-navy hover:underline"
      >
        hello@ceedmart.com
      </a>
    </p>
    <p>
      Phone:{" "}
      <a
        href="tel:+2347087502195"
        className="text-ceedmart-navy hover:underline"
      >
        +234 708 750 2195
      </a>
    </p>
    <p>
      Address: Opposite Unity Oil and Gas, Chief G.U Ake Road, Eliozu, Port
      Harcourt.
    </p>
    <p>
      Website:{" "}
      <a
        href="https://ceedmart.com"
        className="text-ceedmart-navy hover:underline"
      >
        ceedmart.com
      </a>
    </p>
  </address>
)
