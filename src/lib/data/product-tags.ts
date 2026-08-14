import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getGlobalCacheOptions } from "./cookies"

export const listProductTags = async (): Promise<
  HttpTypes.StoreProductTag[]
> => {
  const next = {
    ...getGlobalCacheOptions("product-tags"),
    revalidate: 60,
  }

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[] }>(
      "/store/product-tags",
      { query: { limit: 100 }, next }
    )
    .then(({ product_tags }) => product_tags ?? [])
    .catch(() => [])
}

/**
 * Resolves a human-readable tag value ("Featured") to its id.
 *
 * Config names the tag by value rather than id so merchandisers can set it
 * to something meaningful instead of an opaque ULID, and so recreating a tag
 * in admin doesn't silently break the homepage. Matching is
 * case-insensitive and whitespace-tolerant — admin-entered values drift.
 */
export const getProductTagIdByValue = async (
  value?: string | null
): Promise<string | null> => {
  if (!value?.trim()) return null

  const target = value.trim().toLowerCase()
  const tags = await listProductTags()

  return (
    tags.find((tag) => (tag.value ?? "").trim().toLowerCase() === target)?.id ??
    null
  )
}
