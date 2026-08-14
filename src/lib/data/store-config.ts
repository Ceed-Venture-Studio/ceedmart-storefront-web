/**
 * Store section configuration — maps each storefront section to its
 * Medusa collection and category IDs for filtering.
 *
 * H3 note: what was TECH_* (Solar + CCTV + Gadgets combined) is now split
 * into SOLAR_*, CCTV_*, and COMPUTER_* to match the four-card home page.
 * The old /store/tech route redirects to /store/solar-energy-power.
 */

export const WHOLEFOODS_COLLECTION_IDS = [
  "pcol_FdRwpCMLGKC0axym", // Whole Foods
]

export const WHOLEFOODS_CATEGORY_ID = "pcat_bVBgkix17lsxYQKz" // Whole Foods parent

// ─── Solar Energy & Power ───────────────────────────────────────────────
// Solar systems, inverters, batteries, power stations. The Solar Packages
// collection is also surfaced on this page via handle so admin can publish
// new bundle collections without a redeploy.
export const SOLAR_COLLECTION_IDS = [
  "pcol_c6NBbr2rdcXfZkx7", // Solar Energy
  "pcol_5wgKuIDYxxeTo3ae", // Power Solutions
]
export const SOLAR_COLLECTION_HANDLES = ["solar-power-packages"]
export const SOLAR_CATEGORY_IDS = [
  "pcat_nXhMQPGwFlzi399y", // Solar Energy
  "pcat_yhkQTSA3IfaVwGVW", // Power Solutions
]
export const SOLAR_CATEGORY_HANDLES = ["solar-power-packages"]

export const SOLAR_PACKAGES_COLLECTION_HANDLE = "solar-power-packages"

// ─── CCTV & Access Control ──────────────────────────────────────────────
// Cameras, DVRs, access readers, alarm kit.
export const CCTV_COLLECTION_IDS = [
  "pcol_S9dK2WAvjJrNDEu6", // CCTV & Security
]
export const CCTV_COLLECTION_HANDLES: string[] = []

// Parent category — the carousel lists its children (CCTV Cameras,
// Attendance & Identification). Previously this pointed at "CCTV Cameras",
// which is itself a child, so the root-only filter matched nothing and the
// carousel rendered empty.
export const CCTV_CATEGORY_ID = "pcat_01KRMX9KYWGV6QMF8R2F5T6TAB" // CCTV & Security

// ─── Computer & Accessories ─────────────────────────────────────────────
// Laptops, monitors, peripherals and productivity gear.
//
// This page aggregates the whole Gadgets tree rather than a collection.
// Two things to know before changing it:
//
//  1. Medusa's product `category_id` filter is an exact match — it does NOT
//     walk descendants. A product filed only under "Laptop" is invisible to
//     a query for its parent "Gadgets". So the page builds its filter from
//     the parent *plus* every child and grandchild, resolved at request time
//     (new subcategories therefore need no redeploy).
//  2. `collection_id` and `category_id` are AND-ed by the API, not OR-ed, so
//     a collection and a category cannot be unioned in a single request.
//
// The old value here was collection `pcol_LV4FJsLTGZvxDcvG`, commented as
// "Gadgets & Electronics" but actually holding "Commercial Energy Products"
// (Deye batteries, MD meters) — which is what the page was displaying.
export const COMPUTER_CATEGORY_ID = "pcat_UqD4lQ3u8LH5vxfa" // Gadgets

// Patio furniture retained for the /store/patio-furniture route (not
// featured on the home page any more but still linkable / reachable).
export const PATIO_FURNITURE_COLLECTION_HANDLE = "patio-furniture"
export const PATIO_FURNITURE_CATEGORY_HANDLE = "patio-furniture"

// ─── Groceries ──────────────────────────────────────────────────────────
// Everyday household goods — beverages, cereals, toiletries, detergents.
// Distinct from Whole Foods, which is the bulk/wholesale fresh-produce range.
export const GROCERIES_CATEGORY_ID = "pcat_01KZK4VYSPQGWK82JD20RZKNTP"
export const GROCERIES_COLLECTION_HANDLE = "groceries"

