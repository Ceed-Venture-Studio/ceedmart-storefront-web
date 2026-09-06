"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getCacheOptions } from "./cookies"
import { listListingPolicies } from "./listing-policy"
import {
  groupItemsWithPolicies,
  type GroupedCart,
} from "@lib/util/fulfilment-groups"

// US pre-order data for the storefront (BRD §6.3, §6.4, §9.2).

export type PreorderOffer = {
  id: string
  product_id: string | null
  variant_id: string | null
  price: number
  currency_code: string
  price_is_final: boolean
  estimate_days: number
  estimated_delivery_date: string
  estimate_breakdown: {
    procurement_days: number
    transit_days: number
    customs_days: number
  }
  includes: string[]
  excludes: string[]
  source_country_code: string
  condition: string
  condition_notes: string | null
  warranty_text: string | null
  warranty_provider: string | null
  return_policy_text: string | null
  max_per_order: number | null
  offer_expires_at: string | null
  delivers_to_state: boolean
  delivery_states: string[]
  available: boolean
  unavailable_reason: string | null
  terms: { version_id: string; version: number; body: string } | null
}

/**
 * Fetch a pre-order offer, optionally for a specific Nigerian state.
 *
 * `state` matters: §6.3 requires the product page show an estimated delivery
 * date calculated for the customer's chosen location, and an offer may not
 * cover every state yet.
 *
 * Not cached — the estimate is date-relative and the availability window can
 * close at any time. Serving a stale "arrives by the 19th" is worse than one
 * extra request.
 */
export const getPreorderOffer = async (
  offerId: string,
  state?: string | null
): Promise<PreorderOffer | null> => {
  return await sdk.client
    .fetch<{ preorder: PreorderOffer }>(`/store/preorders/${offerId}`, {
      method: "GET",
      query: state ? { state } : undefined,
      cache: "no-store",
    })
    .then((res) => res.preorder ?? null)
    .catch(() => null)
}

export const groupCartByFulfilment = async (
  cart: HttpTypes.StoreCart | null | undefined
): Promise<GroupedCart> => {
  const items = (cart?.items ?? []) as HttpTypes.StoreCartLineItem[]

  if (!items.length) {
    return { groups: [], isMixed: false }
  }

  const policies = await listListingPolicies(
    items
      .filter((i) => i.variant_id && i.product_id)
      .map((i) => ({
        variantId: i.variant_id as string,
        productId: i.product_id as string,
      }))
  )

  return groupItemsWithPolicies(items, policies)
}


export type PreorderListItem = {
  id: string
  product_id: string | null
  variant_id: string | null
  title: string
  handle: string | null
  thumbnail: string | null
  variant_title: string | null
  price: number
  currency_code: string
  price_is_final: boolean
  estimate_days: number
  estimated_delivery_date: string
  includes: string[]
  excludes: string[]
  source_country_code: string
  condition: string
  warranty_text: string | null
  offer_expires_at: string | null
  available: boolean
  unavailable_reason: string | null
}

/**
 * List active US pre-order offers.
 *
 * `state` matters: §6.3 wants the estimate computed for the customer's
 * location, and an offer may not cover every state yet.
 *
 * Not cached on our side — the delivery estimate is relative to today and
 * an offer's availability window can close at any time. A stale "arrives by
 * the 19th" is worse than one extra request.
 */
export const listPreorderOffers = async (
  state?: string | null
): Promise<PreorderListItem[]> => {
  return await sdk.client
    .fetch<{ preorders: PreorderListItem[] }>("/store/preorders", {
      method: "GET",
      query: state ? { state } : undefined,
      cache: "no-store",
    })
    .then((res) => res.preorders ?? [])
    .catch(() => [])
}
