"use client"


import type { ComponentCategory } from "@lib/data/build-catalog"
import Configurator from "@modules/builds/components/configurator"
import RequestForm from "@modules/builds/components/request-form"

// Entry point for building a device.
//
// One path: the customer picks the parts. The assisted "tell us what you
// need" form used to sit beside it as a second mode (§7.1 describes both),
// but offering the choice made people classify themselves before they had
// said anything, and the configurator is the product being sold.
//
// The form survives only as the no-catalogue fallback below, where the
// alternative is a page with nothing on it.

type Props = {
  /** Null when the configurator is flagged off or has no catalogue yet —
   *  the picker then collapses to the assisted form with no dead choice. */
  categories: ComponentCategory[] | null
  buildType: "desktop" | "laptop"
  countryCode: string
}

const BuildEntry = ({ categories, buildType, countryCode }: Props) => {
  // Slots existing is not enough — a configurator whose every slot is empty
  // is worse than not offering it, because the customer starts, finds
  // nothing to click, and concludes the site is broken. Require something
  // actually selectable.
  const selectable =
    categories && categories.some((c) => c.options.length > 0)
      ? categories
      : null

  if (!selectable) {
    // Fallback only, and invisible in normal operation: with no catalogue
    // there is nothing to configure, and an empty page would lose the
    // enquiry entirely. The assisted form is no longer offered as a choice
    // anywhere a customer can see it.
    return (
      <div className="max-w-2xl mx-auto w-full">
        <RequestForm />
      </div>
    )
  }

  return (
    <Configurator
      categories={selectable}
      buildType={buildType}
      countryCode={countryCode}
    />
  )
}

export default BuildEntry
