import Image from "next/image"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const WHATSAPP_NUMBER = "2347087502195"
const WHATSAPP_DISPLAY = "+234 708 750 2195"
const SUPPORT_EMAIL = "hello@ceedmart.com"

const buildWhatsApp = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-grey-20 text-grey-70 hover:border-ceedmart-navy hover:text-ceedmart-navy transition-colors"
  >
    {children}
  </a>
)

const Column = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-wide text-ceedmart-navy">
      {title}
    </span>
    <ul className="flex flex-col gap-2 text-ui-fg-subtle text-sm">
      {children}
    </ul>
  </div>
)

const FooterLink = ({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) => {
  const cls = "hover:text-ceedmart-navy transition-colors"
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <LocalizedClientLink href={href} className={cls}>
      {children}
    </LocalizedClientLink>
  )
}

export default async function Footer() {
  const [categoriesRes, collectionsRes] = await Promise.all([
    listCategories(),
    listCollections({ fields: "*products" }),
  ])

  const collections = collectionsRes?.collections || []
  const categories = categoriesRes || []
  const topCategories = categories.filter((c) => !c.parent_category).slice(0, 6)

  return (
    <footer className="border-t border-ui-border-base w-full hidden small:block bg-grey-5">
      <div className="content-container flex flex-col w-full">
        {/* Top — brand intro + columns */}
        <div className="grid grid-cols-12 gap-10 py-14">
          {/* Brand */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="CeedMart"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-ceedmart-navy font-bold text-xl tracking-tight">
                Ceedmart
              </span>
            </LocalizedClientLink>
            <p className="text-ui-fg-subtle text-sm leading-relaxed">
              Wholesale & bulk orders across whole foods, electronics, solar,
              and home furniture — direct from CeedMart with fast Lagos &
              Port Harcourt delivery.
            </p>

            <div className="flex flex-col gap-2 mt-2 text-sm text-ui-fg-subtle">
              <a
                href={buildWhatsApp(
                  "Hello CeedMart, I'd like to enquire about wholesale orders."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ceedmart-navy transition-colors"
              >
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="hover:text-ceedmart-navy transition-colors"
              >
                Email: {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <SocialIcon
                href="https://instagram.com/ceedmart"
                label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.5.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.4 1 .5 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.5 2.2-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.2-1 .4-2.2.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.5-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.4-.4-1-.5-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.5-2.2.2-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.2 1-.4 2.2-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8s-.6.8-.8 1.3c-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.8 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3s.8.6 1.3.8c.4.2 1 .3 2.1.4 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8s.6-.8.8-1.3c.2-.4.3-1 .4-2.1.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3s-.8-.6-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.5-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm5.1-8.3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://facebook.com/ceedmart"
                label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.2V22A10 10 0 0 0 22 12z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://x.com/ceedmart" label="X / Twitter">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18.244 2H21l-6.546 7.48L22 22h-6.789l-4.766-6.226L4.8 22H2l7.012-8.014L2 2h6.953l4.3 5.71L18.244 2zm-1.187 18h1.832L7.06 4H5.11l11.947 16z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://linkedin.com/company/ceedmart"
                label="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 18H6V10h2.5v8zM7.2 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18 18h-2.5v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V18H10V10h2.4v1.1h.03a2.6 2.6 0 0 1 2.4-1.3c2.6 0 3.1 1.7 3.1 3.9V18z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Shop */}
          <div className="col-span-6 md:col-span-2">
            <Column title="Shop">
              <li>
                <FooterLink href="/store">All products</FooterLink>
              </li>
              <li>
                <FooterLink href="/store/wholefoods">Whole Foods</FooterLink>
              </li>
              <li>
                <FooterLink href="/store/tech">Electronics & Solar</FooterLink>
              </li>
              <li>
                <FooterLink href="/store/patio-furniture">
                  Patio Furniture
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/solar">Get a solar estimate</FooterLink>
              </li>
            </Column>
          </div>

          {/* Categories (dynamic) */}
          {topCategories.length > 0 && (
            <div className="col-span-6 md:col-span-2">
              <Column title="Categories">
                {topCategories.map((c) => (
                  <li key={c.id}>
                    <FooterLink href={`/categories/${c.handle}`}>
                      {c.name}
                    </FooterLink>
                  </li>
                ))}
              </Column>
            </div>
          )}

          {/* Collections (dynamic) */}
          {collections.length > 0 && (
            <div className="col-span-6 md:col-span-2">
              <Column title="Collections">
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <FooterLink href={`/collections/${c.handle}`}>
                      {c.title}
                    </FooterLink>
                  </li>
                ))}
              </Column>
            </div>
          )}

          {/* Support */}
          <div className="col-span-6 md:col-span-2 lg:col-span-3">
            <Column title="Customer service">
              <li>
                <FooterLink
                  href={buildWhatsApp(
                    "Hello CeedMart, I need help with my order."
                  )}
                  external
                >
                  Help on WhatsApp
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={buildWhatsApp(
                    "Hello CeedMart, I'd like to enquire about a return or exchange."
                  )}
                  external
                >
                  Returns & exchanges
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={buildWhatsApp(
                    "Hello CeedMart, I'd like to enquire about wholesale orders."
                  )}
                  external
                >
                  Wholesale enquiries
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/account">My account</FooterLink>
              </li>
              <li>
                <FooterLink href="/cart">My cart</FooterLink>
              </li>
            </Column>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between py-6 border-t border-grey-20 text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} CeedMart. All rights reserved.
          </Text>
          <div className="text-xs text-grey-50">
            Free delivery in Lagos & Port Harcourt · ₦30,000 minimum order
          </div>
        </div>
      </div>
    </footer>
  )
}
