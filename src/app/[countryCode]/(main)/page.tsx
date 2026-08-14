import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { getStoreMenu } from "@lib/data/menu"
import { getProductTagIdByValue } from "@lib/data/product-tags"
import {
  HOME_RAIL_LIMIT,
  FEATURED_PRODUCT_TAG,
} from "@lib/data/store-config"
import BannerSlot from "@modules/banners/components/banner-slot"
import BulkHero from "@modules/home/components/bulk-hero"
import SectionGrid from "@modules/home/components/section-grid"
import BulkExplainer from "@modules/home/components/bulk-explainer"
import SolarFeature from "@modules/home/components/solar-feature"
import ProductCarousel from "@modules/home/components/product-carousel"

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

  const [sections, region, cart, featuredTagId] = await Promise.all([
    getStoreMenu(),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
    getProductTagIdByValue(FEATURED_PRODUCT_TAG),
  ])

  // Two independent rails.
  //
  // "New in stock" is always newest-first — `order` matters because the API
  // defaults to oldest-first, which previously showed four-month-old stock
  // under a "New in stock" heading.
  //
  // "Featured" is curated by tag and simply does not render when the tag is
  // unset, absent, or carries no live product. With two rows there is no
  // longer any need to fall back — the newest rail already guarantees the
  // page is never empty.
  const [newest, featured] = await Promise.all([
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: HOME_RAIL_LIMIT, order: "-created_at" },
    }).catch(() => null),
    featuredTagId
      ? listProducts({
          pageParam: 1,
          countryCode,
          queryParams: {
            limit: HOME_RAIL_LIMIT,
            order: "-created_at",
            tag_id: [featuredTagId],
          },
        }).catch(() => null)
      : Promise.resolve(null),
  ])

  const newestProducts = newest?.response.products ?? []
  const featuredProducts = featured?.response.products ?? []

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

        {region && (
          <ProductCarousel
            title="New in stock"
            href="/store"
            linkLabel="Explore more"
            products={newestProducts}
            region={region}
            cartLineItems={cart?.items ?? []}
          />
        )}

        {region && featuredTagId && (
          <ProductCarousel
            title={FEATURED_PRODUCT_TAG}
            href={`/store?tag_id=${featuredTagId}`}
            linkLabel="View more"
            products={featuredProducts}
            region={region}
            cartLineItems={cart?.items ?? []}
          />
        )}

        <SolarFeature />
      </div>
    </div>
  )
}
