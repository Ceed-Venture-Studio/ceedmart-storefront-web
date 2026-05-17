/**
 * Store section configuration — maps each storefront section
 * to its Medusa collection IDs and category IDs for filtering.
 */

export const WHOLEFOODS_COLLECTION_IDS = [
  "pcol_FdRwpCMLGKC0axym", // Whole Foods
]

export const WHOLEFOODS_CATEGORY_ID = "pcat_bVBgkix17lsxYQKz" // Whole Foods parent

export const TECH_COLLECTION_IDS = [
  "pcol_LV4FJsLTGZvxDcvG", // Gadgets & Electronics
  "pcol_S9dK2WAvjJrNDEu6", // CCTV & Security
  "pcol_c6NBbr2rdcXfZkx7", // Solar Energy
  "pcol_5wgKuIDYxxeTo3ae", // Power Solutions
]

// Extra collections shown on the tech page by handle (admin can create
// these without redeploying — they appear automatically when the handle
// matches a published collection).
export const TECH_COLLECTION_HANDLES = ["solar-power-packages"]

export const SOLAR_PACKAGES_COLLECTION_HANDLE = "solar-power-packages"

export const TECH_CATEGORY_IDS = [
  "pcat_nXhMQPGwFlzi399y", // Solar Energy
  "pcat_R6q86na228bWwazs", // CCTV Cameras
  "pcat_UqD4lQ3u8LH5vxfa", // Gadgets
  "pcat_yhkQTSA3IfaVwGVW", // Power Solutions
]

// Same idea as TECH_COLLECTION_HANDLES — match categories by handle so
// admin can publish new ones without a redeploy.
export const TECH_CATEGORY_HANDLES = ["solar-power-packages"]

// Bohemian cane & home furniture. Backfill with real IDs in admin —
// while these are empty the page falls back to listing all products
// matching the parent category handle.
export const HOME_FURNITURE_COLLECTION_IDS: string[] = []
export const HOME_FURNITURE_CATEGORY_HANDLE = "home-furniture"
