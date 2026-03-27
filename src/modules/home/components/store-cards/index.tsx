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
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-wholefoods-light via-wholefoods to-wholefoods-dark p-6 small:p-8 flex flex-col justify-between min-h-[200px] small:min-h-[240px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="absolute top-4 right-4 text-5xl small:text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 small:w-20 small:h-20 text-wholefoods-dark">
            <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4m0 4c2.4 0 4.8 2 6 5.2.8 2.2 1.2 5 1.4 8.8H24.6c.2-3.8.6-6.6 1.4-8.8C27.2 10 29.6 8 32 8m-11.4 14h22.8c.1 1.9.2 4 .2 6H20.4c0-2 .1-4.1.2-6M8 32c0-7.2 3.2-13.7 8.2-18.1-.4 2.5-.6 5.4-.8 8.5V28h-3.8c-.4 1.3-.6 2.6-.6 4zm4.6 4h4c.3 5.5 1.2 10.3 2.6 13.8C14.4 45.8 10.8 40.3 12.6 36m8-8h-4.2c.2-3.6.5-6.8 1-9.5C19.6 16.2 22.4 14.6 22 18c-.3 2.4-.5 6-.6 10m0 8c.2 5.6.8 10.4 1.6 13.6-1.4-1-2.6-2.2-3.6-3.6-1-2.8-1.7-6.2-2-10m3.4 0h16c-.2 4.4-.8 8.2-1.6 11-1.2 3.2-3.6 5.2-6 5.2s-4.8-2-6-5.2c-.8-2.8-1.4-6.6-1.6-11m16.4 0c-.3 3.8-.7 7.2-1.4 10-1 3.4-2.6 5.6-4.6 7 5.4-1.6 10-5.6 12.8-10.8-.6-.2-1-1-1-1.8V36zm3.2 0h4c1.8 4.3-1.8 9.8-6.6 13.8 1.4-3.5 2.3-8.3 2.6-13.8m0-8h4.2c.4 1.3.6 2.6.6 4h-4.6c0-1.4-.1-2.7-.2-4m-.4-4c-.5-3.4-.8-6.6-1-9.5 2.2 2.3 4 5.1 5.2 8.2l.2 1.3zm-1-13.6c1.4 3.5 2.3 8.3 2.6 13.6h-4c-.3-5.5-1.2-10.3-2.6-13.8 1.4.1 2.8.1 4 .2"/>
          </svg>
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-xs font-semibold text-wholefoods-dark uppercase tracking-wider mb-3">
            Fresh & Natural
          </span>
          <h3 className="text-white text-2xl small:text-3xl font-bold leading-tight drop-shadow-sm">
            Whole Foods
          </h3>
          <p className="text-white/80 text-sm mt-2 max-w-[200px]">
            Fresh groceries, organic produce & everyday essentials
          </p>
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
          Shop now
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
            Gadgets & More
          </span>
          <h3 className="text-white text-2xl small:text-3xl font-bold leading-tight drop-shadow-sm">
            Tech Store
          </h3>
          <p className="text-white/80 text-sm mt-2 max-w-[200px]">
            Laptops, gadgets, CCTV, solar & power solutions
          </p>
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
          Shop now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
