import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"

export default function ProductCard({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
        />
        {/* Desktop: side by side */}
        <div className="hidden small:flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && (
              <>
                {cheapestPrice.price_type === "sale" && (
                  <Text className="line-through text-ui-fg-muted">
                    {cheapestPrice.original_price}
                  </Text>
                )}
                <Text
                  className={
                    cheapestPrice.price_type === "sale"
                      ? "text-ui-fg-interactive"
                      : "text-ui-fg-muted"
                  }
                >
                  {cheapestPrice.calculated_price}
                </Text>
              </>
            )}
          </div>
        </div>
        {/* Mobile: stacked, smaller text */}
        <div className="small:hidden flex flex-col gap-0.5 mt-2">
          <Text
            className="text-ui-fg-subtle text-xs leading-tight line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-center gap-x-1.5">
            {cheapestPrice && (
              <>
                {cheapestPrice.price_type === "sale" && (
                  <Text className="line-through text-ui-fg-muted text-[10px]">
                    {cheapestPrice.original_price}
                  </Text>
                )}
                <Text
                  className={`text-xs font-semibold ${
                    cheapestPrice.price_type === "sale"
                      ? "text-ui-fg-interactive"
                      : "text-ui-fg-base"
                  }`}
                >
                  {cheapestPrice.calculated_price}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
