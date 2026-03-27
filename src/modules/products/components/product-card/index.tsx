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
          size="full"
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
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
      </div>
    </LocalizedClientLink>
  )
}
