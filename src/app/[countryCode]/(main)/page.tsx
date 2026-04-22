import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import PromoBanners from "@modules/home/components/promo-banners"
import SearchHero from "@modules/home/components/search-hero"
import StoreCards from "@modules/home/components/store-cards"

export const metadata: Metadata = {
  title: "CeedMart - Wholesale & Bulk Orders",
  description:
    "Wholesale prices on bulk orders. Fresh foods, tech, gadgets & more — direct from CeedMart.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Home(props: Props) {
  const { countryCode } = await props.params

  const categories = await listCategories()

  const topLevelCategories = (categories || [])
    .filter((c) => !c.parent_category)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
    }))

  return (
    <div className="min-h-[80svh] w-full flex flex-col items-center justify-start small:justify-center pt-12 pb-12 small:pt-16 gap-10">
      <div className="w-full flex justify-center px-6">
        <SearchHero categories={topLevelCategories} />
      </div>
      <PromoBanners />
      <div className="w-full flex justify-center px-6">
        <StoreCards />
      </div>
    </div>
  )
}
