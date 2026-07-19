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
export const CCTV_CATEGORY_IDS = [
  "pcat_R6q86na228bWwazs", // CCTV Cameras
]
export const CCTV_CATEGORY_HANDLES: string[] = []

// ─── Computer & Accessories ─────────────────────────────────────────────
// Laptops, monitors, peripherals and productivity gear.
export const COMPUTER_COLLECTION_IDS = [
  "pcol_LV4FJsLTGZvxDcvG", // Gadgets & Electronics
]
export const COMPUTER_COLLECTION_HANDLES: string[] = []
export const COMPUTER_CATEGORY_IDS = [
  "pcat_UqD4lQ3u8LH5vxfa", // Gadgets
]
export const COMPUTER_CATEGORY_HANDLES: string[] = []

// Patio furniture retained for the /store/patio-furniture route (not
// featured on the home page any more but still linkable / reachable).
export const PATIO_FURNITURE_COLLECTION_HANDLE = "patio-furniture"
export const PATIO_FURNITURE_CATEGORY_HANDLE = "patio-furniture"
