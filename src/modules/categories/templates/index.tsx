import { notFound } from "next/navigation"
import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const [allCategories, allCollections] = await Promise.all([
    listCategories(),
    listCollections({ fields: "id,title,handle" }),
  ])

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        sortBy={sort}
        categories={allCategories || []}
        collections={allCollections?.collections || []}
        data-testid="sort-by-container"
      />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-grey-50 mb-2">
              Browse subcategories
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {category.category_children.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="px-4 py-2 rounded-full border border-grey-20 bg-white text-sm font-medium text-grey-80 hover:border-ceedmart-navy hover:text-ceedmart-navy hover:bg-ceedmart-navy/5 hover:shadow-sm transition-all"
                >
                  {c.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        )}
        {/* Fixed placeholder count: `category.products` is no longer expanded
            by listCategories (see lib/data/categories.ts). */}
        <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
