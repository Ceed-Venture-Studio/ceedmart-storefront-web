import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getStoreMenu } from "@lib/data/menu"
import MegaMenu from "@modules/layout/components/mega-menu"
import { ShoppingBag, User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandText from "@modules/layout/components/brand-text"
import CartButton from "@modules/layout/components/cart-button"
import NavSearchSlot from "@modules/layout/components/nav-search-slot"
import SideMenu from "@modules/layout/components/side-menu"
import LocationChip from "@modules/layout/components/location-chip"

export default async function Nav() {
  const [regions, locales, currentLocale, menuSections] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getStoreMenu(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        {/* NB: the mega menu row below adds height to this sticky wrapper on
            desktop. Anything positioned against the header should measure it
            rather than assume the bare h-16. */}
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                sections={menuSections}
              />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-2 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo.png"
                alt="CeedMart"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <BrandText />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 small:gap-x-6 h-full flex-1 basis-0 justify-end">
            <LocationChip />
            <NavSearchSlot />
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ceedmart-navy"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="w-7 h-7 small:w-8 small:h-8" />
              </LocalizedClientLink>
            </div>
            <div className="hidden small:block">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ceedmart-navy"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <ShoppingBag className="w-7 h-7 small:w-8 small:h-8" />
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>

      <MegaMenu sections={menuSections} />
    </div>
  )
}
