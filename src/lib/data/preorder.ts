"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getCacheOptions } from "./cookies"
import { listListingPolicies, type PolicyMap } from "./listing-policy"

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

// ── Fulfilment groups (BRD §9.2, D-04) ──────────────────────────────────
//
// "Standard stock and US pre-orders may share a cart but must be separated
// into fulfilment groups." And §6.4: "the system must prevent locally
// stocked items from inheriting the pre-order delivery timeline."
//
// One checkout, two delivery promises. Presenting a single cart total with
// a single ETA would tell the customer their groceries arrive in two weeks,
// or their imported laptop tomorrow — both wrong, and the second is the
// kind of wrong that generates a refund.

export type FulfilmentGroupKind = "standard" | "preorder"

export type FulfilmentGroup = {
  kind: FulfilmentGroupKind
  title: string
  /** Plain-language delivery promise for this group. */
  timeline: string
  items: HttpTypes.StoreCartLineItem[]
  /** Longest pre-order window in the group, in days. Null for standard. */
  estimateDays: number | null
}

export type GroupedCart = {
  groups: FulfilmentGroup[]
  /** True when the cart mixes both kinds — the case §9.2 is written for. */
  isMixed: boolean
}

/**
 * Split cart lines into fulfilment groups.
 *
 * Grouping is driven by listing policy rather than anything on the line
 * item, so an item's commerce type cannot drift out of step with what the
 * catalogue says it is.
 */
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

/** Pure grouping, split out so it can be tested without a network call. */
export const groupItemsWithPolicies = (
  items: HttpTypes.StoreCartLineItem[],
  policies: PolicyMap
): GroupedCart => {
  const standard: HttpTypes.StoreCartLineItem[] = []
  const preorder: HttpTypes.StoreCartLineItem[] = []
  let longestWindow = 0

  for (const item of items) {
    const policy = item.variant_id ? policies[item.variant_id] : undefined

    if (policy?.commerce_type === "preorder") {
      preorder.push(item)
      const days = Number(
        (policy.config as Record<string, unknown> | null)?.estimate_days ?? 0
      )
      if (Number.isFinite(days) && days > longestWindow) longestWindow = days
    } else {
      standard.push(item)
    }
  }

  const groups: FulfilmentGroup[] = []

  if (standard.length) {
    groups.push({
      kind: "standard",
      title: "In stock",
      timeline: "Delivered from local stock",
      items: standard,
      estimateDays: null,
    })
  }

  if (preorder.length) {
    groups.push({
      kind: "preorder",
      title: "Pre-order from the US",
      // The group carries the SLOWEST item's window: a group promise has to
      // be true of every item in it, and quoting the fastest would make the
      // promise false for the rest.
      timeline: longestWindow
        ? `Arrives in about ${longestWindow} days`
        : "Arrives once sourced from the US",
      items: preorder,
      estimateDays: longestWindow || null,
    })
  }

  return {
    groups,
    isMixed: standard.length > 0 && preorder.length > 0,
  }
}

/** Whether a cart contains any pre-order line — drives whether checkout
 *  asks for pre-order terms acceptance. */
export const cartHasPreorder = (grouped: GroupedCart): boolean =>
  grouped.groups.some((g) => g.kind === "preorder")
