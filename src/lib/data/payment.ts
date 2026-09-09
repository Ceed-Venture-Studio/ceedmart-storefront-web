"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions, getCartId } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}

export type PulsePaymentOption = {
  provider: string
  displayName: string
  isLive: boolean
}

/**
 * The gateways this shop can actually charge with.
 *
 * Medusa's payment-providers list has one row for Pulse; the real choice —
 * Paystack, Monnify — sits a level down in whatever the tenant has
 * configured on the Pulse dashboard, and changes without a deploy. So the
 * labels come from Pulse rather than a map here, which would go stale the
 * moment a gateway is added.
 *
 * Never throws. Checkout must still render if this call fails; the caller
 * falls back to a single unnamed option rather than an empty payment step.
 */
export const listPulsePaymentOptions = async (): Promise<{
  options: PulsePaymentOption[]
  reason: string | null
}> => {
  const headers = { ...(await getAuthHeaders()) }

  return sdk.client
    .fetch<{ options: PulsePaymentOption[]; reason: string | null }>(
      "/store/payment-options",
      { method: "GET", headers, cache: "no-store" }
    )
    .catch(() => ({ options: [], reason: "unavailable" }))
}

/**
 * The live status of the cart's payment session.
 *
 * Deliberately NOT retrieveCart: that is force-cached against a tag, so a
 * poll built on it returns the same answer forever — and its default field
 * set does not include payment_collection at all, so the status would be
 * undefined even uncached. Both were true of the first version of this and
 * are exactly why the confirm button never came back to life.
 *
 * Returns null when there is nothing to report, which the caller reads as
 * "not confirmed yet" rather than as an error.
 */
export const getCartPaymentStatus = async (): Promise<string | null> => {
  const cartId = await getCartId()
  if (!cartId) {
    return null
  }

  const headers = { ...(await getAuthHeaders()) }

  return sdk.client
    .fetch<{ cart: any }>(`/store/carts/${cartId}`, {
      method: "GET",
      query: {
        fields:
          "id,*payment_collection,*payment_collection.payment_sessions",
      },
      headers,
      cache: "no-store",
    })
    .then(({ cart }) => {
      const sessions = cart?.payment_collection?.payment_sessions ?? []
      // The most recently created session is the one in play: starting a
      // fresh payment leaves the older ones behind.
      const latest = sessions[sessions.length - 1]
      return latest?.status ?? null
    })
    .catch(() => null)
}

/**
 * Has this cart actually been paid for, according to Pulse?
 *
 * Distinct from getCartPaymentStatus, which reports what OUR session says.
 * A session reads `pending` until confirmation arrives, so during that
 * window our record and the truth disagree — and that is precisely the
 * window in which someone taps back into the payment step.
 *
 * `paid: false` with reason "unknown" means we could not reach Pulse. It is
 * NOT permission to discard a session; the caller must fail safe.
 */
export const isCartPaid = async (): Promise<{
  paid: boolean
  reason: string | null
}> => {
  const cartId = await getCartId()
  if (!cartId) {
    return { paid: false, reason: "no_cart" }
  }

  const headers = { ...(await getAuthHeaders()) }

  return sdk.client
    .fetch<{ paid: boolean; reason: string | null }>(
      `/store/carts/${cartId}/payment-status`,
      { method: "GET", headers, cache: "no-store" }
    )
    .catch(() => ({ paid: false, reason: "unknown" }))
}
