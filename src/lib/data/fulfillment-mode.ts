"use server"

import { retrieveCart, updateCart } from "./cart"
import { mergeCeedmartMetadata } from "./ceedmart-metadata"

// Writes the Ceedmart order-categorization metadata to the current cart. On
// cart complete, Medusa carries cart.metadata into order.metadata, so this is
// the only place we need to persist — no separate order-update step required.
//
// Shape aligns with app/ceedmart/src/lib/order-categorization/types.ts on the
// backend, mirrored locally in ./ceedmart-metadata so this file has zero
// runtime dependency on the backend workspace.
//
// This used to build a fresh `ceedmart` object and assign it wholesale, which
// deleted the partner_code stamped earlier by attachPartnerCodeIfPresent in
// ./cart.ts — silently breaking partner commission accrual for any order
// where the shopper touched the pickup/delivery picker. It now reads the
// current cart and patches only its own keys.

export type FulfillmentMode = "pickup" | "delivery"

export const setFulfillmentMode = async (
  mode: FulfillmentMode,
  shopId: string | null
) => {
  const cart = await retrieveCart()

  return updateCart({
    metadata: mergeCeedmartMetadata(cart?.metadata, {
      channel: "online",
      fulfillment: mode,
      sourcing: "local",
      // Clear the shop when switching back to delivery so a stale pickup
      // location never rides along on a delivery order.
      store_id: mode === "pickup" && shopId ? shopId : null,
    }),
  } as any)
}