// ─── Power Solutions ────────────────────────────────────────────────────
// Inverters, power stations and bundled solar packages. Note this tree is
// ALSO surfaced inside the Solar Energy & Power section — see the note on
// STORE_SECTIONS below.
export const POWER_SOLUTIONS_CATEGORY_ID = "pcat_yhkQTSA3IfaVwGVW"
export const POWER_SOLUTIONS_COLLECTION_HANDLE = "power-solutions"

// ─── Navigation ─────────────────────────────────────────────────────────

export type StoreSection = {
  /** Label in the nav. Deliberately not the raw category name — the tree
   *  calls it "Gadgets", the shop calls it "Computer & Accessories". */
  title: string
  /** Where the top-level item points. The four merchandised sections go to
   *  their curated /store page; the rest fall back to /categories. */
  href: string
  /** Root categories whose children fill the panel. Solar merges two roots
   *  ("Solar Energy" + "Power Solutions") into one section, so this is a list. */
  rootCategoryIds: string[]
  /** Collection handles shown in the panel's "Featured" rail. */
  featuredCollectionHandles: string[]
}

/**
 * Drives the mega menu and the mobile accordion.
 *
 * Categories are the spine because collections in Medusa are flat and cannot
 * nest. Collections appear only as the featured rail. The two taxonomies
 * overlap by name but not by contents (e.g. "Whole Foods" is 66 products as a
 * category and 166 as a collection), so mixing them into one hierarchy would
 * show shoppers two identically-named entries with different results.
 */
export const STORE_SECTIONS: StoreSection[] = [
  {
    title: "Whole Foods",
    href: "/store/wholefoods",
    rootCategoryIds: [WHOLEFOODS_CATEGORY_ID],
    featuredCollectionHandles: ["whole-foods"],
  },
  {
    title: "Solar Energy & Power",
    href: "/store/solar-energy-power",
    rootCategoryIds: SOLAR_CATEGORY_IDS,
    featuredCollectionHandles: [
      "solar-energy",
      "power-solutions",
      "solar-power-packages",
      "commercial-energy",
    ],
  },
  {
    title: "CCTV & Access Control",
    href: "/store/cctv-access-control",
    rootCategoryIds: [CCTV_CATEGORY_ID],
    featuredCollectionHandles: ["cctv-security"],
  },
  {
    title: "Computer & Accessories",
    href: "/store/computer-accessories",
    rootCategoryIds: [COMPUTER_CATEGORY_ID],
    featuredCollectionHandles: ["laptops-and-computers"],
  },
  {
    title: "Groceries",
    href: "/store/groceries",
    rootCategoryIds: [GROCERIES_CATEGORY_ID],
    featuredCollectionHandles: [GROCERIES_COLLECTION_HANDLE],
  },
  // Power Solutions has its own landing page but its categories also appear
  // inside Solar Energy & Power above, so the tree is reachable two ways.
  // If that duplication is unwanted, drop pcat_yhkQTSA3IfaVwGVW from
  // SOLAR_CATEGORY_IDS and narrow that section to Solar Energy alone.
  {
    title: "Power Solutions",
    href: "/store/power-solutions",
    rootCategoryIds: [POWER_SOLUTIONS_CATEGORY_ID],
    featuredCollectionHandles: [POWER_SOLUTIONS_COLLECTION_HANDLE],
  },
  // Home Furniture (pcat_01KRSTATC3N1PR4GEJ7FVKNFYH — Indoor/Outdoor, Patio,
  // Bohemian cane; 26 products) is deliberately left out of the nav for now.
  // Re-add an entry here to bring it back; the /store/patio-furniture route
  // and the generic /categories/home-furniture page both still work.
]

/**
 * Below this many populated child categories a panel looks broken rather than
 * sparse, so it collapses to a single "Shop all …" link instead. Computer &
 * Accessories currently trips this: 26 products in the section but only
 * "Laptop" has any filed on a child, the rest sit on the "Gadgets" parent.
 */
export const MEGA_MENU_MIN_CHILDREN = 2
