import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories, getCategoryByHandle } from "@lib/data/categories"
import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import {
  PATIO_FURNITURE_COLLECTION_HANDLE,
  PATIO_FURNITURE_CATEGORY_HANDLE,
} from "@lib/data/store-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SearchBar from "@modules/home/components/search-bar"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"
import PromoBanner from "@modules/home/components/promo-banner"

export const metadata: Metadata = {
  title: "Patio Furniture | CeedMart",
  description:
    "Rattan dining & sitting sets, swings and more — outdoor & patio furniture at wholesale & bulk pricing.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

async function resolveCollection() {
  try {
    return await getCollectionByHandle(PATIO_FURNITURE_COLLECTION_HANDLE)
  } catch {
    return null
  }
}

async function resolveCategory() {
  try {
    return await getCategoryByHandle([PATIO_FURNITURE_CATEGORY_HANDLE])
  } catch {
    return null
  }
}

export default async function PatioFurniturePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const { countryCode } = params

  const isSearching = !!q
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Prefer collection when present; fall back to category-by-handle. Either
  // can be populated in admin without a redeploy.
  const [collection, parentCategory] = await Promise.all([
    resolveCollection(),
    resolveCategory(),
  ])

  const productFilter: Record<string, any> = {}
  if (collection?.id) {
    productFilter.collection_id = [collection.id]
  } else if (parentCategory?.id) {
    productFilter.category_id = [parentCategory.id]
  }

  if (isSearching) {
    return (
      <div
        className="flex flex-col small:flex-row small:items-start py-6 content-container"
        data-testid="category-container"
      >
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <div className="mb-8 text-2xl-semi">
            <h1 data-testid="store-page-title">
              Search results for &ldquo;{q}&rdquo;
            </h1>
          </div>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              q={q}
              collectionId={collection?.id}
              categoryIds={parentCategory?.id ? [parentCategory.id] : undefined}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  const [subCategories, productsData, region, cart] = await Promise.all([
    parentCategory?.id
      ? listCategories({ parent_category_id: parentCategory.id })
      : Promise.resolve([] as any[]),
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: 12, ...productFilter },
    }),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
  ])

  const patioCategories = (subCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 bg-amber-50 min-h-screen">
      {/* Rattan / amber-themed header */}
      <div className="w-full bg-gradient-to-br from-amber-800 via-amber-600 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full" />
          <svg
            viewBox="0 0 200 200"
            fill="currentColor"
            className="absolute -bottom-6 -right-6 w-48 h-48 text-white/5"
          >
            <path d="M40 80h120v20H40v-20zm-10 40h140v60h-20v-40H60v40H30v-60z" />
          </svg>
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <path
                d="M7 9h18v3H7zm-1 5h20v9h-3v-6H9v6H6zm3 9h1v3H9zm13 0h1v3h-1z"
                fill="#FEF3C7"
                fillOpacity="0.9"
              />
            </svg>
            <span className="text-amber-100 text-sm font-semibold uppercase tracking-widest">
              Indoor & Outdoor
            </span>
          </div>
          <h1 className="text-white text-3xl small:text-5xl font-bold drop-shadow-sm">
            Patio Furniture
          </h1>
          <p className="text-white/85 text-base small:text-lg mt-3 max-w-lg">
            Rattan dining & sitting sets, swings and more — wholesale-priced
            outdoor & patio pieces for homes, resellers, and hospitality.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar buttonClassName="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-amber-800 text-white flex items-center justify-center hover:bg-amber-900 transition-colors" />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4">
        {patioCategories.length > 0 && (
          <CategoriesCarousel categories={patioCategories} />
        )}

        <div className="mt-4">
          <PromoBanner variant="furniture" />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-amber-900 mb-6 flex items-center gap-2">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-amber-700"
            >
              <path d="M4 6h12v2H4V6zm-1 4h14v6h-2v-4H5v4H3v-6zm2 6h1v2H5v-2zm9 0h1v2h-1v-2z" />
            </svg>
            All Patio Furniture
          </h2>
          <InfiniteProductGrid
            initialProducts={products}
            initialHasMore={hasMore}
            countryCode={countryCode}
            region={region}
            queryParams={productFilter}
            cartLineItems={cart?.items ?? []}
          />
        </section>
      </div>
    </div>
  )
}
