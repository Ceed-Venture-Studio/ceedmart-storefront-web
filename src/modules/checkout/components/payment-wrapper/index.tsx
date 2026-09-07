"use client"

// The /pure entry point matters. Importing "@stripe/stripe-js" injects
// Stripe.js as a side effect of the IMPORT, before loadStripe is ever
// called — so deferring the call alone changes nothing. /pure defers the
// script until loadStripe actually runs.
import { loadStripe } from "@stripe/stripe-js/pure"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isStripeLike } from "@lib/constants"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey =
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY

const medusaAccountId = process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID

// Loaded on demand, not at module scope.
//
// Stripe.js inserts a fixed-position metrics iframe 420px wide. On a 375px
// phone that is wider than the screen, so checkout scrolled sideways — on a
// shop with no Stripe provider registered, which never renders
// StripeWrapper at all. Every customer's browser was also making
// third-party requests to Stripe on a payment page, for nothing.
let stripePromise: ReturnType<typeof loadStripe> | null = null

const getStripe = () => {
  if (!stripeKey) {
    return null
  }
  if (!stripePromise) {
    stripePromise = loadStripe(
      stripeKey,
      medusaAccountId ? { stripeAccount: medusaAccountId } : undefined
    )
  }
  return stripePromise
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const stripe = isStripeLike(paymentSession?.provider_id) ? getStripe() : null

  if (isStripeLike(paymentSession?.provider_id) && paymentSession && stripe) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripe}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
