import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBuildQuote } from "@lib/data/builds"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import QuoteView from "@modules/builds/components/quote-view"

type Props = {
  params: Promise<{ countryCode: string; reference: string }>
  searchParams: Promise<{ accepted?: string }>
}

export const metadata: Metadata = {
  title: "Your build quote — CeedMart",
  robots: { index: false, follow: false },
}

// A customer's build quote, reached by the reference in their email
// (BRD §7.6, §9.4).
//
// Deliberately noindex: the reference is the only credential, so these
// pages must not turn up in search results.
export default async function BuildQuotePage(props: Props) {
  const { countryCode, reference } = await props.params
  const { accepted } = await props.searchParams

  if (!(await isFeatureEnabled("custom_build"))) {
    notFound()
  }

  const quote = await getBuildQuote(reference)
  if (!quote) {
    notFound()
  }

  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-3xl">
        {accepted && (
          <div className="mb-8 rounded-lg border border-wholefoods bg-wholefoods-bg p-4">
            <p className="txt-medium-plus text-wholefoods-dark">
              Quote accepted — thank you.
            </p>
            <p className="txt-small text-wholefoods-dark">
              We&apos;ll email payment details shortly. Once payment lands we
              start sourcing your parts.
            </p>
          </div>
        )}

        <QuoteView quote={quote} countryCode={countryCode} />
      </div>
    </div>
  )
}
