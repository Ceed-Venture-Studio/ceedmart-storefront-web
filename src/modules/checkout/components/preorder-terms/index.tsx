"use client"

import { Text } from "@medusajs/ui"
import { useState, useTransition } from "react"

import {
  acceptPreorderTerms,
  withdrawPreorderTerms,
} from "@lib/data/preorder-terms"

// Pre-order terms gate at checkout (BRD §6.6 "the customer must accept the
// applicable pre-order terms before payment").
//
// Deliberately a checkbox with the terms readable inline rather than behind
// a link. A customer committing to a two-week wait on an imported item
// needs the cancellation cutoff in front of them, not one click away.

type Props = {
  versionId: string
  body: string
  /** Already accepted on this cart, e.g. after a page reload. */
  initiallyAccepted?: boolean
  onChange?: (accepted: boolean) => void
}

const PreorderTerms = ({
  versionId,
  body,
  initiallyAccepted = false,
  onChange,
}: Props) => {
  const [accepted, setAccepted] = useState(initiallyAccepted)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const toggle = (next: boolean) => {
    // Optimistic so the checkbox feels responsive; reverted if the write
    // fails, because a box that looks ticked but was not recorded would let
    // someone pay without accepted terms.
    setAccepted(next)
    setError(null)
    onChange?.(next)

    startTransition(async () => {
      try {
        if (next) await acceptPreorderTerms(versionId)
        else await withdrawPreorderTerms()
      } catch (e: any) {
        setAccepted(!next)
        onChange?.(!next)
        setError(e?.message ?? "Could not save your choice. Please try again.")
      }
    })
  }

  return (
    <div className="border border-ui-border-base rounded-lg p-4 bg-ui-bg-subtle">
      <Text className="txt-medium-plus text-ui-fg-base mb-2">
        Pre-order terms
      </Text>

      <div
        className={
          expanded
            ? "text-small-regular text-ui-fg-subtle whitespace-pre-line mb-3"
            : "text-small-regular text-ui-fg-subtle whitespace-pre-line mb-3 line-clamp-4"
        }
      >
        {body}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-small-regular underline text-ui-fg-interactive mb-4"
      >
        {expanded ? "Show less" : "Read the full terms"}
      </button>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          disabled={pending}
          onChange={(e) => toggle(e.target.checked)}
          className="mt-1 h-4 w-4 accent-ceedmart-navy"
          data-testid="preorder-terms-checkbox"
        />
        <span className="text-small-regular text-ui-fg-base">
          I understand this item is sourced from the US, and I accept the
          delivery timeline and cancellation terms above.
        </span>
      </label>

      {error && (
        <Text className="txt-small text-ui-fg-error mt-2">{error}</Text>
      )}
    </div>
  )
}

export default PreorderTerms
