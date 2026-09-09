"use client"

import { isManual, isPulsePay, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { getCartPaymentStatus } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import ErrorMessage from "../error-message"

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
        <PulsePayButton
          notReady={notReady}
          initialStatus={paymentSession?.status}
          data-testid={dataTestId}
        />
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

/** The gateway has actually taken the money. */
const isPaid = (status?: string | null) =>
  status === "authorized" || status === "captured"

const PulsePayButton = ({
  notReady,
  initialStatus,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  initialStatus?: string | null
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Whether the payment session says the money is in.
  //
  // Seeded from the cart the server rendered, then polled: the session turns
  // authorized when Pulse's webhook lands, which is seconds AFTER the
  // customer is back on this page. Without polling the button would stay
  // greyed until they reloaded, which reads as broken.
  const [paid, setPaid] = useState(() => isPaid(initialStatus))

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

    await placeOrder()
      .catch((err) => {
        // Deliberately no "start a new payment" offer any more.
        //
        // It was there because the order could not be placed while the
        // session still read as unpaid, and restarting was the only way
        // forward. But it told a customer who HAD paid that nothing was
        // charged and invited them to pay a second time — the worst thing
        // this page can say. The session lags because confirmation arrives
        // by webhook moments later, so the answer is to wait for it, which
        // is what the polling below does.
        const message = String(err?.message ?? err)
        const notConfirmedYet =
          /cancel|not authorized|authoriz|payment session|pending/i.test(message)

        setErrorMessage(
          notConfirmedYet
            ? "We haven't had confirmation from your bank yet. Keep this page open — " +
                "it completes on its own, and nothing will be charged twice."
            : message
        )
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  // Wait for the payment to be confirmed, rather than guessing.
  //
  // Pulse confirms by webhook, which arrives seconds after the customer is
  // redirected back — so on arrival the session is usually still pending.
  // Polling the cart is what turns the button live at the right moment,
  // and stops us placing an order against a payment that has not landed.
  useEffect(() => {
    if (paid || notReady) {
      return
    }
    let cancelled = false
    const tick = async () => {
      try {
        const status = await getCartPaymentStatus()
        if (!cancelled && isPaid(status)) {
          setPaid(true)
        }
      } catch {
        // A failed poll is not worth showing anyone; the next one runs.
      }
    }
    const timer = setInterval(tick, 4000)
    tick()
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [paid, notReady])

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
    // `paid` is the new condition. Previously this fired on return from the
    // gateway alone, which meant placing an order against a session that was
    // still pending — the call failed and the customer was told their
    // payment had not gone through when it had.
    if (!returnedFromGateway || !paid || attempted.current || notReady) {
      return
    }
    attempted.current = true
    handlePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedFromGateway, paid, notReady])

  const autoCompleting = returnedFromGateway && submitting
  // Back from the gateway but not yet confirmed: the state this page spends
  // most of its life in, and the one it used to mishandle.
  const awaitingConfirmation = returnedFromGateway && !paid && !submitting

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

      {awaitingConfirmation && (
        <Text
          className="txt-medium text-ui-fg-subtle mb-3"
          data-testid="awaiting-confirmation-notice"
        >
          Waiting for your bank to confirm the payment. This usually takes a
          few seconds — keep this page open and your order completes on its
          own.
        </Text>
      )}

      {/* Greyed until the payment is actually confirmed. Pressing it earlier
          could only ever fail, and the failure read as "you have not paid" to
          someone who had. */}
      <Button
        disabled={notReady || submitting || !paid}
        isLoading={submitting || awaitingConfirmation}
        onClick={handlePayment}
        size="large"
        className="bg-ceedmart-navy hover:bg-ceedmart-navy-light"
        data-testid={dataTestId}
      >
        {autoCompleting
          ? "Completing order"
          : awaitingConfirmation
            ? "Confirming payment…"
            : "Confirm Order"}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="pulse-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
