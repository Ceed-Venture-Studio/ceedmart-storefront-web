import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listPulsePaymentOptions } from "@lib/data/payment"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  // Can this shopper actually pay online?
  //
  // Resolved here, on the server, rather than in the summary: the answer
  // decides which button is the primary action, and fetching it in the
  // client would render "Go to checkout" first and swap it for WhatsApp a
  // moment later — right as someone is reaching for it.
  const { options, reason } = await listPulsePaymentOptions()

  // A guest has no Pulse identity yet, so an empty list tells us nothing
  // about them — they may well have gateways once they sign in, and
  // checkout is where that happens. Only withdraw checkout when we KNOW
  // online payment is out: nothing configured, Pulse unreachable, or a
  // signed-in customer whose Pulse identity is missing.
  const canPayOnline = options.length > 0 || reason === "not_signed_in"

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      canPayOnline={canPayOnline}
    />
  )
}
