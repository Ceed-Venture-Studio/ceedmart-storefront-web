"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/product-card"

/**
 * Single-row, horizontally scrollable product rail.
 *
 * Distinct from the shared HorizontalCarousel, which hardcodes a "View all"
 * label and a smaller heading — the home page rails need their own link text
 * ("Explore more" vs "View more") and section-scale typography.
 */
export default function ProductCarousel({
  title,
  href,
  linkLabel,
  products,
  region,
  cartLineItems,
}: {
  title: string
  href: string
  linkLabel: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  cartLineItems?: HttpTypes.StoreCartLineItem[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    // Card widths are fluid, so recompute when the row is resized rather
    // than only on mount.
    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      observer.disconnect()
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    // Page by roughly one viewport so a click always lands on a card edge.
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: "smooth",
    })
  }

  if (!products.length) return null

  return (
    <section className="w-full">
      <div className="flex items-end justify-between mb-6 gap-4">
        <h2 className="text-2xl small:text-3xl font-bold text-grey-90 tracking-tight">
          {title}
        </h2>

        <div className="flex items-center gap-3 shrink-0">
          <LocalizedClientLink
            href={href}
            className="text-sm font-semibold text-ceedmart-navy hover:underline whitespace-nowrap"
          >
            {linkLabel} &rarr;
          </LocalizedClientLink>

          <div className="hidden small:flex items-center gap-1.5">
            {(["left", "right"] as const).map((direction) => {
              const enabled =
                direction === "left" ? canScrollLeft : canScrollRight
              return (
                <button
                  key={direction}
                  type="button"
                  onClick={() => scroll(direction)}
                  disabled={!enabled}
                  aria-label={`Scroll ${direction}`}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    enabled
                      ? "border-grey-20 text-grey-70 hover:border-ceedmart-navy hover:text-ceedmart-navy"
                      : "border-grey-15 text-grey-30 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                    />
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 small:mx-0 small:px-0 pb-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            // Fractional widths keep a partial card visible at the right edge,
            // which is what signals the row scrolls.
            className="snap-start shrink-0 w-[45%] small:w-[31%] medium:w-[23%]"
          >
            <ProductCard
              product={product}
              region={region}
              cartLineItems={cartLineItems}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
