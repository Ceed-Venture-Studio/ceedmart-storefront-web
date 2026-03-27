import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HorizontalCarousel from "@modules/common/components/horizontal-carousel"

type Category = {
  id: string
  name: string
  handle: string
}

export default function CategoriesCarousel({
  categories,
}: {
  categories: Category[]
}) {
  if (!categories || categories.length === 0) return null

  return (
    <HorizontalCarousel title="Categories">
      {categories.map((category) => (
        <LocalizedClientLink
          key={category.id}
          href={`/categories/${category.handle}`}
          className="flex-shrink-0 snap-start"
        >
          <div className="px-5 py-3 rounded-full border border-grey-20 bg-white text-sm font-medium text-grey-70 hover:border-ceedmart-navy hover:text-ceedmart-navy hover:bg-ceedmart-navy/5 transition-all whitespace-nowrap">
            {category.name}
          </div>
        </LocalizedClientLink>
      ))}
    </HorizontalCarousel>
  )
}
