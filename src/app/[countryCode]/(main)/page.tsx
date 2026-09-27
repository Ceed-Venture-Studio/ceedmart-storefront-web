import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { getStoreMenu } from "@lib/data/menu"
import { getProductTagIdByValue } from "@lib/data/product-tags"
import { listCategories, subtreeCategoryIds } from "@lib/data/categories"
import {
  HOME_RAIL_LIMIT,
  FEATURED_PRODUCT_TAG,
  TECH_ROOT_CATEGORY_IDS,
  WHOLEFOODS_COLLECTION_IDS,
} from "@lib/data/store-config"
import BannerSlot from "@modules/banners/components/banner-slot"
import BulkHero from "@modules/home/components/bulk-hero"
import SectionGrid from "@modules/home/components/section-grid"
import BulkExplainer from "@modules/home/components/bulk-explainer"
import SolarFeature from "@modules/home/components/solar-feature"
import ProductCarousel from "@modules/home/components/product-carousel"
import { listListingPolicies } from "@lib/data/listing-policy"
import { targetsFromProducts } from "@lib/util/fulfilment-groups"

export const metadata: Metadata = {
  title: "CeedMart — Wholesale & Bulk Supply in Nigeria",
  description:
    "Buy foods, groceries, solar, power, CCTV and computer accessories in bulk. Unit prices drop as your order grows. Free delivery in Lagos & Port Harcourt.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Home(props: Props) {
  const { countryCode } = await props.params

  const [sections, region, cart, featuredTagId, categories] =
    await Promise.all([
      getStoreMenu(),
      getRegion(countryCode),
      retrieveCart().catch(() => null),
      getProductTagIdByValue(FEATURED_PRODUCT_TAG),
      listCategories().catch(() => []),
    ])

  // Three independent rails.
  //
  // New stock is split into Whole Foods and Technology, each newest-first —
  // `order` matters because the API defaults to oldest-first, which once
  // showed four-month-old stock under a "New in stock" heading.
  //
  // "Featured" is curated by tag and simply does not render when the tag is
  // unset, absent, or carries no live product.
  const newest = (filter: Record<string, string[]>) =>
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: HOME_RAIL_LIMIT, order: "-created_at", ...filter },
    }).catch(() => null)

  const [wholefoods, tech, featured] = await Promise.all([
    newest({ collection_id: WHOLEFOODS_COLLECTION_IDS }),
    newest({
      category_id: subtreeCategoryIds(categories, TECH_ROOT_CATEGORY_IDS),
    }),
    featuredTagId
      ? newest({ tag_id: [featuredTagId] })
      : Promise.resolve(null),
  ])

  const wholefoodsProducts = wholefoods?.response.products ?? []
  const techProducts = tech?.response.products ?? []
  const featuredProducts = featured?.response.products ?? []

  // All home rails in one lookup — the lists can overlap, and
  // listListingPolicies de-duplicates by variant id anyway.
  const railPolicies = await listListingPolicies(
    targetsFromProducts(
      [...wholefoodsProducts, ...techProducts, ...featuredProducts] as any
    )
  )

  // Side by side from `small` up. Each panel takes its share of the row, so
  // when one range has no new stock the other fills the width alone.
  const newStockPanels = [
    {
      title: "New in Whole Foods",
      href: "/store/wholefoods",
      products: wholefoodsProducts,
      panelClassName: "bg-wholefoods-bg border-wholefoods/20",
      titleClassName: "text-lg small:text-xl font-bold text-wholefoods-dark",
    },
    {
      title: "New in Technology",
      href: "/store",
      products: techProducts,
      panelClassName: "bg-grey-5 border-grey-15",
      titleClassName: "text-lg small:text-xl font-bold text-ceedmart-navy",
    },
  ].filter((panel) => panel.products.length > 0)

  return (
    <div className="w-full flex flex-col">
      <BulkHero />

      <div className="content-container flex flex-col gap-14 small:gap-20 py-12 small:py-20">
        {/* Merchandising slots retained so admin can still run campaigns
            without a deploy. Renders nothing when no banner is configured. */}
        <BannerSlot
          slot="home_secondary"
          limit={3}
          className="grid grid-cols-1 small:grid-cols-3 gap-4 w-full"
          itemClassName="block rounded-2xl overflow-hidden"
        />

        <SectionGrid sections={sections} />

        <BulkExplainer />

        {region && newStockPanels.length > 0 && (
          <div className="flex flex-col small:flex-row small:items-start gap-4">
            {newStockPanels.map((panel) => (
              <div
                key={panel.href}
                className={`flex-1 min-w-0 rounded-2xl border p-4 small:p-5 ${panel.panelClassName}`}
              >
                <ProductCarousel
                  title={panel.title}
                  titleClassName={panel.titleClassName}
                  href={panel.href}
                  linkLabel="View all"
                  products={panel.products}
                  region={region}
                  cartLineItems={cart?.items ?? []}
                  policies={railPolicies}
                  compact
                />
              </div>
            ))}
          </div>
        )}

        {region && featuredTagId && (
          <ProductCarousel
            title={FEATURED_PRODUCT_TAG}
            href={`/store?tag_id=${featuredTagId}`}
            linkLabel="View more"
            products={featuredProducts}
            region={region}
            cartLineItems={cart?.items ?? []}
            policies={railPolicies}
            compact
          />
        )}

        <SolarFeature />
      </div>
    </div>
  )
}
