import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getBuildCatalog } from "@lib/data/build-catalog"
import { isFeatureEnabled } from "@lib/data/feature-flags"
import Configurator from "@modules/builds/components/configurator"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ type?: string }>
}

export const metadata: Metadata = {
  title: "Build a PC — CeedMart",
  description:
    "Pick your parts and we'll check they work together. Compatibility is validated as you go, and a specialist confirms everything before you pay.",
}

// The guided configurator (BRD §7.3, §7.4).
//
// Gated behind its own flag, separate from custom builds: D-06 ships
// assisted requests first, so the assisted form at /build can be live while
// this is still off. When it is off, this 404s and /build keeps working.
export default async function BuildPcPage(props: Props) {
  const { countryCode } = await props.params
  const { type } = await props.searchParams

  if (!(await isFeatureEnabled("build_configurator"))) {
    notFound()
  }

  const buildType = type === "laptop" ? "laptop" : "desktop"
  const catalog = await getBuildCatalog(buildType)

  // No slots configured yet — send people to the assisted form rather than
  // showing an empty configurator, which reads as broken.
  if (!catalog || catalog.categories.length === 0) {
    return (
      <div className="content-container py-16">
        <div className="max-w-xl flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-ceedmart-navy">
            The builder isn&apos;t ready yet
          </h1>
          <p className="text-ui-fg-subtle">
            We&apos;re still loading our component catalogue. In the meantime,
            tell us what you need and a specialist will design it for you.
          </p>
          <Link
            href={`/${countryCode}/build`}
            className="text-ceedmart-navy underline w-fit"
          >
            Request an expert build
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-12 small:py-16">
      <header className="flex flex-col gap-3 mb-8 max-w-2xl">
        <h1 className="text-3xl small:text-4xl font-bold text-ceedmart-navy">
          Build a {buildType === "laptop" ? "laptop" : "PC"}
        </h1>
        <p className="text-ui-fg-subtle text-lg">
          Pick your parts. We check they fit and work together as you go, and
          tell you plainly when something won&apos;t.
        </p>
        <p className="txt-small text-ui-fg-muted">
          Not sure where to start?{" "}
          <Link
            href={`/${countryCode}/build`}
            className="text-ceedmart-navy underline"
          >
            Let a specialist design it instead
          </Link>
          .
        </p>
      </header>

      <Configurator
        categories={catalog.categories}
        buildType={buildType}
        countryCode={countryCode}
      />
    </div>
  )
}
