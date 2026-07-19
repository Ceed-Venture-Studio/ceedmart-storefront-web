import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listBanners } from "@lib/data/banners"
import { SOLAR_PACKAGES_COLLECTION_HANDLE } from "@lib/data/store-config"
import BannerSlot from "@modules/banners/components/banner-slot"
import SearchHero from "@modules/home/components/search-hero"
import StoreCards from "@modules/home/components/store-cards"

export const metadata: Metadata = {
  title:
    "CeedMart — Whole Foods, Solar Power, CCTV & Computer Accessories at Great Prices",
  description:
    "Shop quality whole foods, solar energy systems, CCTV & access control and computer accessories at great prices. Free delivery in Lagos & Port Harcourt.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Home(props: Props) {
  await props.params

  // Pre-check whether a hero banner is configured for this slot so we know
  // whether to render the overlay layout or fall back to a banner-less hero.
  // listBanners is server-cached under tag "banners" so this is effectively
  // free even though BannerSlot re-calls it.
  const [categories, heroMobile, heroDesktop] = await Promise.all([
    listCategories(),
    listBanners("home_hero_mobile", 1),
    listBanners("home_hero_desktop", 1),
  ])

  const topLevelCategories = (categories || [])
    .filter((c) => !c.parent_category)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
    }))

  const hasHero = heroMobile.length > 0 || heroDesktop.length > 0

  return (
    <div className="w-full flex flex-col">
      {hasHero ? (
        <section className="relative w-full">
          <BannerSlot
            slot="home_hero_mobile"
            priority
            className="small:hidden"
          />
          <BannerSlot
            slot="home_hero_desktop"
            priority
            className="hidden small:block"
          />

          {/* Contrast overlay — keeps the search/pills legible on any banner */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/55 pointer-events-none"
            aria-hidden
          />

          {/* Floating search + pills */}
          <div className="absolute inset-0 flex items-end small:items-center justify-center pb-6 small:pb-0">
            <SearchHero
              categories={topLevelCategories}
              tone="light"
              extras={[
                {
                  id: "solar-power-packages",
                  name: "Solar Power Packages",
                  href: `/collections/${SOLAR_PACKAGES_COLLECTION_HANDLE}`,
                },
              ]}
            />
          </div>
        </section>
      ) : (
        <div className="w-full flex justify-center px-6 pt-10 small:pt-14">
          <SearchHero
            categories={topLevelCategories}
            extras={[
              {
                id: "solar-power-packages",
                name: "Solar Power Packages",
                href: `/collections/${SOLAR_PACKAGES_COLLECTION_HANDLE}`,
              },
            ]}
          />
        </div>
      )}

      <div className="w-full flex flex-col items-center pt-10 pb-12 small:pt-14 gap-10">
        {/* 3-up secondary banners */}
        <div className="w-full flex justify-center px-6">
          <BannerSlot
            slot="home_secondary"
            limit={3}
            className="grid grid-cols-1 small:grid-cols-3 gap-4 w-full max-w-6xl"
            itemClassName="block rounded-rounded overflow-hidden"
          />
        </div>

        <div className="w-full flex justify-center px-6">
          <StoreCards />
        </div>
      </div>
    </div>
  )
}
