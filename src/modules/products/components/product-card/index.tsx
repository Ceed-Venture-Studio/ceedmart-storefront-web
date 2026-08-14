"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"

import { addToCart, deleteLineItem, updateLineItem } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { buildWhatsAppOrderUrl } from "@lib/data/delivery-locations"
import { useDeliveryLocation } from "@lib/context/delivery-location-context"
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

  // Time-aware delivery message. Renders the neutral default during SSR
  // and on first paint, then swaps to a "today / tomorrow" line after mount
  // based on the visitor's local clock — avoids hydration mismatches.
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null)
  useEffect(() => {
    const hour = new Date().getHours()
    setDeliveryMsg(
      hour < 14
        ? "Get it today — order by 2pm · Lagos & Port Harcourt"
        : "Get it tomorrow · Lagos & Port Harcourt"
    )
  }, [])

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

  const { location } = useDeliveryLocation()

  const onSale =
    displayedPrice?.price_type === "sale" &&
    displayedPrice?.original_price_number !== undefined &&
    displayedPrice.original_price_number >
      displayedPrice.calculated_price_number

  // Carries the chosen delivery city into the message so WhatsApp orders
  // arrive with a location, same as checkout orders.
  const preorderUrl = useMemo(() => {
    const parts = [`Hello CeedMart, I'd like to order "${product.title}".`]
    if (selectedVariant?.title && selectedVariant.title !== product.title) {
      parts.push(`Variant: ${selectedVariant.title}.`)
    }
    parts.push("Please confirm availability and pricing.")
    return buildWhatsAppOrderUrl(parts, location)
  }, [product.title, selectedVariant, location])

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

  const addToCartLabel =
    hasOptions && !isValidVariant
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
          {deliveryMsg ?? "Free delivery in Lagos & Port Harcourt"}
        </p>

        {hasOptions && (product.options ?? []).length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {(product.options ?? []).map((opt) => {
              const values =
                opt.values
                  ?.map((v) => v.value)
                  .filter((v): v is string => !!v) ?? []
              if (values.length === 0) return null
              const selected = options[opt.id] ?? ""
              return (
                <div key={opt.id} className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-grey-50">
                    {opt.title}
                  </label>
                  <select
                    value={selected}
                    onChange={(e) => setOption(opt.id, e.target.value)}
                    className={clx(
                      "h-9 px-2 rounded-base border bg-white text-sm focus:outline-none focus:border-ceedmart-navy",
                      selected
                        ? "border-ceedmart-navy text-ceedmart-navy"
                        : "border-grey-20 text-ui-fg-base"
                    )}
                  >
                    <option value="" disabled>
                      Choose {opt.title.toLowerCase()}
                    </option>
                    {values.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
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
              data-testid="preorder-whatsapp-button"
              className="inline-flex items-center justify-center gap-1.5 w-full h-9 px-4 rounded-circle bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-semibold transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="small:hidden">Order</span>
              <span className="hidden small:inline">Order via WhatsApp</span>
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
