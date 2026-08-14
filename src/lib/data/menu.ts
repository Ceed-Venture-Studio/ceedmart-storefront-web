import { HttpTypes } from "@medusajs/types"

import { getCategoryProductCounts, listCategories } from "./categories"
import { listCollections } from "./collections"
import {
  MEGA_MENU_MIN_CHILDREN,
  STORE_SECTIONS,
  StoreSection,
} from "./store-config"

export type MenuLink = {
  id: string
  name: string
  href: string
  /** Products in this node's whole subtree, not just filed directly on it.
   *  Internal only — used to prune empty categories and order them by size.
   *  Not rendered in the menu. */
  count: number
}

export type MenuGroup = {
  id: string
  /** Root category name — rendered as a column heading only when a section
   *  merges more than one root (Solar). Otherwise the column is unlabelled. */
  name: string
  href: string
  children: MenuLink[]
}

export type MenuSection = {
  title: string
  href: string
  groups: MenuGroup[]
  featured: MenuLink[]
  /** True when the section has too little filed on child categories to fill a
   *  panel. Callers render a single "Shop all …" link instead of a stub. */
  isSparse: boolean
}

/** Titles arrive from admin with stray whitespace (e.g. "  Commercial Energy
 *  Products", "Cleaning and Detergents "), which shows up as odd gaps in the
 *  nav. Normalise rather than wait on a data fix. */
const clean = (value?: string | null) => (value ?? "").trim()

/**
 * Builds the mega menu / mobile accordion tree.
 *
 * Three requests, all cached for 60s and shared with the rest of the app:
 * slim categories (~28 KB), a product-count tally (~31 KB) and collections.
 * Empty categories are pruned, so nodes appear and disappear as stock is
 * filed in admin without needing a redeploy.
 */
export const getStoreMenu = async (): Promise<MenuSection[]> => {
  const [categories, counts, collectionsRes] = await Promise.all([
    listCategories(),
    getCategoryProductCounts(),
    listCollections(),
  ])

  const allCategories = categories ?? []
  const collections = collectionsRes?.collections ?? []

  const childrenByParent = new Map<string, HttpTypes.StoreProductCategory[]>()
  for (const category of allCategories) {
    const parentId = category.parent_category?.id
    if (!parentId) continue
    const siblings = childrenByParent.get(parentId) ?? []
    siblings.push(category)
    childrenByParent.set(parentId, siblings)
  }

  // Medusa reports products filed directly on a category and never rolls them
  // up, so a parent whose stock all sits on its children would otherwise look
  // empty. Sum the subtree instead.
  const subtreeCount = (categoryId: string): number =>
    (counts[categoryId] ?? 0) +
    (childrenByParent.get(categoryId) ?? []).reduce(
      (total, child) => total + subtreeCount(child.id),
      0
    )

  const toGroup = (root: HttpTypes.StoreProductCategory): MenuGroup => ({
    id: root.id,
    name: clean(root.name),
    href: `/categories/${root.handle}`,
    children: (childrenByParent.get(root.id) ?? [])
      .map((child) => ({
        id: child.id,
        name: clean(child.name),
        href: `/categories/${child.handle}`,
        count: subtreeCount(child.id),
      }))
      .filter((child) => child.count > 0)
      .sort((a, b) => b.count - a.count),
  })

  const buildSection = (section: StoreSection): MenuSection => {
    const groups = section.rootCategoryIds
      .map((id) => allCategories.find((category) => category.id === id))
      .filter((root): root is HttpTypes.StoreProductCategory => Boolean(root))
      .map(toGroup)
      .filter((group) => group.children.length > 0)

    const featured = section.featuredCollectionHandles
      .map((handle) => collections.find((c) => c.handle === handle))
      .filter((c): c is HttpTypes.StoreCollection => Boolean(c))
      .map((c) => ({
        id: c.id,
        name: clean(c.title),
        href: `/collections/${c.handle}`,
        count: 0,
      }))

    const childCount = groups.reduce((n, g) => n + g.children.length, 0)

    return {
      title: section.title,
      href: section.href,
      groups,
      featured,
      isSparse: childCount < MEGA_MENU_MIN_CHILDREN,
    }
  }

  return STORE_SECTIONS.map(buildSection)
}
