"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import FastDelivery from "@modules/common/icons/fast-delivery"
import MapPin from "@modules/common/icons/map-pin"
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

  const priceAvailable = !!getProductPrice({ product }).cheapestPrice

  const preorderUrl = useMemo(() => {
    const parts = [`Hello CeedMart, I'd like to preorder "${product.title}".`]
    if (selectedVariant?.title && selectedVariant.title !== product.title) {
      parts.push(`Variant: ${selectedVariant.title}.`)
    }
    parts.push("Please confirm availability and pricing.")
    return `https://wa.me/2348066933942?text=${encodeURIComponent(
      parts.join(" ")
    )}`
  }, [product.title, selectedVariant])

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

          {priceAvailable ? (
            <>
              <div className="text-sm">
                {inStock ? (
                  <span className="text-green-600 font-semibold">
                    In Stock
                  </span>
                ) : selectedVariant ? (
                  <span className="text-rose-600 font-semibold">
                    Out of Stock
                  </span>
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
            </>
          ) : (
            <>
              <p className="text-sm text-ui-fg-subtle leading-5">
                This product isn&apos;t listed for direct online checkout yet.
                Send a preorder enquiry on WhatsApp and we&apos;ll confirm
                availability and pricing.
              </p>
              <a
                href={preorderUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="preorder-whatsapp-button"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Preorder via WhatsApp
              </a>
            </>
          )}

          <div className="border-t border-grey-20 pt-4 flex flex-col gap-y-3 text-sm">
            <div className="flex items-start gap-x-2">
              <FastDelivery />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Fast delivery
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Dispatched in 1–3 business days to your pickup point or door.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-2">
              <Refresh />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Distributor-backed warranty
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Products with manufacturer warranty are backed by our
                  authorised distributors — we stand behind every unit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-2">
              <MapPin />
              <div>
                <div className="font-semibold text-ui-fg-base">
                  Tracked &amp; secure dispatch
                </div>
                <p className="text-ui-fg-subtle text-xs leading-5">
                  Every shipment is tracked end-to-end via our dispatch
                  service — your goods stay protected in transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {priceAvailable && (
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
      )}
    </>
  )
}
