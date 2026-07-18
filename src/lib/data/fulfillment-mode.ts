"use server"

import { updateCart } from "./cart"

// Writes the Ceedmart order-categorization metadata to the current
// cart. On cart complete, Medusa carries cart.metadata into
// order.metadata, so this is the only place we need to persist —
// no separate order-update step required.
//
// Shape aligns with app/ceedmart/src/lib/order-categorization/types.ts
// on the backend. Kept as string literals here so this file has zero
// runtime dependency on the backend workspace.

export type FulfillmentMode = "pickup" | "delivery"

export const setFulfillmentMode = async (
  mode: FulfillmentMode,
  shopId: string | null
) => {
  const ceedmart: Record<string, unknown> = {
    channel: "online",
    fulfillment: mode,
    sourcing: "local",
  }
  if (mode === "pickup" && shopId) {
    ceedmart.store_id = shopId
  }
  return updateCart({
    metadata: {
      ceedmart,
    },
  } as any)
}
