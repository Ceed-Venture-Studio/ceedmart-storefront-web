import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function AdBanner() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-ceedmart-navy to-ceedmart-navy-light p-6 small:p-10 flex flex-col small:flex-row items-center gap-6 small:gap-10">
      <div className="flex-shrink-0">
        <Image
          src="/logo-icon.svg"
          alt="CeedMart"
          width={72}
          height={72}
          className="h-16 w-16 small:h-[72px] small:w-[72px]"
        />
      </div>
      <div className="flex-1 text-center small:text-left">
        <h2 className="text-white text-xl small:text-2xl font-bold mb-1">
          Wholesale & Bulk Orders
        </h2>
        <p className="text-white/70 text-sm small:text-base">
          Wholesale prices on bulk orders. Quality products for businesses and resellers.
        </p>
      </div>
      <LocalizedClientLink
        href="/store"
        className="flex-shrink-0 px-6 py-3 rounded-full bg-ceedmart-gold text-ceedmart-navy font-semibold text-sm hover:bg-ceedmart-gold/90 transition-colors"
      >
        Browse Wholesale
      </LocalizedClientLink>
    </div>
  )
}
