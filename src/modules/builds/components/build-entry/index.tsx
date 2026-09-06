"use client"

import { Text, clx } from "@medusajs/ui"
import { useState } from "react"

import type { ComponentCategory } from "@lib/data/build-catalog"
import Configurator from "@modules/builds/components/configurator"
import RequestForm from "@modules/builds/components/request-form"

// One door into custom builds (BRD §7.1, §7.2).
//
// This used to be two nav destinations — "Build Your Device" and "PC
// Builder" — which was a misreading of D-06 on my part. D-06 says ship the
// assisted flow BEFORE the guided one; it does not say a customer should
// have to decide which product they want before describing what they need.
//
// From the customer's side it is one job: get a machine built. What differs
// is only how much of the spec they already hold in their head. Someone who
// knows they want a 4070 Super and someone who says "video editing, under
// ₦900k" want the same outcome, and §7.1 lists the two as MODES of one
// feature, not two features.
//
// Both paths converge on the same BuildRequest server-side, so this is
// purely about not making the customer classify themselves at the nav.

type Mode = "describe" | "choose"

type Props = {
  /** Null when the configurator is flagged off or has no catalogue yet —
   *  the picker then collapses to the assisted form with no dead choice. */
  categories: ComponentCategory[] | null
  buildType: "desktop" | "laptop"
  countryCode: string
}

const BuildEntry = ({ categories, buildType, countryCode }: Props) => {
  const [mode, setMode] = useState<Mode>("describe")

  // Slots existing is not enough — a configurator whose every slot is
  // empty is worse than not offering the mode, because the customer picks
  // it, finds nothing to click, and concludes the site is broken. Require
  // something actually selectable.
  const selectable =
    categories && categories.some((c) => c.options.length > 0)
      ? categories
      : null

  if (!selectable) {
    return <RequestForm />
  }

  const options: { value: Mode; title: string; blurb: string }[] = [
    {
      value: "describe",
      title: "Tell us what you need",
      blurb:
        "Describe what you'll use it for and your budget. A specialist picks the parts.",
    },
    {
      value: "choose",
      title: "Choose the parts yourself",
      blurb:
        "Pick each component. We check they fit and work together as you go.",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">How would you like to build it?</legend>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              className={clx(
                "flex flex-col gap-1 rounded-lg border-2 px-4 py-3 text-left transition-colors",
                mode === option.value
                  ? "border-ceedmart-navy bg-ceedmart-navy/5"
                  : "border-ui-border-base hover:border-ceedmart-navy/40"
              )}
            >
              <span className="txt-medium-plus text-ui-fg-base">
                {option.title}
              </span>
              <span className="txt-small text-ui-fg-subtle">{option.blurb}</span>
            </button>
          ))}
        </div>

        <Text className="txt-small text-ui-fg-muted">
          Either way a specialist confirms the parts, availability and the
          final price before you pay anything — and you can switch at any
          point.
        </Text>
      </fieldset>

      {mode === "describe" ? (
        <RequestForm />
      ) : (
        <Configurator
          categories={selectable}
          buildType={buildType}
          countryCode={countryCode}
        />
      )}
    </div>
  )
}

export default BuildEntry
