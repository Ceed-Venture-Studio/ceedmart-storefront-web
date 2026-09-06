import { HttpTypes } from "@medusajs/types"

import type { ListingPolicy, PolicyMap, PolicyTarget } from "@lib/data/listing-policy"

// Pure fulfilment-group logic (BRD §9.2, D-04).
//
// Lives here rather than in lib/data/preorder.ts because that file is a
// "use server" module, and Next.js requires every export of one to be an
// async function — a synchronous helper exported alongside server actions
// fails the build with "Server Actions must be async functions".
//
// Keeping the pure part separate is the right shape anyway: this is
// testable arithmetic with no I/O, and the server action that fetches
// policies is a thin wrapper over it.
//
// ── Why groups exist ────────────────────────────────────────────────────
// "Standard stock and US pre-orders may share a cart but must be separated
// into fulfilment groups." §6.4 adds that local items must not inherit the
// pre-order timeline. One checkout, two delivery promises — a single ETA
// over a mixed cart tells the customer either that their groceries take two
// weeks or that their imported laptop arrives tomorrow.

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


// ── Listing-policy helpers ──────────────────────────────────────────────
//
// Same reason as above: lib/data/listing-policy.ts is a "use server"
// module, so it may only export async functions. These two are pure.

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
