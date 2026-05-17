import { listProductsWithSort } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import EmptyResults from "@modules/store/components/empty-results"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  q,
  categoryIds,
  collectionIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  q?: string
  categoryIds?: string[]
  collectionIds?: string[]
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  // Merge single + array forms. Single is used by category/collection
  // page templates; arrays come from the multi-select filter sidebar.
  const mergedCategoryIds = [
    ...(categoryId ? [categoryId] : []),
    ...(categoryIds ?? []),
  ]
  const mergedCollectionIds = [
    ...(collectionId ? [collectionId] : []),
    ...(collectionIds ?? []),
  ]

  if (mergedCollectionIds.length > 0) {
    queryParams["collection_id"] = mergedCollectionIds
  }

  if (mergedCategoryIds.length > 0) {
    queryParams["category_id"] = mergedCategoryIds
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (q) {
    queryParams["q"] = q
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (count === 0) {
    const { collections } = await listCollections({ limit: "10" }).catch(() => ({
      collections: [] as any[],
    }))
    return <EmptyResults query={q} collections={collections ?? []} />
  }

  const cart = await retrieveCart().catch(() => null)
  const cartLineItems = cart?.items ?? []

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview
                product={p}
                region={region}
                cartLineItems={cartLineItems}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
