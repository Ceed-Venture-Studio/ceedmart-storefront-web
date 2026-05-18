import { Metadata } from "next"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import {
  TECH_COLLECTION_IDS,
  TECH_COLLECTION_HANDLES,
  TECH_CATEGORY_IDS,
  TECH_CATEGORY_HANDLES,
} from "@lib/data/store-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SearchBar from "@modules/home/components/search-bar"
import CollectionsRichGrid from "@modules/home/components/collections-rich-grid"
import CategoriesCarousel from "@modules/home/components/categories-carousel"
import InfiniteProductGrid from "@modules/home/components/infinite-product-grid"
import PromoBanner from "@modules/home/components/promo-banner"

export const metadata: Metadata = {
  title: "Solar Power & Security | CeedMart",
  description:
    "Solar systems, inverters, batteries and CCTV security — quality power and security solutions at great prices on CeedMart.",
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

const techProductFilter = {
  collection_id: TECH_COLLECTION_IDS,
}

export default async function TechStorePage(props: Params) {
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

  const [categories, collectionsData, productsData, region, cart] =
    await Promise.all([
      listCategories(),
      // Explicit product fields — "*products" alone doesn't return thumbnails
      // or images, which the collection card collage falls back to.
      listCollections({
        fields:
          "id,title,handle,products.id,products.title,products.thumbnail,products.images.url",
      }),
      listProducts({
        pageParam: 1,
        countryCode,
        queryParams: { limit: 12, ...techProductFilter },
      }),
      getRegion(countryCode),
      retrieveCart().catch(() => null),
    ])

  // Filter to tech top-level categories by id, plus any extras matched by
  // handle (lets admin publish e.g. "solar-power-packages" without a code change).
  const techCategories = (categories || [])
    .filter(
      (c) =>
        !c.parent_category &&
        (TECH_CATEGORY_IDS.includes(c.id) ||
          TECH_CATEGORY_HANDLES.includes(c.handle ?? ""))
    )
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
    }))

  // Filter to tech-related collections by id, plus any extras matched by
  // handle (lets admin publish e.g. "solar-packages" without a code change).
  const techCollections = (collectionsData?.collections || []).filter(
    (c) =>
      TECH_COLLECTION_IDS.includes(c.id) ||
      TECH_COLLECTION_HANDLES.includes(c.handle ?? "")
  )

  const { products } = productsData.response
  const hasMore = productsData.nextPage !== null

  if (!region) return null

  return (
    <div className="flex flex-col gap-0 bg-tech-bg min-h-screen">
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-tech via-tech-dark to-ceedmart-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 border border-white/10 rounded-full" />
          <div className="absolute bottom-4 left-16 w-20 h-20 border border-white/10 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-white/10 rounded" />
        </div>

        <div className="content-container relative py-10 small:py-14">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <rect x="6" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5" />
              <rect x="8" y="6" width="16" height="12" rx="1" fill="#15A6FF" fillOpacity="0.3" />
              <line x1="12" y1="22" x2="20" y2="22" stroke="white" strokeWidth="1.5" />
              <line x1="10" y1="24" x2="22" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-tech-light text-sm font-semibold uppercase tracking-widest">
              Power & Security
            </span>
          </div>
          <h1 className="text-white text-3xl small:text-5xl font-bold drop-shadow-sm">
            Solar Power & Security
          </h1>
          <p className="text-white/80 text-base small:text-lg mt-3 max-w-lg">
            Power your home or business and keep it safe. Solar systems,
            inverters, batteries and CCTV — quality kit at great prices.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="content-container py-6 flex flex-col gap-4">
        <CollectionsRichGrid collections={techCollections} limit={6} />

        <CategoriesCarousel categories={techCategories} />

        <div className="mt-4">
          <PromoBanner variant="tech" />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-grey-90 mb-6">
            All Solar Power & Security
          </h2>
          <InfiniteProductGrid
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
