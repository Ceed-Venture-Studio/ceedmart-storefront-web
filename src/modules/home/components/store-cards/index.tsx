"use client"

import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function StoreCards() {
  const { countryCode } = useParams()

  return (
    <div className="grid grid-cols-1 small:grid-cols-2 gap-4 w-full max-w-2xl">
      {/* Whole Foods Card */}
      <LocalizedClientLink
        href="/store/wholefoods"
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-wholefoods-dark via-wholefoods to-wholefoods-accent p-6 small:p-8 flex flex-col justify-between min-h-[200px] small:min-h-[240px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20 text-wholefoods-light">
            <path d="M32 8c0 0-20 8-20 32 0 12 8 18 14 20 2-8 6-14 6-14s4 6 6 14c6-2 14-8 14-20C52 16 32 8 32 8z" />
          </svg>
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-white/25 rounded-full text-xs font-semibold text-wholefoods-light uppercase tracking-wider mb-3">
            Fresh & Organic
          </span>
          <h3 className="text-ceedmart-gold text-2xl small:text-3xl font-bold leading-tight drop-shadow-sm">
            Whole Foods
          </h3>
          <p className="text-white/80 text-sm mt-2 max-w-[200px]">
            Bulk groceries, organic produce & wholesale essentials
          </p>
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
          Order in bulk
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </LocalizedClientLink>

      {/* Tech Card */}
      <LocalizedClientLink
        href="/store/tech"
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-tech-dark via-tech to-tech-light p-6 small:p-8 flex flex-col justify-between min-h-[200px] small:min-h-[240px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20 text-white">
            <path d="M8 12a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12m4 0v28h40V12H12m-2 36h44v4H10v-4m16-22h12v2H26v-2m-4 6h20v2H22v-2" />
          </svg>
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-tech-light uppercase tracking-wider mb-3">
            Wholesale Electronics
          </span>
          <h3 className="text-white text-2xl small:text-3xl font-bold leading-tight drop-shadow-sm">
            Electronics & Solar
          </h3>
          <p className="text-white/80 text-sm mt-2 max-w-[200px]">
            Bulk electronics, gadgets, CCTV, solar & power solutions
          </p>
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
          Order in bulk
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
