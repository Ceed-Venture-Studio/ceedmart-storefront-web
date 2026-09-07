import { Metadata } from "next"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
    <div className="content-container py-5 small:py-8">
      {/* Full width: the configurator needs it for its two-column layout,
          and the assisted form centres itself within it. */}
      <div className="flex flex-col gap-4 small:gap-6">
        <header className="flex flex-col items-center text-center gap-2">
          <h1 className="text-xl xsmall:text-2xl small:text-3xl font-bold text-ceedmart-navy">
            Customise your {buildType === "laptop" ? "laptop" : "PC"}
          </h1>
          <p className="text-ui-fg-subtle text-sm small:text-base max-w-2xl">
            Choose every part yourself. We check they fit and work together as
            you go, and a specialist confirms availability and the final price
            before you pay anything.
          </p>

          {/* The choice used to live in a URL parameter nobody could see.
              It changes which parts are offered, so it belongs on the page. */}
          <div
            className="inline-flex rounded-lg border border-grey-20 p-1 bg-white"
            role="group"
            aria-label="What are you building?"
          >
            {[
              { value: "desktop", label: "PC", href: "/build" },
              { value: "laptop", label: "Laptop", href: "/build?type=laptop" },
            ].map((option) => (
              <LocalizedClientLink
                key={option.value}
                href={option.href}
                aria-current={buildType === option.value ? "page" : undefined}
                data-testid={`build-type-${option.value}`}
                className={
                  buildType === option.value
                    ? "px-4 py-1.5 rounded-md bg-ceedmart-navy text-white txt-small-plus"
                    : "px-4 py-1.5 rounded-md text-ui-fg-subtle hover:text-ceedmart-navy txt-small-plus"
                }
              >
                {option.label}
              </LocalizedClientLink>
            ))}
          </div>
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
