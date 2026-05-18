import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  title?: string
  viewAllHref?: string
  collections: HttpTypes.StoreCollection[]
  limit?: number
}

type CollectionWithProducts = HttpTypes.StoreCollection & {
  products?: HttpTypes.StoreProduct[]
}

const resolveImage = (product?: HttpTypes.StoreProduct): string | null => {
  if (!product) return null
  if (product.thumbnail) return product.thumbnail
  const firstImage = product.images?.find((i) => i?.url)
  return firstImage?.url ?? null
}

const Tile = ({
  product,
  sizes,
}: {
  product?: HttpTypes.StoreProduct
  sizes: string
}) => {
  const url = resolveImage(product)
  if (!url) {
    return <div className="w-full h-full bg-grey-10" />
  }
  return (
    <Image
      src={url}
      alt={product?.title ?? ""}
      fill
      sizes={sizes}
      className="object-cover"
    />
  )
}

export default function CollectionsRichGrid({
  collections,
  title = "Collections",
  viewAllHref = "/store",
  limit = 5,
}: Props) {
  const shown = (collections as CollectionWithProducts[]).slice(0, limit)
  if (shown.length === 0) return null

  return (
    <section className="flex flex-col gap-3 small:gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-base small:text-lg font-semibold text-ui-fg-base">
          {title}
        </h2>
        <LocalizedClientLink
          href={viewAllHref}
          className="text-sm font-semibold text-ceedmart-navy hover:text-ceedmart-navy-light"
        >
          View all →
        </LocalizedClientLink>
      </header>

      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-3 small:gap-4">
        {shown.map((c) => {
          const products = c.products ?? []
          const [p1, p2, p3] = [products[0], products[1], products[2]]

          return (
            <LocalizedClientLink
              key={c.id}
              href={`/collections/${c.handle}`}
              className="group block"
            >
              <div className="bg-white border border-grey-10 rounded-rounded overflow-hidden hover:shadow-md transition-shadow">
                {/* 50/25/25 collage — left half spans, right half stacked */}
                <div className="grid grid-cols-2 grid-rows-2 gap-px aspect-[4/3] bg-grey-5">
                  <div className="row-span-2 relative overflow-hidden">
                    <Tile product={p1} sizes="(min-width: 1280px) 130px, 50vw" />
                  </div>
                  <div className="relative overflow-hidden">
                    <Tile product={p2} sizes="(min-width: 1280px) 65px, 25vw" />
                  </div>
                  <div className="relative overflow-hidden">
                    <Tile product={p3} sizes="(min-width: 1280px) 65px, 25vw" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-ui-fg-base group-hover:text-ceedmart-navy transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  {products.length > 0 && (
                    <p className="text-xs text-grey-50 mt-0.5">
                      {products.length} product
                      {products.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
