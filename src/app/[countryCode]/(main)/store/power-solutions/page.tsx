import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import { POWER_SOLUTIONS_CATEGORY_ID } from "@lib/data/store-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SearchBar from "@modules/home/components/search-bar"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"
import PromoBannerCarousel from "@modules/banners/components/promo-banner-carousel"

export const metadata: Metadata = {
  title: "Power Solutions | CeedMart",
  description:
    "Inverters, power stations, inverter batteries and bundled solar packages for homes and businesses.",
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

export default async function PowerSolutionsStorePage(props: Params) {
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

  const [childCategories, region, cart] = await Promise.all([
    listCategories({ parent_category_id: POWER_SOLUTIONS_CATEGORY_ID }),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
  ])

  const powerCategories = (childCategories || []).map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  // Parent + children + grandchildren — `category_id` is an exact match on the
  // API, so a product filed only on "Solar Packages" would otherwise be lost.
  const powerProductFilter = {
    category_id: [
      POWER_SOLUTIONS_CATEGORY_ID,
      ...(childCategories || []).flatMap((c) => [
        c.id,
        ...(c.category_children ?? []).map((g) => g.id),
      ]),
    ],
  }

  const productsData = await listProducts({
    pageParam: 1,
    countryCode,
    queryParams: { limit: 12, ...powerProductFilter },
  })

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 bg-tech-bg min-h-screen">
      {/* Header — deep indigo/teal, adjacent to but distinct from the Solar
          page's gradient so the two sections read as siblings. */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-teal-800 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 border border-white/10 rounded-full" />
          <div className="absolute bottom-4 left-16 w-20 h-20 border border-white/10 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-white/10 rounded" />
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              {/* battery + bolt */}
              <rect
                x="4"
                y="9"
                width="21"
                height="14"
                rx="2"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M27 14h1.5v4H27z" fill="white" fillOpacity="0.85" />
              <path
                d="M15 11.5L11 17h3.5l-1 4 4.5-5.5H14.5l.5-4z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
            <span className="text-emerald-100 text-sm font-semibold uppercase tracking-widest">
              Always On
            </span>
          </div>
          <h1 className="text-white text-3xl small:text-5xl font-bold drop-shadow-sm">
            Power Solutions
          </h1>
          <p className="text-white/85 text-base small:text-lg mt-3 max-w-lg">
            Inverters, power stations and complete bundled packages to keep
            your home or business running.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4">
        <CategoriesCarousel categories={powerCategories} />

        <div className="mt-4">
          <PromoBannerCarousel />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-grey-90 mb-6">
            All Power Solutions
          </h2>
          <InfiniteProductGrid
            initialProducts={products}
            initialHasMore={hasMore}
            countryCode={countryCode}
            region={region}
            queryParams={powerProductFilter}
            cartLineItems={cart?.items ?? []}
          />
        </section>
      </div>
    </div>
  )
}
