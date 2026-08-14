"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  DELIVERY_LOCATION_COOKIE,
  DeliveryLocation,
  getLocationById,
} from "@lib/data/delivery-locations"

type DeliveryLocationContextValue = {
  location: DeliveryLocation | null
  /** True until the cookie has been read, so nothing flashes on first paint. */
  isLoaded: boolean
  /** True when the picker should be shown (no choice stored yet). */
  needsSelection: boolean
  setLocation: (location: DeliveryLocation) => void
  openPicker: () => void
  closePicker: () => void
  isPickerOpen: boolean
}

const DeliveryLocationContext =
  createContext<DeliveryLocationContextValue | null>(null)

// A year — the choice is a convenience, not a session detail.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

export const DeliveryLocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [location, setLocationState] = useState<DeliveryLocation | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  useEffect(() => {
    const stored = getLocationById(readCookie(DELIVERY_LOCATION_COOKIE))
    if (stored) setLocationState(stored)
    setIsLoaded(true)
    // Prompt only when nothing is stored. Never re-prompt a returning
    // customer who has already chosen.
    if (!stored) setIsPickerOpen(true)
  }, [])

  const setLocation = useCallback((next: DeliveryLocation) => {
    setLocationState(next)
    // Written as a cookie rather than localStorage so server components and
    // the checkout hand-off can read it too.
    document.cookie = `${DELIVERY_LOCATION_COOKIE}=${encodeURIComponent(
      next.id
    )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
    setIsPickerOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      location,
      isLoaded,
      needsSelection: isLoaded && !location,
      setLocation,
      openPicker: () => setIsPickerOpen(true),
      closePicker: () => setIsPickerOpen(false),
      isPickerOpen,
    }),
    [location, isLoaded, isPickerOpen, setLocation]
  )

  return (
    <DeliveryLocationContext.Provider value={value}>
      {children}
    </DeliveryLocationContext.Provider>
  )
}

export const useDeliveryLocation = () => {
  const context = useContext(DeliveryLocationContext)
  if (!context) {
    throw new Error(
      "useDeliveryLocation must be used within a DeliveryLocationProvider"
    )
  }
  return context
}
