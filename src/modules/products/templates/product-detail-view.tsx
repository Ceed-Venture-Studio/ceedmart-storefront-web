"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MobileActions from "@modules/products/components/product-actions/mobile-actions"
import ProductPrice from "@modules/products/components/product-price"
import { isEqual } from "lodash"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductDetailView({ product, disabled }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) =>
      isEqual(optionsAsKeymap(v.options), options)
    )
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) =>
      isEqual(optionsAsKeymap(v.options), options)
    )
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    if (value) params.set("v_id", value)
    else params.delete("v_id")
    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    )
      return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })
    setIsAdding(false)
  }

  const addToCartLabel =
    !selectedVariant && !options
      ? "Select variant"
      : !inStock || !isValidVariant
      ? "Out of stock"
      : "Add to cart"

  return (
    <>
      {/* Middle column: title, price, variants, description, spec table */}
      <div
        className="flex flex-col gap-y-6 py-6 small:py-0"
        data-testid="product-container"
      >
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        <h1
          className="text-2xl small:text-3xl font-bold text-ui-fg-base leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <div className="text-2xl font-bold">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {(product.variants?.length ?? 0) > 1 &&
          (product.options || []).map((option) => {
            const values = (option.values ?? []).map((v) => v.value)
            return (
              <div key={option.id} className="flex flex-col gap-y-3">
                <div className="text-sm">
                  <span className="font-semibold text-ui-fg-base">
                    {option.title}:{" "}
                  </span>
                  <span className="text-ui-fg-subtle">
                    {options[option.id] ?? "Select"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => {
                    const active = v === options[option.id]
                    return (
                      <button
                        key={v}
                        onClick={() => setOptionValue(option.id, v)}
                        className={clx(
                          "min-w-[120px] px-4 py-3 rounded-lg border text-left transition-colors",
                          {
                            "border-ceedmart-navy bg-ceedmart-navy/5 ring-2 ring-ceedmart-navy/20":
                              active,
                            "border-grey-20 bg-white hover:border-grey-40":
                              !active,
                          }
                        )}
                        disabled={!!disabled || isAdding}
                        data-testid="option-button"
                      >
                        <span className="text-sm font-semibold text-ui-fg-base">
                          {v}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

        {product.description && (
          <div>
            <h3 className="text-base font-semibold text-ui-fg-base mb-2">
              About this product
            </h3>
            <p
              className="text-ui-fg-subtle whitespace-pre-line text-sm leading-6"
              data-testid="product-description"
            >
              {product.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-3">
            Product information
          </h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-sm">
            <dt className="font-semibold text-ui-fg-base">Material</dt>
            <dd className="text-ui-fg-subtle">{product.material || "-"}</dd>
            <dt className="font-semibold text-ui-fg-base">Country of origin</dt>
            <dd className="text-ui-fg-subtle">
              {product.origin_country || "-"}
            </dd>
            <dt className="font-semibold text-ui-fg-base">Type</dt>
            <dd className="text-ui-fg-subtle">{product.type?.value || "-"}</dd>
            <dt className="font-semibold text-ui-fg-base">Weight</dt>
            <dd className="text-ui-fg-subtle">
              {product.weight ? `${product.weight} g` : "-"}
            </dd>
            <dt className="font-semibold text-ui-fg-base">Dimensions</dt>
            <dd className="text-ui-fg-subtle">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </dd>
          </dl>
        </div>
      </div>

      {/* Right column: buy box (sticky on desktop) */}
      <div className="w-full">
        <div
          ref={actionsRef}
          className="small:sticky small:top-24 rounded-lg border border-grey-20 bg-white p-5 flex flex-col gap-y-4 shadow-sm"
        >
          <div className="text-2xl font-bold">
            <ProductPrice product={product} variant={selectedVariant} />
          </div>

          <div className="text-sm">
            {inStock ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : selectedVariant ? (
              <span className="text-rose-600 font-semibold">Out of Stock</span>
            ) : (
              <span className="text-ui-fg-subtle">Select a variant</span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="w-full h-11 bg-ceedmart-navy hover:bg-ceedmart-navy-light"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {addToCartLabel}
          </Button>

          <div className="border-t border-grey-20 pt-4 flex flex-col gap-y-3 text-sm">
            <div className="flex items-start gap-x-2">
              <FastDelivery />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Fast delivery
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Arrives in 3–5 business days at your pickup location or home.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-2">
              <Refresh />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Simple exchanges
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Not quite right? We&apos;ll exchange it.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-2">
              <Back />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Easy returns
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Hassle-free refunds on returns, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </>
  )
}
