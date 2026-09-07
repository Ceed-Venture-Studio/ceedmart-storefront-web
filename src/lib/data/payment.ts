"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
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
