"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

// Commerce-type lookup for the storefront (BRD §5.1).
//
// Kept separate from the product payload on purpose: product responses are
// cached with tag-based revalidation on a long window, and a listing that
// flips to "auction" must stop being sold as ordinary stock immediately —
// not whenever the product tag next busts. This is a small, separately
// cached call.
//
// Standard listings are omitted from the response entirely, so an absent
// entry means "standard" and the common case costs nothing.

export type CommerceType = "standard" | "preorder" | "custom_build" | "auction"

export type ListingPolicy = {
  commerce_type: CommerceType
  is_active: boolean
  label: string
  reference_id: string | null
  config: Record<string, unknown> | null
}

export type PolicyMap = Record<string, ListingPolicy>

export type PolicyTarget = { variantId: string; productId: string }

const MAX_TARGETS = 100

/**
 * Fetch policies for a batch of variants.
 *
 * Returns an empty map on any failure — a lookup outage must not blank the
 * catalogue. The cart is where eligibility is actually enforced (server
 * side), so a missing badge is cosmetic; a missing product listing is not.
 */
export const listListingPolicies = async (
  targets: PolicyTarget[]
): Promise<PolicyMap> => {
  const unique = new Map<string, PolicyTarget>()
  for (const t of targets) {
    if (t?.variantId && t?.productId) unique.set(t.variantId, t)
  }
  if (!unique.size) return {}

  const slice = Array.from(unique.values()).slice(0, MAX_TARGETS)
  const query = slice.map((t) => `${t.variantId}:${t.productId}`).join(",")

  const next = {
    ...(await getCacheOptions("listing-policies")),
  }

  return await sdk.client
    .fetch<{ policies: PolicyMap }>("/store/listing-policies", {
      method: "GET",
      query: { targets: query },
      next,
      cache: "force-cache",
    })
    .then((res) => res.policies ?? {})
    .catch(() => ({}))
}

/** Collect every variant/product pair from a list of products. */
export const targetsFromProducts = (
  products: { id: string; variants?: { id: string }[] | null }[]
): PolicyTarget[] =>
  products.flatMap((p) =>
    (p.variants ?? []).map((v) => ({ variantId: v.id, productId: p.id }))
  )

/** The policy governing a product, given a map keyed by variant id.
 *  A product is non-standard if any of its variants is. */
export const policyForProduct = (
  product: { id: string; variants?: { id: string }[] | null },
  policies: PolicyMap
): ListingPolicy | null => {
  for (const variant of product.variants ?? []) {
    const policy = policies[variant.id]
    if (policy) return policy
  }
  return null
}
