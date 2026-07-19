"use server"

import { sdk } from "@lib/config"

export type TrackedOrder = {
  id: string
  display_id: number
  status: string
  payment_status: string
  fulfillment_status: string
  currency_code: string
  total: number
  item_count: number
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
}

export type TrackOrderResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; error: string }

export const trackOrder = async (
  ref: string,
  contact: string
): Promise<TrackOrderResult> => {
  try {
    const { order } = await sdk.client.fetch<{ order: TrackedOrder }>(
      "/store/orders/track",
      {
        method: "GET",
        query: { ref, contact },
        // Never cache — a customer refreshing after an update should see it.
        cache: "no-store",
      }
    )
    return { ok: true, order }
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status
    if (status === 429) {
      return {
        ok: false,
        error: "Too many tracking attempts. Try again in a minute.",
      }
    }
    return {
      ok: false,
      error: "No matching order. Check the order number and contact details.",
    }
  }
}
