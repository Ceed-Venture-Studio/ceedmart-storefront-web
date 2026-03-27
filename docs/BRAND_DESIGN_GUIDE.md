# CeedMart Brand Design Guide

> Reference document for implementing brand identity across the storefront

---

## Logo

- **Primary logo file:** `LOGO FILES/CEEDMART-01.png` (badge icon)
- **Logo variants available:**
  - `CEEDMART-01` — Badge icon only (standalone mark)
  - `CEEDMART-06` — Wordmark only ("Ceedmart - General Merchandise")
  - `CEEDMART-10` — Circular badge with text around perimeter
  - `CEEDMART-11` — Circular badge with border ring
  - `CEEDMART-12` — Stacked: badge icon above wordmark
  - `CEEDMART-14` — Horizontal: badge icon + wordmark side by side
  - `CEEDMART-15` — Wordmark only (navy blue, no icon)
- **Formats:** PNG and SVG for each variant

---

## Colors

### Primary Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Primary** | Navy Blue | `#05007F` | Brand text, headings, buttons, badge fill, links |
| **Secondary** | Golden Yellow | `#FFCE00` | Accents, highlights, CTAs, badge bars, badges |

### Gradient (Badge Icon)

The badge icon uses a diagonal linear gradient:

| Stop | Color | Hex |
|------|-------|-----|
| 0% | Light Blue | `#15A6FF` |
| 45% | Medium Blue | `#0037BF` |
| 100% | Navy Blue | `#05007F` |

### Supporting Colors (to be finalized)

| Role | Suggested | Notes |
|------|-----------|-------|
| Background | `#FFFFFF` | Clean white |
| Surface/Card | `#F9FAFB` | Subtle grey for cards/sections |
| Text Primary | `#05007F` | Navy blue (brand) |
| Text Secondary | `#4B5563` | Grey for body/secondary text |
| Success | TBD | Order confirmations, stock status |
| Error | TBD | Form errors, alerts |
| Warning | TBD | Stock warnings |

---

## Typography

### Font Family: Gilroy

| Weight | Usage |
|--------|-------|
| **Gilroy Bold (700)** | Headings, logo text, CTAs, navigation |
| Gilroy SemiBold (600) | Subheadings, product titles |
| Gilroy Medium (500) | Body text, form labels |
| Gilroy Regular (400) | Body text, descriptions |

### Scale

| Element | Size | Weight |
|---------|------|--------|
| H1 | 48px / 3rem | Bold |
| H2 | 36px / 2.25rem | Bold |
| H3 | 24px / 1.5rem | SemiBold |
| H4 | 20px / 1.25rem | SemiBold |
| Body | 16px / 1rem | Regular/Medium |
| Small | 14px / 0.875rem | Regular |
| Caption | 12px / 0.75rem | Regular |

---

## Brand Identity

- **Brand name:** Ceedmart
- **Tagline:** General Merchandise
- **Icon:** Scalloped/starburst badge with three horizontal rounded bars
- **Style:** Modern, bold, trustworthy — navy and gold convey reliability and value

---

## Implementation Notes

- The Gilroy font must be self-hosted (it is a commercial font, not on Google Fonts)
- Font files should be placed in `public/fonts/` or `src/assets/fonts/`
- Use `next/font/local` for optimal loading in Next.js
- The primary logo (`CEEDMART-01.png`) should be copied to `public/` for use in the app
- SVG variants can be used as inline components for better control
