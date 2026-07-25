import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import {
  CCTV_COLLECTION_IDS,
  CCTV_CATEGORY_IDS,
  CCTV_CATEGORY_HANDLES,
} from "@lib/data/store-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SearchBar from "@modules/home/components/search-bar"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"
import PromoBannerCarousel from "@modules/banners/components/promo-banner-carousel"

export const metadata: Metadata = {
  title: "CCTV & Access Control | CeedMart",
  description:
    "CCTV cameras, DVRs, biometric readers and access-control systems. Keep your home or business safe at great prices on CeedMart.",
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

const cctvProductFilter = {
  collection_id: CCTV_COLLECTION_IDS,
}

export default async function CctvAccessControlStorePage(props: Params) {
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
            />
          </Suspense>
        </div>
      </div>
    )
  }

  const [categories, productsData, region, cart] = await Promise.all([
    listCategories(),
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: 12, ...cctvProductFilter },
    }),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
  ])

  const cctvCategories = (categories || [])
    .filter(
      (c) =>
        !c.parent_category &&
        (CCTV_CATEGORY_IDS.includes(c.id) ||
          CCTV_CATEGORY_HANDLES.includes(c.handle ?? ""))
    )
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
    }))

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 min-h-screen">
      {/* Header — Ceedmart gold, navy text (matches the home card) */}
      <div className="w-full bg-gradient-to-br from-yellow-500 via-ceedmart-gold to-amber-300 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 border border-ceedmart-navy/10 rounded-full" />
          <div className="absolute bottom-4 left-16 w-20 h-20 border border-ceedmart-navy/10 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-ceedmart-navy/10 rounded" />
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              {/* Dome camera */}
              <path
                d="M6 14a10 10 0 0 1 20 0v3H6v-3z"
                stroke="#05007F"
                strokeWidth="1.6"
                fill="#05007F"
                fillOpacity="0.1"
              />
              <circle cx="16" cy="13" r="2.5" fill="#05007F" />
              <path
                d="M7 17h18v3H7zm4 3h10l-1.5 8h-7L11 20z"
                fill="#05007F"
                fillOpacity="0.85"
              />
            </svg>
            <span className="text-ceedmart-navy text-sm font-semibold uppercase tracking-widest">
              Watch & Protect
            </span>
          </div>
          <h1 className="text-ceedmart-navy text-3xl small:text-5xl font-bold drop-shadow-sm">
            CCTV & Access Control
          </h1>
          <p className="text-ceedmart-navy/80 text-base small:text-lg mt-3 max-w-lg">
            Cameras, DVRs, biometric readers and access-control systems.
            Keep your home or business safe.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4 bg-white">
        <CategoriesCarousel categories={cctvCategories} />

        <div className="mt-4">
          <PromoBannerCarousel />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-grey-90 mb-6">
            All CCTV & Access Control
          </h2>
          <InfiniteProductGrid
            initialProducts={products}
            initialHasMore={hasMore}
            countryCode={countryCode}
            region={region}
            queryParams={cctvProductFilter}
            cartLineItems={cart?.items ?? []}
          />
        </section>
      </div>
    </div>
  )
}
