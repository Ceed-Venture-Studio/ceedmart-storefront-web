"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect } from "react"

// Catch-all for the storefront.
//
// Without a boundary, any throw in a server component renders React's
// default message about the Server Components render — no heading, no way
// back, and nothing the customer can report. Checkout has its own boundary
// because the stakes there are different; this covers everything else.
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[storefront] render error", error?.digest, error?.message)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <Heading level="h1" className="text-2xl-semi text-ceedmart-navy">
        This page didn&apos;t load
      </Heading>
      <Text className="txt-medium text-ui-fg-subtle max-w-md">
        Something went wrong on our side. Nothing you did caused it, and
        nothing in your cart has changed.
      </Text>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Button
          onClick={reset}
          className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        >
          Try again
        </Button>
        <LocalizedClientLink href="/">
          <Button variant="secondary">Go home</Button>
        </LocalizedClientLink>
      </div>

      {error?.digest && (
        <Text size="small" className="text-ui-fg-muted mt-4">
          Reference: {error.digest}
        </Text>
      )}
    </div>
  )
}
