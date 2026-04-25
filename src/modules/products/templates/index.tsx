import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductDetailView from "@modules/products/templates/product-detail-view"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container py-6">
        <ProductOnboardingCta />
        <div className="grid grid-cols-1 small:grid-cols-[minmax(0,1.6fr)_minmax(0,4fr)_minmax(0,1.4fr)] gap-x-8 gap-y-6 items-start">
          <div className="w-full small:sticky small:top-24 small:col-start-1 small:col-end-2 small:row-start-1 small:row-end-3">
            <ImageGallery images={images} />
          </div>
          <ProductDetailView product={product} region={region} />
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
