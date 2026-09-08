import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getStoreMenu } from "@lib/data/menu"
import { retrieveCustomer } from "@lib/data/customer"
import MegaMenu from "@modules/layout/components/mega-menu"
import CommerceNav from "@modules/layout/components/commerce-nav"
import { ShoppingBag, User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandText from "@modules/layout/components/brand-text"
import CartButton from "@modules/layout/components/cart-button"
import NavSearchSlot from "@modules/layout/components/nav-search-slot"
import SideMenu from "@modules/layout/components/side-menu"
import LocationChip from "@modules/layout/components/location-chip"
import NavAction from "@modules/layout/components/nav-action"

export default async function Nav() {
  const [regions, locales, currentLocale, menuSections, customer] =
    await Promise.all([
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      getStoreMenu(),
      // Never let a signed-out session, or a customer lookup that fails,
      // take down the whole header — the nav renders for everyone.
      retrieveCustomer().catch(() => null),
    ])

  // First name only. "Hi, Victor" is a greeting; the full legal name in a
  // nav is a database record.
  const firstName = customer?.first_name?.trim().split(/\s+/)[0]

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

          <div className="flex items-center gap-x-3 small:gap-x-4 h-full flex-1 basis-0 justify-end">
            <LocationChip />
            <NavSearchSlot />
            <div className="hidden small:flex items-center h-full">
              <NavAction
                href="/account"
                testId="nav-account-link"
                icon={<User className="w-6 h-6" />}
                hint={firstName ? `Hi, ${firstName}` : "Hello, sign in"}
                label="Account"
              />
            </div>
            <div className="hidden small:block">
              <Suspense
                fallback={
                  // The same button with no count, so the cart does not
                  // change shape when the real one arrives.
                  <NavAction
                    href="/cart"
                    testId="nav-cart-link"
                    icon={<ShoppingBag className="w-6 h-6" />}
                    hint="Your items"
                    label="Cart"
                  />
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>

      <MegaMenu sections={menuSections} />

      {/* Commerce-type destinations (§9.1). Renders nothing while every
          feature flag is off, so today's nav is unchanged. */}
      <CommerceNav />
    </div>
  )
}
