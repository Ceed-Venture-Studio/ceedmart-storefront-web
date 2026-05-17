import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

// On-demand revalidation endpoint, called by the Medusa backend's
// storefront-revalidate subscriber whenever a global resource changes
// (product/category/collection/region). Authenticated by a shared secret in
// REVALIDATE_SECRET so untrusted callers can't spam Next.js cache flushes.
//
// Usage:
//   POST /api/revalidate?tag=products
//     Authorization: Bearer <REVALIDATE_SECRET>
//   or
//   POST /api/revalidate?tag=products&secret=<REVALIDATE_SECRET>
//
// Multiple tags allowed: ?tag=products&tag=categories

const ALLOWED_TAGS = new Set([
  "products",
  "categories",
  "collections",
  "regions",
  "locales",
  "payment_providers",
  "banners",
])

function readSecret(req: NextRequest): string | null {
  const auth = req.headers.get("authorization")
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim()
  const q = req.nextUrl.searchParams.get("secret")
  return q?.trim() || null
}

async function handler(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured on storefront" },
      { status: 500 }
    )
  }

  const provided = readSecret(req)
  if (!provided || provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const tagParams = req.nextUrl.searchParams.getAll("tag")
  if (!tagParams.length) {
    return NextResponse.json({ ok: false, error: "tag query param required" }, { status: 400 })
  }

  const accepted: string[] = []
  const rejected: string[] = []
  for (const t of tagParams) {
    if (!ALLOWED_TAGS.has(t)) {
      rejected.push(t)
      continue
    }
    revalidateTag(t)
    accepted.push(t)
  }

  return NextResponse.json({ ok: true, revalidated: accepted, rejected })
}

export const POST = handler
export const GET = handler
