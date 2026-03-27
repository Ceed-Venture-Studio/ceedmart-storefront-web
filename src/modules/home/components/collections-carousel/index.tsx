import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HorizontalCarousel from "@modules/common/components/horizontal-carousel"

const GRADIENT_COLORS = [
  "from-ceedmart-navy to-ceedmart-blue",
  "from-ceedmart-navy-light to-ceedmart-navy",
  "from-ceedmart-blue to-ceedmart-navy-light",
  "from-ceedmart-navy to-ceedmart-navy-light",
]

export default function CollectionsCarousel({
  collections,
}: {
  collections: HttpTypes.StoreCollection[]
}) {
  if (!collections || collections.length === 0) return null

  return (
    <HorizontalCarousel title="Collections" viewAllHref="/store">
      {collections.map((collection, i) => (
        <LocalizedClientLink
          key={collection.id}
          href={`/collections/${collection.handle}`}
          className="flex-shrink-0 snap-start"
        >
          <div
            className={`w-[180px] small:w-[220px] h-[120px] small:h-[140px] rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} flex items-end p-4 hover:opacity-90 transition-opacity`}
          >
            <span className="text-white font-semibold text-sm small:text-base leading-tight">
              {collection.title}
            </span>
          </div>
        </LocalizedClientLink>
      ))}
    </HorizontalCarousel>
  )
}
