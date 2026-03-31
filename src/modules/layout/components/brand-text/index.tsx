"use client"

import { usePathname } from "next/navigation"

export default function BrandText() {
  const pathname = usePathname()
  const isWholefoods = pathname.includes("/store/wholefoods")

  return (
    <span
      className={`font-bold text-xl tracking-tight hidden small:block ${
        isWholefoods ? "text-wholefoods-dark" : "text-ceedmart-navy"
      }`}
    >
      Ceedmart
    </span>
  )
}
