import { Metadata } from "next"
import { notFound } from "next/navigation"

import { isFeatureEnabled } from "@lib/data/feature-flags"
import RequestForm from "@modules/builds/components/request-form"

export const metadata: Metadata = {
  title: "Build Your Device — CeedMart",
  description:
    "Tell us what you need and a CeedMart specialist will design and quote a custom PC or laptop for you. No component knowledge required.",
}

// "Build Your Device" (BRD §9.1, §7.5).
//
// 404s when the feature is off rather than rendering a form whose submit
// endpoint is disabled — a page that takes a customer's details and then
// fails is worse than one that isn't there.
export default async function BuildPage() {
  if (!(await isFeatureEnabled("custom_build"))) {
    notFound()
  }

  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl small:text-4xl font-bold text-ceedmart-navy">
            Build your device
          </h1>
          <p className="text-ui-fg-subtle text-lg">
            Tell us what you want the machine to do and what you can spend. One
            of our specialists picks the parts, checks they work together, and
            sends you a priced quote.
          </p>
          <p className="txt-small text-ui-fg-muted">
            You don&apos;t need to know what a chipset is. That&apos;s our job.
          </p>
        </header>

        <RequestForm />
      </div>
    </div>
  )
}
