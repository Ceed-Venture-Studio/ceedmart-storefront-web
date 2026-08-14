import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { getStoreMenu } from "@lib/data/menu"
import BannerSlot from "@modules/banners/components/banner-slot"
import BulkHero from "@modules/home/components/bulk-hero"
import SectionGrid from "@modules/home/components/section-grid"
import BulkExplainer from "@modules/home/components/bulk-explainer"
import SolarFeature from "@modules/home/components/solar-feature"
import ProductCard from "@modules/products/components/product-card"

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

  const [sections, region, cart, featured] = await Promise.all([
    getStoreMenu(),
    getRegion(countryCode),
    retrieveCart().catch(() => null),
    listProducts({
      pageParam: 1,
      countryCode,
      queryParams: { limit: 8 },
    }).catch(() => null),
  ])

  const featuredProducts = featured?.response.products ?? []

  // Real catalogue size for the hero stat strip — never a hardcoded boast.
  const productCount = featured?.response.count ?? 0

  return (
    <div className="w-full flex flex-col">
      <BulkHero productCount={productCount} />

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

        {region && featuredProducts.length > 0 && (
          <section className="w-full">
            <div className="flex items-end justify-between mb-6 gap-4">
              <h2 className="text-2xl small:text-3xl font-bold text-grey-90 tracking-tight">
                New in stock
              </h2>
            </div>
            <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
              {featuredProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard
                    product={product}
                    region={region}
                    cartLineItems={cart?.items ?? []}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <SolarFeature />
      </div>
    </div>
  )
}
