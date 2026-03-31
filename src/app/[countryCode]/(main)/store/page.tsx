import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import AdBanner from "@modules/home/components/ad-banner"
import SearchBar from "@modules/home/components/search-bar"
import CollectionsCarousel from "@modules/home/components/collections-carousel"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"

export const metadata: Metadata = {
  title: "Store | CeedMart",
  description: "Browse wholesale products and place bulk orders at CeedMart.",
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

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const { countryCode } = params

  const isSearching = !!q
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // When searching, show filtered results with pagination
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
            />
          </Suspense>
        </div>
      </div>
    )
  }

  // Default store view: rich browsing experience
  const [categories, collectionsData, productsData, region] =
    await Promise.all([
      listCategories(),
      listCollections({ fields: "*products" }),
      listProducts({
        pageParam: 1,
        countryCode,
        queryParams: { limit: 12 },
      }),
      getRegion(countryCode),
    ])

  const topLevelCategories = (categories || [])
    .filter((c) => !c.parent_category)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
    }))

  const collections = collectionsData?.collections || []
  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="content-container py-6 flex flex-col gap-2">
      <AdBanner />

      <div className="my-4">
        <SearchBar />
      </div>

      <CollectionsCarousel collections={collections} />

      <CategoriesCarousel categories={topLevelCategories} />

      <section className="mt-8">
        <h2 className="text-lg font-bold text-grey-90 mb-6">All Products</h2>
        <InfiniteProductGrid
          initialProducts={products}
          initialHasMore={hasMore}
          countryCode={countryCode}
          region={region}
        />
      </section>
    </div>
  )
}
