# CeedMart Storefront Web - Codebase Summary

> Generated: 2026-03-26 | Pre-change reference document

## Overview

A **production-ready e-commerce storefront** built with **Next.js 15** (App Router) and **Medusa.js** as the headless commerce backend. The app provides a full shopping experience: product browsing, cart management, multi-step checkout, customer accounts, and order management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3.9 (App Router, Turbopack dev) |
| UI Library | React 19.0.4 |
| Language | TypeScript 5.3.2 |
| Styling | Tailwind CSS 3.0.23 + @medusajs/ui-preset |
| Commerce Backend | Medusa.js via @medusajs/js-sdk |
| UI Components | @medusajs/ui, @headlessui/react, @radix-ui/react-accordion |
| Payments | Stripe, PayPal, iDEAL, Bancontact, Medusa Payments |
| Package Manager | Yarn 4.12.0 |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # 404 page
│   └── [countryCode]/      # Dynamic region routing
│       ├── (main)/         # Main storefront (nav + footer)
│       │   ├── page.tsx              # Homepage
│       │   ├── store/                # Product catalog
│       │   ├── products/[handle]/    # Product detail pages
│       │   ├── collections/[handle]/ # Collection pages
│       │   ├── categories/[...]/     # Category pages (catch-all)
│       │   ├── cart/                 # Shopping cart
│       │   ├── account/              # Customer account (parallel routes)
│       │   │   ├── @dashboard/       # Authenticated view
│       │   │   └── @login/           # Unauthenticated view
│       │   └── order/[id]/           # Order details & transfers
│       └── (checkout)/     # Checkout flow (minimal layout)
│           └── checkout/
│
├── modules/                # Feature modules (domain-driven)
│   ├── account/            # Auth, profile, addresses, order history
│   ├── cart/               # Cart display and line item management
│   ├── checkout/           # Multi-step checkout flow
│   ├── products/           # Product detail, gallery, actions, pricing
│   ├── collections/        # Collection browsing
│   ├── categories/         # Category browsing
│   ├── store/              # Catalog with pagination, sorting, filtering
│   ├── order/              # Order confirmation and details
│   ├── home/               # Hero banner, featured products
│   ├── layout/             # Nav, footer, cart dropdown, region selector
│   ├── common/             # Shared UI (inputs, modals, links, icons)
│   ├── shipping/           # Free shipping nudge
│   └── skeletons/          # Loading skeleton placeholders
│
├── lib/                    # Core utilities and data layer
│   ├── config.ts           # Medusa SDK initialization
│   ├── constants.tsx        # Payment provider map, currency constants
│   ├── data/               # Server Actions for all API communication
│   │   ├── cart.ts         #   Cart CRUD, promotions, shipping, payment
│   │   ├── customer.ts     #   Auth, profile, addresses
│   │   ├── orders.ts       #   Order retrieval, transfers
│   │   ├── products.ts     #   Product listing with sorting
│   │   ├── regions.ts      #   Region/country resolution
│   │   ├── categories.ts   #   Category queries
│   │   ├── collections.ts  #   Collection queries
│   │   ├── payment.ts      #   Payment methods
│   │   ├── fulfillment.ts  #   Shipping options
│   │   ├── locales.ts      #   Available locales
│   │   ├── locale-actions.ts # Locale preferences (cookie-based)
│   │   ├── cookies.ts      #   Cookie/auth header management
│   │   └── onboarding.ts   #   Onboarding state
│   ├── hooks/              # Custom React hooks
│   │   ├── use-toggle-state.tsx  # Boolean state management
│   │   └── use-in-view.tsx       # Intersection Observer
│   ├── util/               # Helper functions
│   │   ├── money.ts              # Currency formatting
│   │   ├── get-product-price.ts  # Price extraction from variants
│   │   ├── sort-products.ts      # Client-side sorting
│   │   ├── compare-addresses.ts  # Address comparison
│   │   └── ...
│   └── context/            # React context providers
│       └── modal-context.tsx
│
├── styles/
│   └── globals.css         # Tailwind directives + custom utilities
│
├── types/
│   ├── global.ts           # FeaturedProduct, VariantPrice, StoreFreeShippingPrice
│   └── icon.ts             # IconProps
│
└── middleware.ts            # Region detection, country routing, cache setup
```

---

## Architecture & Key Patterns

### Server-First Rendering
- **Server Components by default** - all pages and layouts are server components
- **Client Components** only where interactivity is needed (forms, dropdowns, modals)
- **Server Actions** (`"use server"`) for all data mutations and API calls
- **Suspense boundaries** with skeleton fallbacks for streaming

### Data Flow
```
Page (Server Component)
  → lib/data/* (Server Action)
    → Medusa JS SDK
      → Medusa Backend API
  → Module Template (Server/Client Component)
    → UI Components
```

### Caching Strategy
- `force-cache` on read operations with tag-based revalidation
- Per-user cache isolation via `_medusa_cache_id` cookie
- Cache tags: `products-{id}`, `carts-{id}`, `customers-{id}`, `orders-{id}`, etc.
- Mutations call `revalidateTag()` to invalidate relevant caches

### Routing
- **Dynamic country segment** `[countryCode]` for multi-region support
- **Route groups**: `(main)` with full nav/footer, `(checkout)` with minimal UI
- **Parallel routes**: Account page uses `@dashboard` / `@login` slots
- **Catch-all route**: Categories use `[...category]` for nested paths
- **Static generation**: `generateStaticParams` for product/collection pages

### Middleware (`src/middleware.ts`)
- Detects country from URL path, Vercel IP header, or default region
- Fetches and caches region-to-country mapping (1-hour TTL)
- Redirects to correct country-prefixed URL
- Sets cache isolation cookie

---

## Feature Modules

### Account (`src/modules/account/`)
- Login / Register forms
- Profile editing (name, email, phone, password)
- Address book with full CRUD
- Order history overview
- Order transfer requests

### Cart (`src/modules/cart/`)
- Cart page with line items
- Item quantity updates and removal
- Cart preview dropdown in header
- Sign-in prompt for guests
- Empty cart state

### Checkout (`src/modules/checkout/`)
- Multi-step flow: Addresses → Shipping → Payment → Review
- Saved address selection or new entry
- Separate billing address support
- Shipping method selection with pricing
- Payment provider selection (Stripe, PayPal, manual)
- Discount/promo code application

### Products (`src/modules/products/`)
- Product detail page with image gallery
- Variant/option selection
- Add to cart with quantity
- Price display with discount calculation
- Related products section
- Tabbed content (description, details)

### Store (`src/modules/store/`)
- Paginated product grid
- Sort by price (asc/desc) or latest
- Refinement/filter controls

### Order (`src/modules/order/`)
- Order confirmation page
- Order detail view (items, shipping, payment, totals)
- Order transfer flow (request, accept, decline)

### Layout (`src/modules/layout/`)
- Header navigation with cart button
- Cart dropdown preview
- Country/region selector
- Language/locale selector
- Mobile side menu
- Footer with links

---

## Payment Integrations

| Provider ID | Type |
|------------|------|
| `pp_stripe_stripe` | Stripe (credit card) |
| `pp_stripe-ideal_stripe` | iDEAL (Netherlands) |
| `pp_stripe-bancontact_stripe` | Bancontact (Belgium) |
| `pp_paypal_paypal` | PayPal |
| `pp_medusa-payments_default` | Medusa native payments |
| `pp_system_default` | Manual / cash |

---

## Internationalization

- **Multi-region**: Country code in URL drives region, currency, and shipping
- **Multi-locale**: Cookie-based locale preference (`_medusa_locale`)
- **Language selector**: Dropdown in header fetches available locales from backend
- **Localized links**: `LocalizedClientLink` component auto-prefixes country code
- **API headers**: Locale header injected into all Medusa SDK requests

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MEDUSA_BACKEND_URL` | Medusa backend API URL |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Public API key for storefront |
| `NEXT_PUBLIC_BASE_URL` | Storefront base URL |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default country code (ISO-2) |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY` | Medusa Payments key |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID` | Medusa Payments account ID |
| `REVALIDATE_SECRET` | On-demand revalidation secret |
| `MEDUSA_CLOUD_S3_HOSTNAME` | S3 hostname for image optimization |
| `MEDUSA_CLOUD_S3_PATHNAME` | S3 path prefix |

---

## Authentication

- **JWT-based**: Token stored in `_medusa_jwt` httpOnly cookie
- **Auth flow**: Email/password via `sdk.auth.login()` → JWT token → cookie
- **Cart transfer**: Anonymous cart transferred to customer on login
- **Session**: Cookie-based, secure in production

---

## Cookies Used

| Cookie | Purpose |
|--------|---------|
| `_medusa_jwt` | Authentication JWT token |
| `_medusa_cart_id` | Current cart identifier |
| `_medusa_cache_id` | Per-request cache isolation |
| `_medusa_region` | Cached region data (1-hour TTL) |
| `_medusa_locale` | Locale preference |

---

## Testing

No testing framework is currently configured. No test files exist in the codebase.

---

## Build & Development

```bash
yarn dev        # Start dev server on port 8000 (Turbopack)
yarn build      # Production build
yarn start      # Start production server
yarn lint       # Run ESLint
yarn analyze    # Bundle analysis
```

---

## Key Files for Common Changes

| Task | Files to modify |
|------|----------------|
| Add a new page | `src/app/[countryCode]/(main)/your-page/page.tsx` |
| Add a new module | `src/modules/your-module/components/` + `templates/` |
| Add API integration | `src/lib/data/your-data.ts` |
| Modify navigation | `src/modules/layout/templates/nav/index.tsx` |
| Modify footer | `src/modules/layout/templates/footer/index.tsx` |
| Add a payment provider | `src/lib/constants.tsx` + `src/modules/checkout/components/payment/` |
| Change styling/theme | `tailwind.config.js` + `src/styles/globals.css` |
| Add environment variable | `.env.template` + `next.config.js` (if image domain) |
| Modify middleware | `src/middleware.ts` |
