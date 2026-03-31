import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import {
  WHOLEFOODS_COLLECTION_IDS,
  WHOLEFOODS_CATEGORY_ID,
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
  title: "Whole Foods | CeedMart",
  description:
    "Wholesale fresh groceries, organic produce & bulk food supplies at CeedMart.",
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

const wholefoodsProductFilter = {
  collection_id: WHOLEFOODS_COLLECTION_IDS,
}

export default async function WholeFoodsPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const { countryCode } = params

  const isSearching = !!q
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

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
              collectionId={WHOLEFOODS_COLLECTION_IDS[0]}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  const [categories, productsData, region] = await Promise.all([
    listCategories({ parent_category_id: WHOLEFOODS_CATEGORY_ID }),
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: 12, ...wholefoodsProductFilter },
    }),
    getRegion(countryCode),
  ])

  const wholefoodsCategories = (categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 bg-wholefoods-bg min-h-screen">
      {/* Nature-themed Header */}
      <div className="w-full bg-gradient-to-br from-wholefoods-dark via-wholefoods to-wholefoods-accent relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full" />
          <svg
            viewBox="0 0 200 200"
            fill="currentColor"
            className="absolute -bottom-6 -right-6 w-48 h-48 text-white/5"
          >
            <path d="M100 20c0 0-60 24-60 96 0 36 24 54 42 60 6-24 18-42 18-42s12 18 18 42c18-6 42-24 42-60C160 44 100 20 100 20z" />
          </svg>
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <path
                d="M16 4c0 0-10 4-10 16 0 6 4 9 7 10 1-4 3-7 3-7s2 3 3 7c3-1 7-4 7-10C26 8 16 4 16 4z"
                fill="#BBF7D0"
                fillOpacity="0.7"
              />
              <path
                d="M16 10v14M16 14c-2-1-4 0-5 2M16 18c2-1 4 0 5 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-wholefoods-light text-sm font-semibold uppercase tracking-widest">
              Fresh & Organic
            </span>
          </div>
          <h1 className="text-white text-3xl small:text-5xl font-bold drop-shadow-sm">
            Whole Foods
          </h1>
          <p className="text-white/80 text-base small:text-lg mt-3 max-w-lg">
            Wholesale fresh groceries, organic produce & bulk food supplies — direct pricing for businesses and bulk buyers.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar buttonClassName="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-wholefoods text-white flex items-center justify-center hover:bg-wholefoods-dark transition-colors" />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4">
        <CategoriesCarousel categories={wholefoodsCategories} />

        <div className="mt-4">
          <PromoBanner variant="wholefoods" />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-wholefoods-dark mb-6 flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-wholefoods">
              <path d="M10 2c0 0-6 2.4-6 9.6 0 3.6 2.4 5.4 4.2 6 .6-2.4 1.8-4.2 1.8-4.2s1.2 1.8 1.8 4.2c1.8-.6 4.2-2.4 4.2-6C16 4.4 10 2 10 2z" />
            </svg>
            All Whole Foods
          </h2>
          <InfiniteProductGrid
            initialProducts={products}
            initialHasMore={hasMore}
            countryCode={countryCode}
            region={region}
            queryParams={wholefoodsProductFilter}
          />
        </section>
      </div>
    </div>
  )
}
