"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useMemo, useState, useTransition } from "react"

import { addToCart, deleteLineItem, updateLineItem } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
  cartLineItems?: HttpTypes.StoreCartLineItem[]
}

type LineEntry = { lineId: string; quantity: number }

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) =>
  variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {}) ?? {}

const formatPriceParts = (amount: number, currencyCode: string) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const parts = formatter.formatToParts(amount)
  const currency =
    parts.find((p) => p.type === "currency")?.value ??
    currencyCode.toUpperCase()
  const whole = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("")
  const fraction = parts.find((p) => p.type === "fraction")?.value ?? ""
  return { currency, whole, fraction }
}

export default function ProductCard({
  product,
  isFeatured,
  cartLineItems,
}: Props) {
  const countryCode = useParams().countryCode as string

  const initialOptions = useMemo<Record<string, string | undefined>>(() => {
    if ((product.variants?.length ?? 0) === 1) {
      return optionsAsKeymap(product.variants?.[0]?.options)
    }
    return {}
  }, [product.variants])

  const [options, setOptions] = useState<Record<string, string | undefined>>(
    initialOptions
  )

  const [linesByVariant, setLinesByVariant] = useState<
    Record<string, LineEntry>
  >(() => {
    const init: Record<string, LineEntry> = {}
    const productVariantIds = new Set(
      (product.variants ?? []).map((v) => v.id)
    )
    for (const li of cartLineItems ?? []) {
      if (li.variant_id && productVariantIds.has(li.variant_id)) {
        init[li.variant_id] = { lineId: li.id, quantity: li.quantity }
      }
    }
    return init
  })

  const [isPending, startTransition] = useTransition()

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return undefined
    return product.variants.find((v) =>
      isEqual(optionsAsKeymap(v.options), options)
    )
  }, [product.variants, options])

  const hasOptions =
    (product.options?.length ?? 0) > 0 && (product.variants?.length ?? 0) > 1
  const isValidVariant = !!selectedVariant

  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory) return true
    if (selectedVariant.allow_backorder) return true
    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant])

  const currentLine = selectedVariant
    ? linesByVariant[selectedVariant.id]
    : undefined

  const { cheapestPrice, variantPrice } = useMemo(
    () =>
      getProductPrice({
        product,
        variantId: selectedVariant?.id,
      }),
    [product, selectedVariant]
  )

  const displayedPrice = variantPrice ?? cheapestPrice
  const priceAvailable = !!displayedPrice

  const priceParts = useMemo(() => {
    if (!displayedPrice) return null
    return formatPriceParts(
      displayedPrice.calculated_price_number,
      displayedPrice.currency_code
    )
  }, [displayedPrice])

  const onSale =
    displayedPrice?.price_type === "sale" &&
    displayedPrice?.original_price_number !== undefined &&
    displayedPrice.original_price_number >
      displayedPrice.calculated_price_number

  const preorderUrl = useMemo(() => {
    const parts = [`Hello CeedMart, I'd like to preorder "${product.title}".`]
    if (selectedVariant?.title && selectedVariant.title !== product.title) {
      parts.push(`Variant: ${selectedVariant.title}.`)
    }
    parts.push("Please confirm availability and pricing.")
    return `https://wa.me/2347087502195?text=${encodeURIComponent(
      parts.join(" ")
    )}`
  }, [product.title, selectedVariant])

  const handleAddToCart = () => {
    if (!selectedVariant?.id || !inStock) return
    const variantId = selectedVariant.id
    setLinesByVariant((prev) => ({
      ...prev,
      [variantId]: {
        lineId: prev[variantId]?.lineId ?? "pending",
        quantity: (prev[variantId]?.quantity ?? 0) + 1,
      },
    }))
    startTransition(async () => {
      try {
        const cart = await addToCart({ variantId, quantity: 1, countryCode })
        const li = cart?.items?.find((i: any) => i.variant_id === variantId)
        if (li) {
          setLinesByVariant((prev) => ({
            ...prev,
            [variantId]: { lineId: li.id, quantity: li.quantity },
          }))
        }
      } catch {
        setLinesByVariant((prev) => {
          const next = { ...prev }
          delete next[variantId]
          return next
        })
      }
    })
  }

  const handleQuantityChange = (nextQty: number) => {
    if (!selectedVariant?.id || !currentLine) return
    const variantId = selectedVariant.id
    const lineId = currentLine.lineId

    if (nextQty <= 0) {
      setLinesByVariant((prev) => {
        const next = { ...prev }
        delete next[variantId]
        return next
      })
      startTransition(async () => {
        try {
          if (lineId !== "pending") await deleteLineItem(lineId)
        } catch {}
      })
      return
    }

    setLinesByVariant((prev) => ({
      ...prev,
      [variantId]: { ...prev[variantId], quantity: nextQty },
    }))
    startTransition(async () => {
      try {
        if (lineId === "pending") return
        const cart = await updateLineItem({ lineId, quantity: nextQty })
        const li = cart?.items?.find((i: any) => i.id === lineId)
        if (li) {
          setLinesByVariant((prev) => ({
            ...prev,
            [variantId]: { lineId: li.id, quantity: li.quantity },
          }))
        }
      } catch {}
    })
  }

  const setOption = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const addToCartLabel = !priceAvailable
    ? "Preorder via WhatsApp"
    : hasOptions && !isValidVariant
      ? "Select options"
      : !inStock
        ? "Out of stock"
        : "Add to cart"

  return (
    <div
      data-testid="product-wrapper"
      className="flex flex-col bg-white rounded-rounded border border-grey-10 overflow-hidden h-full"
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block bg-grey-5"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          isFeatured={isFeatured}
        />
      </LocalizedClientLink>

      <div className="flex flex-col gap-2 small:gap-2.5 p-3 small:p-4 flex-1">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <h3
            data-testid="product-title"
            className="text-sm small:text-base text-ui-fg-base leading-snug line-clamp-3 hover:text-ceedmart-navy transition-colors"
          >
            {product.title}
          </h3>
        </LocalizedClientLink>

        {priceParts && (
          <div className="flex items-baseline gap-1" data-testid="price">
            <span className="text-xs font-semibold text-ui-fg-base">
              {priceParts.currency}
            </span>
            <span className="text-xl small:text-2xl font-bold text-ui-fg-base leading-none">
              {priceParts.whole}
            </span>
            <sup className="text-[10px] small:text-xs font-semibold text-ui-fg-base">
              {priceParts.fraction}
            </sup>
            {onSale && (
              <span
                data-testid="original-price"
                className="ml-1 text-xs text-grey-50 line-through"
              >
                {displayedPrice?.original_price}
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-grey-60">
          Free delivery in Lagos & Port Harcourt
        </p>

        {hasOptions && (product.options ?? []).length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {(product.options ?? []).map((opt) => {
              const values =
                opt.values?.map((v) => v.value).filter(Boolean) ?? []
              if (values.length === 0) return null
              const compact = values.length > 4
              const visible = compact ? values.slice(0, 4) : values
              return (
                <div key={opt.id} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wide font-semibold text-grey-50">
                    {opt.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {visible.map((value) => {
                      const active = options[opt.id] === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setOption(opt.id, value!)}
                          className={clx(
                            "px-2.5 h-7 rounded-base border text-xs font-medium transition-all",
                            active
                              ? "border-ceedmart-navy bg-ceedmart-navy/5 text-ceedmart-navy"
                              : "border-grey-20 bg-white text-ui-fg-base hover:border-grey-40"
                          )}
                        >
                          {value}
                        </button>
                      )
                    })}
                    {compact && (
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="px-2.5 h-7 inline-flex items-center rounded-base border border-grey-20 bg-white text-xs font-medium text-grey-60 hover:border-grey-40"
                      >
                        +{values.length - 4} more
                      </LocalizedClientLink>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-auto pt-2">
          {!priceAvailable ? (
            <a
              href={preorderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full h-9 px-4 rounded-circle bg-ceedmart-gold hover:brightness-95 text-ceedmart-navy text-sm font-semibold transition-colors"
            >
              {addToCartLabel}
            </a>
          ) : currentLine ? (
            <QuantityStepper
              quantity={currentLine.quantity}
              onChange={handleQuantityChange}
              loading={isPending}
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isPending || !isValidVariant || !inStock}
              data-testid="add-to-cart-button"
              className={clx(
                "inline-flex items-center justify-center w-full h-9 px-4 rounded-circle text-sm font-semibold transition-all",
                "bg-ceedmart-gold text-ceedmart-navy hover:brightness-95",
                "disabled:bg-grey-10 disabled:text-grey-50 disabled:cursor-not-allowed"
              )}
            >
              {isPending ? "Adding…" : addToCartLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuantityStepper({
  quantity,
  onChange,
  loading,
}: {
  quantity: number
  onChange: (next: number) => void
  loading: boolean
}) {
  return (
    <div
      data-testid="qty-stepper"
      className="inline-flex items-stretch h-9 rounded-circle bg-ceedmart-gold text-ceedmart-navy overflow-hidden w-full"
    >
      <button
        type="button"
        aria-label={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
        disabled={loading}
        onClick={() => onChange(quantity - 1)}
        className="flex-1 flex items-center justify-center font-bold hover:brightness-95 disabled:opacity-60"
      >
        {quantity === 1 ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
            />
          </svg>
        ) : (
          <span className="text-lg leading-none">−</span>
        )}
      </button>
      <div className="px-2 flex items-center justify-center min-w-[2rem] text-sm font-bold border-x border-ceedmart-navy/15">
        {quantity}
      </div>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={loading}
        onClick={() => onChange(quantity + 1)}
        className="flex-1 flex items-center justify-center font-bold hover:brightness-95 disabled:opacity-60"
      >
        <span className="text-lg leading-none">+</span>
      </button>
    </div>
  )
}
