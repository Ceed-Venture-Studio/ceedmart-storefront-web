import { HttpTypes } from "@medusajs/types"

// Storefront-side mirror of the backend's shared metadata contract at
// app/ceedmart/src/lib/order-categorization/types.ts. Kept as a standalone
// copy because the storefront is a separate repository with no dependency on
// the backend workspace — keep the two in step when either changes.
//
// ── Why this exists ─────────────────────────────────────────────────────
// `cart.metadata.ceedmart` (carried into `order.metadata` on complete) is a
// SHARED bag with several independent writers:
//
//   • attribution     — partner_code, stamped on cart resolve
//   • categorization  — channel / store_id / fulfillment / sourcing, written
//                       when the shopper picks pickup vs delivery
//   • commerce        — commerce_type, terms_version_id (Phase 3)
//
// Each writer knows only its own slice. Composing a fresh `ceedmart` object
// and assigning it wholesale silently deletes the others. That is precisely
// what setFulfillmentMode used to do: it rebuilt the block from scratch at
// checkout, dropping the partner_code stamped earlier, so partner commission
// accrued nothing for any order where the shopper touched the picker.
//
// Never assign `metadata.ceedmart` directly. Always merge through the helper
// below.

export type OrderChannel = "online" | "in-store"
export type OrderFulfillment = "pickup" | "delivery"
export type OrderSourcing = "local" | "cross-warehouse"
export type CommerceType = "standard" | "preorder" | "custom_build" | "auction"

export type CeedmartMetadata = {
  channel?: OrderChannel
  store_id?: string
  fulfillment?: OrderFulfillment
  sourcing?: OrderSourcing
  partner_code?: string
  commerce_type?: CommerceType
  terms_version_id?: string
}

/** Patch shape for ceedmartMetadata merges: every field optional, and
 *  explicitly nullable so a caller can clear a key it previously set. */
export type CeedmartMetadataPatch = {
  [K in keyof CeedmartMetadata]?: CeedmartMetadata[K] | null
}

export const CEEDMART_METADATA_KEY = "ceedmart"

/**
 * Merge a partial Ceedmart block into an existing metadata object.
 *
 * Preserves unrelated top-level keys and the keys other writers have already
 * set inside `ceedmart`. `undefined` leaves a field untouched; `null` clears
 * it explicitly.
 */
export const mergeCeedmartMetadata = (
  existing: Record<string, unknown> | null | undefined,
  patch: CeedmartMetadataPatch
): Record<string, unknown> => {
  const base = existing ?? {}
  const current = (base[CEEDMART_METADATA_KEY] ?? {}) as Record<string, unknown>

  const next: Record<string, unknown> = { ...current }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    if (value === null) {
      delete next[key]
      continue
    }
    next[key] = value
  }

  return { ...base, [CEEDMART_METADATA_KEY]: next }
}

/** Read the Ceedmart block off a cart or order. */
export const readCeedmartMetadata = (
  entity: { metadata?: Record<string, unknown> | null } | null | undefined
): CeedmartMetadata => {
  return ((entity?.metadata ?? {})[CEEDMART_METADATA_KEY] ??
    {}) as CeedmartMetadata
}

/** Commerce type with the "absent means standard" default applied. */
export const resolveCommerceType = (
  entity: { metadata?: Record<string, unknown> | null } | null | undefined
): CommerceType => {
  return readCeedmartMetadata(entity).commerce_type ?? "standard"
}

/** Narrowing helper for the cart type, which types metadata loosely. */
export const readCartCeedmart = (
  cart: HttpTypes.StoreCart | null | undefined
): CeedmartMetadata => readCeedmartMetadata(cart as any)
