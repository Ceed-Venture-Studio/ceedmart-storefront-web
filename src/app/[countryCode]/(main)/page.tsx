import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import SearchHero from "@modules/home/components/search-hero"
import StoreCards from "@modules/home/components/store-cards"

export const metadata: Metadata = {
  title: "CeedMart - General Merchandise",
  description:
    "Shop for everything you need at CeedMart. General merchandise at your fingertips.",
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
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 gap-10">
      <SearchHero categories={topLevelCategories} />
      <StoreCards />
    </div>
  )
}
