import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBuildCatalog } from "@lib/data/build-catalog"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import BuildEntry from "@modules/builds/components/build-entry"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ type?: string }>
}

export const metadata: Metadata = {
  title: "Build Your Device — CeedMart",
  description:
    "Get a custom PC or laptop built for you. Describe what you need and we'll spec it, or pick the parts yourself and we'll check they work together.",
}

// The single custom-build destination (BRD §7.1, §7.2).
//
// Both modes live here rather than on separate routes. §7.1 describes
// guided configuration and assisted request as two MODES of one feature —
// what differs is how much of the spec the customer already holds, not what
// they want. Splitting them into two nav entries made the customer
// classify themselves before they had said anything.
export default async function BuildPage(props: Props) {
  const { countryCode } = await props.params
  const { type } = await props.searchParams

  if (!(await isFeatureEnabled("custom_build"))) {
    notFound()
  }

  const buildType = type === "laptop" ? "laptop" : "desktop"

  // The configurator is separately flagged (D-06 ships assisted first), and
  // needs a populated catalogue. When either is missing the page quietly
  // becomes the assisted form rather than offering a mode that leads
  // nowhere.
  const configuratorOn = await isFeatureEnabled("build_configurator")
  const catalog = configuratorOn ? await getBuildCatalog(buildType) : null

  return (
    <div className="content-container py-8 small:py-16">
      {/* Full width: the configurator needs it for its two-column layout,
          and the assisted form centres itself within it. */}
      <div className="flex flex-col gap-6 small:gap-8">
        <header className="flex flex-col items-center text-center gap-3">
          <h1 className="text-2xl xsmall:text-3xl small:text-4xl font-bold text-ceedmart-navy">
            Build your device
          </h1>
          <p className="text-ui-fg-subtle text-base small:text-lg max-w-2xl">
            A custom PC or laptop, specced for what you actually do with it —
            not whatever the shop had in stock.
          </p>
          <p className="txt-small text-ui-fg-muted">
            You don&apos;t need to know what a chipset is. That&apos;s our job.
          </p>
        </header>

        <BuildEntry
          categories={catalog?.categories ?? null}
          buildType={buildType}
          countryCode={countryCode}
        />
      </div>
    </div>
  )
}
