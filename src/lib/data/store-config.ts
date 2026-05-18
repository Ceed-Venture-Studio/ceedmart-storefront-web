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

// Patio furniture — rattan dining/sitting sets, swings, etc. The page
// resolves products via the collection handle first (preferred), falling
// back to the parent category handle if the collection is not yet created.
export const PATIO_FURNITURE_COLLECTION_HANDLE = "patio-furniture"
export const PATIO_FURNITURE_CATEGORY_HANDLE = "patio-furniture"
