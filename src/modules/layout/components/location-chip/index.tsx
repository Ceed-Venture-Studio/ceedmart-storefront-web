"use client"

import { useDeliveryLocation } from "@lib/context/delivery-location-context"

/** Compact "Deliver to <city>" control in the nav — opens the picker. */
export default function LocationChip() {
  const { location, isLoaded, openPicker } = useDeliveryLocation()

  // Render nothing until the cookie is read, so the label never flips from
  // "Set location" to a city on hydration.
  if (!isLoaded) return null

  return (
    <button
      onClick={openPicker}
      className="flex items-center gap-1.5 text-xs small:text-sm text-grey-60 hover:text-ceedmart-navy transition-colors max-w-[9rem] small:max-w-none"
      aria-label="Change delivery location"
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
      <span className="truncate">
        {location ? (
          <>
            <span className="text-grey-50">Deliver to </span>
            <span className="font-semibold text-grey-80">{location.name}</span>
          </>
        ) : (
          <span className="font-semibold">Set location</span>
        )}
      </span>
    </button>
  )
}
