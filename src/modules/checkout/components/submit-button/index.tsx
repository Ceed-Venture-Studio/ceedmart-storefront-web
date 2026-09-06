"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  isLoading,
  pendingText,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  /**
   * Explicit pending state, for callers that already have one.
   *
   * `useFormStatus` reads from form context, which is easy to lose: it only
   * reports for an ancestor <form>, so a button that gets moved, portalled,
   * or wrapped stops reporting and fails silently — the button simply never
   * looks busy, and nothing errors. Where the caller already knows (React 19
   * hands `isPending` back from useActionState), passing it is both cheaper
   * and impossible to break.
   */
  isLoading?: boolean
  /**
   * Replacement label while pending. A spinner alone reads as "something is
   * happening"; naming the action tells the customer WHAT is happening, which
   * matters most on the slow submits people are tempted to double-click.
   */
  pendingText?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()
  const busy = isLoading ?? pending

  return (
    <Button
      size="large"
      className={`bg-ceedmart-navy hover:bg-ceedmart-navy-light ${className || ""}`}
      type="submit"
      isLoading={busy}
      // Button already sets disabled when isLoading, but say it out loud:
      // this is the property that stops a second submit, and it should not
      // depend on a detail of someone else's component.
      disabled={busy}
      aria-busy={busy}
      variant={variant || "primary"}
      data-testid={dataTestId}
    >
      {busy && pendingText ? pendingText : children}
    </Button>
  )
}
