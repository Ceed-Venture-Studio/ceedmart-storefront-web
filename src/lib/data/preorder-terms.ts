"use server"

import { retrieveCart, updateCart } from "./cart"
import { mergeCeedmartMetadata } from "./ceedmart-metadata"

// Pre-order terms acceptance at checkout (BRD §6.4, §6.6).
//
// "Customer-visible terms must be accepted at checkout and versioned
// against the order", and §6.6 makes acceptance a precondition of payment.
//
// The accepted VERSION id is stamped onto cart metadata, which Medusa
// carries into order.metadata on complete. The capture subscriber then
// records a formal TermsAcceptance row against the order. Two places, on
// purpose: the metadata stamp is what checkout gates on, the acceptance row
// is the durable evidence.
//
// The version comes from the server, never from the client — a customer
// cannot claim to have accepted a version we never published, and cannot be
// held to one they were never shown.

export const acceptPreorderTerms = async (versionId: string) => {
  const trimmed = versionId?.trim()
  if (!trimmed) {
    throw new Error("A terms version is required to accept pre-order terms")
  }

  const cart = await retrieveCart()
  if (!cart) {
    throw new Error("No cart found")
  }

  return updateCart({
    metadata: mergeCeedmartMetadata(cart.metadata, {
      terms_version_id: trimmed,
    }),
  } as any)
}

/** Withdraw acceptance — used when the customer unticks the box before
 *  paying, so a stale acceptance cannot ride along on the order. */
export const withdrawPreorderTerms = async () => {
  const cart = await retrieveCart()
  if (!cart) return null

  return updateCart({
    metadata: mergeCeedmartMetadata(cart.metadata, {
      terms_version_id: null,
    }),
  } as any)
}
