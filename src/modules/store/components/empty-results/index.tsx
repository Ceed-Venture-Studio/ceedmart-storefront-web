import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  query?: string
  collections: HttpTypes.StoreCollection[]
}

export default function EmptyResults({ query, collections }: Props) {
  const top = collections.slice(0, 10)

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-rounded bg-white border border-grey-20 p-6 small:p-10 text-center">
        <div className="text-3xl mb-2">🔍</div>
        <h2 className="text-xl font-semibold text-ui-fg-base mb-1">
          {query
            ? `We couldn't find anything for "${query}"`
            : "No products match your filters"}
        </h2>
        <p className="text-sm text-grey-60">
          Try a different search or browse our collections below.
        </p>
      </div>

      {top.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-3">
            Browse collections
          </h3>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-3 small:gap-4">
            {top.map((c) => (
              <LocalizedClientLink
                key={c.id}
                href={`/collections/${c.handle}`}
                className="group block rounded-rounded bg-white border border-grey-20 hover:border-ceedmart-navy hover:shadow-md transition-all p-4 small:p-5"
              >
                <div className="text-sm font-semibold text-ui-fg-base group-hover:text-ceedmart-navy line-clamp-2">
                  {c.title}
                </div>
                <div className="text-xs text-grey-50 mt-1">
                  View collection →
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
