/**
 * Delivery locations Ceedmart serves.
 *
 * Single source of truth — the location picker, the WhatsApp order message
 * and the checkout hand-off all read from here so a new city is one entry.
 */
export type DeliveryLocation = {
  id: string
  /** Shown in the picker and echoed into the WhatsApp order text. */
  name: string
  state: string
  /** Short promise shown under the name in the picker. */
  note: string
}

export const DELIVERY_LOCATIONS: DeliveryLocation[] = [
  {
    id: "port-harcourt",
    name: "Port Harcourt",
    state: "Rivers",
    note: "Same-day delivery available",
  },
  { id: "uyo", name: "Uyo", state: "Akwa Ibom", note: "Next-day delivery" },
  { id: "lagos", name: "Lagos", state: "Lagos", note: "Next-day delivery" },
]

/** Cookie name — readable by both the client picker and server components. */
export const DELIVERY_LOCATION_COOKIE = "ceedmart_delivery_location"

/** Orders at or above this subtotal (in naira) ship free. */
export const FREE_DELIVERY_THRESHOLD_NGN = 30_000

/** Support line. Same number already used by careers, order help and solar. */
export const SUPPORT_WHATSAPP_NUMBER = "2347087502195"

export const SUPPORT_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello CeedMart, I'd like some help with an order."
)}`

/**
 * Builds a WhatsApp order message. The delivery city is appended when the
 * shopper has chosen one, so orders placed over WhatsApp carry a location
 * just like checkout orders do.
 */
export const buildWhatsAppOrderUrl = (
  lines: string[],
  location?: DeliveryLocation | null
): string => {
  const parts = [...lines]
  if (location) {
    parts.push(`Delivery location: ${location.name}, ${location.state}.`)
  }
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    parts.join(" ")
  )}`
}

export const getLocationById = (
  id?: string | null
): DeliveryLocation | undefined =>
  DELIVERY_LOCATIONS.find((location) => location.id === id)
