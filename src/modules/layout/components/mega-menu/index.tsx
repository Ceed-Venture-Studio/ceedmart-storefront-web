"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { MenuSection } from "@lib/data/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Grace period so a diagonal mouse path from the trigger into the panel
 *  doesn't close it mid-travel. */
const CLOSE_DELAY_MS = 120

export default function MegaMenu({ sections }: { sections: MenuSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const open = useCallback(
    (index: number) => {
      cancelClose()
      setOpenIndex(index)
    },
    [cancelClose]
  )

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenIndex(null), CLOSE_DELAY_MS)
  }, [cancelClose])

  const closeNow = useCallback(() => {
    cancelClose()
    setOpenIndex(null)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [openIndex, closeNow])

  if (!sections.length) return null

  return (
    <div
      className="hidden small:block relative bg-white border-b border-ui-border-base"
      onMouseLeave={scheduleClose}
      // Close once focus leaves the whole bar, so keyboard users aren't left
      // with an orphaned panel open behind them.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          closeNow()
        }
      }}
    >
      <nav className="content-container" aria-label="Shop categories">
        <ul className="flex items-stretch gap-x-1">
          {sections.map((section, index) => {
            const isOpen = openIndex === index
            return (
              <li key={section.href} className="flex">
                <LocalizedClientLink
                  href={section.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isOpen
                      ? "text-ceedmart-navy border-ceedmart-navy"
                      : "text-grey-70 border-transparent hover:text-ceedmart-navy"
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onMouseEnter={() => open(index)}
                  onFocus={() => open(index)}
                  onClick={closeNow}
                >
                  {section.title}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {openIndex !== null && (
        <div
          className="absolute inset-x-0 top-full bg-white border-b border-ui-border-base shadow-lg z-40"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="content-container py-8">
            <SectionPanel
              section={sections[openIndex]}
              onNavigate={closeNow}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function SectionPanel({
  section,
  onNavigate,
}: {
  section: MenuSection
  onNavigate: () => void
}) {
  // Only label the columns when a section merges more than one root category
  // (Solar = Solar Energy + Power Solutions). A single unlabelled column reads
  // better than one redundantly repeating the section title above it.
  const showGroupHeadings = section.groups.length > 1

  return (
    <div className="flex flex-col gap-6">
      {section.isSparse ? (
        // Too few populated child categories to fill a panel — a stub of one
        // or two links looks broken next to a seven-row section, so collapse
        // to the section link and let the rest fill in as stock is filed.
        <LocalizedClientLink
          href={section.href}
          onClick={onNavigate}
          className="text-sm font-semibold text-ceedmart-navy hover:underline"
        >
          Shop all {section.title} &rarr;
        </LocalizedClientLink>
      ) : (
        <div className="grid grid-cols-2 medium:grid-cols-4 gap-x-8 gap-y-6">
          {section.groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              {showGroupHeadings && (
                <LocalizedClientLink
                  href={group.href}
                  onClick={onNavigate}
                  className="text-xs font-semibold uppercase tracking-wider text-grey-50 hover:text-ceedmart-navy"
                >
                  {group.name}
                </LocalizedClientLink>
              )}
              <ul className="flex flex-col gap-1.5">
                {group.children.map((child) => (
                  <li key={child.id}>
                    <LocalizedClientLink
                      href={child.href}
                      onClick={onNavigate}
                      className="text-sm text-grey-70 hover:text-ceedmart-navy hover:underline"
                    >
                      {child.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.featured.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-grey-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-50 mr-1">
            Featured
          </span>
          {section.featured.map((collection) => (
            <LocalizedClientLink
              key={collection.id}
              href={collection.href}
              onClick={onNavigate}
              className="px-3 py-1.5 rounded-full border border-grey-20 text-xs font-medium text-grey-70 hover:border-ceedmart-navy hover:text-ceedmart-navy hover:bg-ceedmart-navy/5 transition-all"
            >
              {collection.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}

      {!section.isSparse && (
        <LocalizedClientLink
          href={section.href}
          onClick={onNavigate}
          className="text-sm font-semibold text-ceedmart-navy hover:underline"
        >
          Shop all {section.title} &rarr;
        </LocalizedClientLink>
      )}
    </div>
  )
}
