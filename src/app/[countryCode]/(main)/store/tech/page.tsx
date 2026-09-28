import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories, subtreeCategoryIds } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import { TECH_ROOT_CATEGORY_IDS } from "@lib/data/store-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SearchBar from "@modules/home/components/search-bar"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"
import { listListingPolicies } from "@lib/data/listing-policy"
import { targetsFromProducts } from "@lib/util/fulfilment-groups"
import PromoBannerCarousel from "@modules/banners/components/promo-banner-carousel"

// Technology — everything in Solar Energy, Power Solutions, CCTV & Security
// and Computer & Accessories on one page. It is where the home page's "New
// in Technology" panel sends "View all", so it uses the same filter: the
// four category roots plus every descendant.
//
// Deliberately NOT sorted newest-first like the panel. Most of the catalogue
// was bulk-imported and shares a handful of created_at values, so paging on
// that sort repeats some products and skips others (the API accepts no
// tiebreaker). The default order pages cleanly.
//
// This route used to redirect to /store/solar-energy-power; old links
// (including the footer's) now land here instead.

export const metadata: Metadata = {
  title: "Technology | CeedMart",
  description:
    "Solar systems, inverters and batteries, CCTV and access control, laptops and computer accessories at CeedMart.",
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

export default async function TechnologyStorePage(props: Params) {
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

  const [categories, region, cart] = await Promise.all([
    listCategories().catch(() => []),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
  ])

  // Carousel: the four ranges themselves, in config order.
  const techCategories = TECH_ROOT_CATEGORY_IDS.map((id) =>
    categories.find((c) => c.id === id)
  )
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => ({ id: c.id, name: c.name, handle: c.handle }))

  const techProductFilter = {
    category_id: subtreeCategoryIds(categories, TECH_ROOT_CATEGORY_IDS),
  }

  const productsData = await listProducts({
    pageParam: 1,
    countryCode,
    queryParams: { limit: 12, ...techProductFilter },
  })

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  // Commerce type for the first page, resolved server-side so a pre-order is
  // badged in the initial HTML. Later pages fetch their own inside the grid.
  const initialPolicies = await listListingPolicies(
    targetsFromProducts(products as any)
  )

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 min-h-screen">
      {/* Header — the tech palette, as on the Solar Energy & Power card */}
      <div className="w-full bg-gradient-to-br from-tech-dark via-tech to-ceedmart-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 border border-white/10 rounded-full" />
          <div className="absolute bottom-4 left-16 w-20 h-20 border border-white/10 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-white/10 rounded" />
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              {/* Chip */}
              <rect x="9" y="9" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
              <rect x="13" y="13" width="6" height="6" rx="1" fill="white" fillOpacity="0.85" />
              <path
                d="M13 5v4M19 5v4M13 23v4M19 23v4M5 13h4M5 19h4M23 13h4M23 19h4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">
              Solar · Power · Security · IT
            </span>
          </div>
          <h1 className="text-white text-3xl small:text-5xl font-bold drop-shadow-sm">
            Technology
          </h1>
          <p className="text-white/80 text-base small:text-lg mt-3 max-w-lg">
            Solar systems, inverters and batteries, CCTV and access control,
            laptops and computer accessories — all in one place.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4 bg-white">
        <CategoriesCarousel categories={techCategories} />

        <div className="mt-4">
          <PromoBannerCarousel />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-grey-90 mb-6">
            All Technology
          </h2>
          <InfiniteProductGrid
            initialPolicies={initialPolicies}
            initialProducts={products}
            initialHasMore={hasMore}
            countryCode={countryCode}
            region={region}
            queryParams={techProductFilter}
            cartLineItems={cart?.items ?? []}
          />
        </section>
      </div>
    </div>
  )
}
