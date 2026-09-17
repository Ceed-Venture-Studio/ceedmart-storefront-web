"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { listListingPolicies, type PolicyMap } from "@lib/data/listing-policy"
import {
  policyForProduct,
  targetsFromProducts,
} from "@lib/util/fulfilment-groups"
import ProductCard from "@modules/products/components/product-card"

const PRODUCT_LIMIT = 12

export default function InfiniteProductGrid({
  initialProducts,
  initialHasMore,
  countryCode,
  region,
  queryParams,
  cartLineItems,
  initialPolicies,
}: {
  initialProducts: HttpTypes.StoreProduct[]
  initialHasMore: boolean
  countryCode: string
  region: HttpTypes.StoreRegion
  queryParams?: Record<string, any>
  cartLineItems?: HttpTypes.StoreCartLineItem[]
  /** Commerce types for the first page, resolved on the server so a
   *  pre-order is badged in the initial HTML rather than popping in. */
  initialPolicies?: PolicyMap
}) {
  const [products, setProducts] = useState(initialProducts)
  // Grows with the product list. Pages loaded on scroll need their own
  // lookup — without this, everything past the first twelve would lose its
  // badge purely by virtue of how far the shopper scrolled.
  const [policies, setPolicies] = useState<PolicyMap>(initialPolicies ?? {})
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const nextPage = page + 1
      const { response, nextPage: morePages } = await listProducts({
        pageParam: nextPage,
        countryCode,
        queryParams: { limit: PRODUCT_LIMIT, ...queryParams },
      })

      setProducts((prev) => [...prev, ...response.products])
      setPage(nextPage)
      setHasMore(morePages !== null)

      // Badge the new arrivals too. Failure here leaves them unbadged rather
      // than blocking the page, which is the same trade listListingPolicies
      // already makes.
      try {
        const next = await listListingPolicies(
          targetsFromProducts(response.products as any)
        )
        setPolicies((prev) => ({ ...prev, ...next }))
      } catch {
        // keep what we have
      }
    } catch (e) {
      console.error("Failed to load more products", e)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, countryCode, queryParams])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <>
      <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              region={region}
              cartLineItems={cartLineItems}
              policy={policyForProduct(product as any, policies)}
            />
          </li>
        ))}
      </ul>

      {isLoading && (
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-grey-10 rounded-large aspect-[9/16] w-full" />
              <div className="mt-4 flex justify-between">
                <div className="bg-grey-10 h-4 w-2/3 rounded" />
                <div className="bg-grey-10 h-4 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-grey-40 text-sm mt-12">
          You&apos;ve seen all products
        </p>
      )}
    </>
  )
}
