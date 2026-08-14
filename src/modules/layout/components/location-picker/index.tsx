"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"

import { useDeliveryLocation } from "@lib/context/delivery-location-context"
import { DELIVERY_LOCATIONS } from "@lib/data/delivery-locations"

/**
 * Delivery location picker.
 *
 * Opens automatically on first visit (no cookie), and on demand from the
 * nav chip. The choice drives the WhatsApp order message and pre-fills the
 * checkout address city, so orders arriving by either route carry a location.
 *
 * Not dismissible by backdrop click on first run — an order without a
 * location is the thing we're trying to avoid — but always escapable once a
 * location exists.
 */
export default function LocationPicker() {
  const { location, isPickerOpen, closePicker, setLocation } =
    useDeliveryLocation()

  const isFirstRun = !location

  return (
    <Transition show={isPickerOpen} as={Fragment}>
      <Dialog
        onClose={() => {
          if (!isFirstRun) closePicker()
        }}
        className="relative z-[75]"
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ceedmart-navy/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 small:p-8 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl small:text-2xl font-bold text-grey-90">
                      Where are we delivering?
                    </h2>
                    <p className="mt-1.5 text-sm text-grey-60">
                      Pick your city so we can show delivery times and get your
                      order to the right place.
                    </p>
                  </div>
                  {!isFirstRun && (
                    <button
                      onClick={closePicker}
                      aria-label="Close"
                      className="shrink-0 text-grey-40 hover:text-grey-70 text-xl leading-none p-1"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {DELIVERY_LOCATIONS.map((option) => {
                    const isSelected = location?.id === option.id
                    return (
                      <li key={option.id}>
                        <button
                          onClick={() => setLocation(option)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? "border-ceedmart-navy bg-ceedmart-navy/5"
                              : "border-grey-20 hover:border-ceedmart-navy hover:bg-ceedmart-navy/5"
                          }`}
                        >
                          <span>
                            <span className="block text-base font-semibold text-grey-90">
                              {option.name}
                            </span>
                            <span className="block text-xs text-grey-55 mt-0.5">
                              {option.state} &middot; {option.note}
                            </span>
                          </span>
                          <svg
                            className="w-5 h-5 text-ceedmart-navy shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={
                                isSelected
                                  ? "M5 13l4 4L19 7"
                                  : "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              }
                            />
                          </svg>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <p className="mt-5 text-xs text-grey-50 text-center">
                  You can change this any time from the top of the page.
                </p>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
