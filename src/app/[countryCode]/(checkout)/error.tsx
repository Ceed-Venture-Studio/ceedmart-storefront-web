"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect } from "react"

// Checkout's error boundary.
//
// Without one, a throw in a server component renders React's default: "An
// error occurred in the Server Components render. The specific message is
// omitted in production builds..." — which tells the customer nothing, gives
// them nowhere to go, and on THIS route appears at the moment they have just
// paid. That is the worst possible place to show a dead end.
//
// The message stays omitted; that part is correct and deliberate on Next's
// side. What this adds is a page that says what to do next, and a digest the
// customer can quote so support can find the exact error in the logs.
export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Reaches the server logs alongside the framework's own line, so the
    // digest shown below can be tied to a stack.
    console.error("[checkout] render error", error?.digest, error?.message)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <Heading level="h1" className="text-2xl-semi text-ceedmart-navy">
        Something went wrong at checkout
      </Heading>

      {/* Said plainly, because the alternative is a customer paying twice. */}
      <Text className="txt-medium text-ui-fg-subtle max-w-md">
        If you have already paid, your payment is safe and your order may
        already be placed — please don&apos;t pay again. Check your order
        below, or message us and we&apos;ll confirm it for you.
      </Text>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Button
          onClick={reset}
          className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        >
          Try again
        </Button>
        <LocalizedClientLink href="/track">
          <Button variant="secondary">Find my order</Button>
        </LocalizedClientLink>
        <LocalizedClientLink href="/cart">
          <Button variant="secondary">Back to cart</Button>
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
