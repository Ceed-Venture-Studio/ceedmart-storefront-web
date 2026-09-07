"use client"

import { isManual, isPulsePay, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import ErrorMessage from "../error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isPulsePay(paymentSession?.provider_id):
      return (
        <PulsePayButton notReady={notReady} data-testid={dataTestId} />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const PulsePayButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [needsNewPayment, setNeedsNewPayment] = useState(false)
  const searchParams = useSearchParams()

  // Captured on the FIRST render, deliberately.
  //
  // Paystack returns with session_id/reference/trxref on the URL, and an
  // effect elsewhere in checkout strips session_id as soon as it runs. Both
  // effects fire after mount, so reading these later is a race we would
  // sometimes lose. A useState initialiser runs during render, before any
  // effect, and keeps the answer.
  const [returnedFromGateway] = useState(
    () =>
      searchParams.has("session_id") ||
      searchParams.has("reference") ||
      searchParams.has("trxref")
  )

  // Auto-completion must happen at most once. Without this, a failed attempt
  // that re-renders would try again, and again.
  const attempted = useRef(false)

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    setNeedsNewPayment(false)

    await placeOrder()
      .catch((err) => {
        // A payment session can be dead by the time the customer confirms:
        // Pulse marks a payment Cancelled as soon as anything reads it before
        // the customer has finished paying, and a read happens on the way
        // here. From the customer's side they clicked Pay, saw Paystack, and
        // are now being told no — with no way forward, because this page has
        // no controls other than this button.
        //
        // Starting a fresh payment is always allowed and always works, so
        // offer that rather than leaving them stuck. We cannot stop Pulse
        // cancelling the session; we can stop it ending the sale.
        const message = String(err?.message ?? err)
        const sessionIsDead =
          /cancel|not authorized|authoriz|payment session|pending/i.test(message)

        if (sessionIsDead) {
          setNeedsNewPayment(true)
          setErrorMessage(
            "That payment didn't complete. Nothing has been charged — start a new payment to finish your order."
          )
        } else {
          setErrorMessage(message)
        }
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  // Place the order the moment the customer returns from the gateway.
  //
  // They have already paid. Asking them to press one more button is a step
  // at which orders are lost — a closed tab, a flat battery, a customer who
  // reasonably believes paying was the last thing required. The money is
  // taken either way, so the only question is whether we have an order to
  // match it.
  //
  // Not when notReady: the cart is missing something and completing would
  // fail anyway, so leave the button and let them see what is wrong.
  useEffect(() => {
    if (!returnedFromGateway || attempted.current || notReady) {
      return
    }
    attempted.current = true
    handlePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedFromGateway, notReady])

  const autoCompleting = returnedFromGateway && submitting

  return (
    <>
      {autoCompleting && (
        <Text
          className="txt-medium text-ui-fg-subtle mb-3"
          data-testid="auto-completing-notice"
        >
          Payment received — completing your order…
        </Text>
      )}

      <Button
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        data-testid={dataTestId}
      >
        {autoCompleting ? "Completing order" : "Confirm Order"}
      </Button>

      {needsNewPayment && (
        <LocalizedClientLink
          href="/checkout?step=payment"
          className="txt-medium-plus text-ceedmart-navy underline mt-3 inline-block"
          data-testid="restart-payment-link"
        >
          Start a new payment
        </LocalizedClientLink>
      )}

      <ErrorMessage
        error={errorMessage}
        data-testid="pulse-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
