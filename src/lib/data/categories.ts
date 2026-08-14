import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getGlobalCacheOptions } from "./cookies"

// Deliberately does NOT expand `*products`. Doing so inlines every product of
// every category: measured at 5.39 MB / 2.3s for the unfiltered call, versus
// 28 KB / 0.6s without it — and large enough to blow past Next's per-entry
// data-cache limit, so the response likely wasn't being cached at all. This
// call is made unfiltered in seven places, one of which is the footer (and so
// every page on the site). If you need per-category product counts, use
// `getCategoryProductCounts()` below rather than re-adding `*products`.
const CATEGORY_FIELDS =
  "*category_children, *parent_category, *parent_category.parent_category"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...getGlobalCacheOptions("categories"),
    revalidate: 60,
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields: CATEGORY_FIELDS,
          limit,
          ...query,
        },
        next,
      }
    )
    .then(({ product_categories }) => product_categories)
}

/**
 * Number of products filed directly on each category, keyed by category id.
 *
 * Counts are tallied from a single slim product fetch (~31 KB for the current
 * 323-product catalogue) instead of N per-category count queries or the old
 * `*products` expansion. Note these are *direct* assignments — a category's
 * subtree total is the sum of its own count and its descendants', because
 * Medusa does not roll counts up the tree.
 */
export const getCategoryProductCounts = async (): Promise<
  Record<string, number>
> => {
  const next = {
    ...getGlobalCacheOptions("products"),
    revalidate: 60,
  }

  const { products } = await sdk.client.fetch<{
    products: { id: string; categories?: { id: string }[] | null }[]
  }>("/store/products", {
    query: { limit: 1000, fields: "id,categories.id" },
    next,
  })

  const counts: Record<string, number> = {}
  for (const product of products) {
    for (const category of product.categories ?? []) {
      counts[category.id] = (counts[category.id] ?? 0) + 1
    }
  }

  return counts
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...getGlobalCacheOptions("categories"),
    revalidate: 60,
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
