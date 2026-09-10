#!/usr/bin/env node
//
// Storefront smoke test.
//
// ── Why this exists ─────────────────────────────────────────────────────
// Typecheck, unit tests and a production build all pass on a storefront
// that cannot serve a single page. Every one of these checks corresponds to
// a bug that shipped past all three:
//
//   • a page linked from the nav that was never built (404)
//   • a synchronous export in a "use server" module, which 500s the WHOLE
//     app at module compile — including pages that worked a moment earlier
//   • a middleware substring match treating /logo.png as a country prefix,
//     so every PNG in /public redirected and next/image could not fetch it
//   • an API route whose response shape the page could not read
//   • layout that overflowed horizontally on a phone
//
// None of them are visible without running the thing. This runs the thing.
//
// ── Two tiers ───────────────────────────────────────────────────────────
// Tier 1 is plain HTTP and always runs — no dependencies, no browser. It
// catches four of the five above.
//
// Tier 2 drives a real Chrome over CDP for the layout checks — horizontal
// overflow, error overlays, blank renders, colliding fixed bars — across
// phone, tablet and desktop widths. It uses whatever Chrome is installed
// and needs no browser download.
//
// A skipped check is never counted as a pass; the summary says so
// explicitly, because a green run that quietly verified nothing is worse
// than a red one.
//
// Usage:
//   yarn smoke                        # against localhost defaults
//   STOREFRONT_URL=… BACKEND_URL=… yarn smoke
//   yarn smoke --no-browser           # tier 1 only

const STOREFRONT =
  process.env.STOREFRONT_URL?.replace(/\/$/, "") || "http://localhost:8100"
const BACKEND =
  process.env.BACKEND_URL?.replace(/\/$/, "") || "http://localhost:9100"
const REGION = process.env.SMOKE_REGION || "ng"
const SKIP_BROWSER = process.argv.includes("--no-browser")

const TIMEOUT = Number(process.env.SMOKE_TIMEOUT || 45000)

// Widths worth checking. `small:` in this theme is 1024px, so 820 is the
// last width that still gets the mobile stack — the interesting boundary,
// and the one most likely to be wrong.
const WIDTHS = [
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 820, height: 1180, mobile: true },
  { name: "desktop", width: 1440, height: 900, mobile: false },
]

// A page is only "working" if it renders its own content. A 200 that
// renders an error boundary is still a failure, so each route names
// something that must appear.
const PAGES = [
  { path: `/${REGION}`, expect: ["Ceedmart"] },
  { path: `/${REGION}/store`, expect: [] },
  { path: `/${REGION}/cart`, expect: ["Cart"] },
  { path: `/${REGION}/preorder`, expect: ["Pre-order from the US"], flag: "preorder" },
  { path: `/${REGION}/auctions`, expect: ["Auctions"], flag: "auction" },
  // "Customise your", not the whole heading: the noun is the build type and
  // switches between "PC" and "laptop" with ?type=, so matching the full
  // string would tie this check to whichever default the page happens to use.
  { path: `/${REGION}/build`, expect: ["Customise your"], flag: "custom_build" },
]

// Static assets. /logo.png is here specifically: the middleware once
// treated it as a country prefix because "logo.png" contains "ng".
const ASSETS = [
  "/logo.png",
  "/favicon.ico",
  "/_next/image?url=%2Flogo.png&w=96&q=75",
]

const API = [
  { path: "/health", backend: true, expect: "OK" },
  { path: "/store/feature-flags", key: true, json: "flags" },
  { path: "/store/preorders", key: true, json: "preorders", flag: "preorder" },
  { path: "/store/auctions", key: true, json: "auctions", flag: "auction" },
  {
    path: "/store/builds/catalog?build_type=desktop",
    key: true,
    json: "categories",
    flag: "build_configurator",
  },
]

const results = []
const record = (ok, name, detail = "") => {
  results.push({ ok, name, detail })
  const mark = ok === true ? "  ok  " : ok === "skip" ? " skip " : " FAIL "
  console.log(`${mark} ${name}${detail ? `  — ${detail}` : ""}`)
}

const fetchWithTimeout = async (url, init = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    // `...init` LAST: a caller asking for redirect "manual" must win. With
    // the spread first, the default silently overrode it and every page
    // check followed the region redirect without a cookie jar until Node
    // gave up — reported as "fetch failed", which reads like the server is
    // down rather than like a bug in this helper.
    return await fetch(url, {
      redirect: "follow",
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

// A cookie jar, because the storefront needs one.
//
// The middleware answers a first request with a 307 that sets
// `_medusa_cache_id`, then serves normally once the cookie comes back. A
// plain fetch has no jar, so it follows the redirect to the same URL
// forever and dies at Node's redirect limit — which reads as "fetch
// failed" and looks like the server is down.
//
// Following redirects by hand also lets us assert the loop terminates,
// which is worth knowing on its own: an unbounded region redirect is a
// real failure mode.
const jar = new Map()

const rememberCookies = (res) => {
  const raw = res.headers.getSetCookie?.() ?? []
  for (const line of raw) {
    const [pair] = line.split(";")
    const idx = pair.indexOf("=")
    if (idx > 0) jar.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim())
  }
}

const cookieHeader = () =>
  [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ")

const MAX_HOPS = 5

const fetchPage = async (url) => {
  let current = url
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const headers = {}
    const cookies = cookieHeader()
    if (cookies) headers.cookie = cookies

    const res = await fetchWithTimeout(current, { headers, redirect: "manual" })
    rememberCookies(res)

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location")
      if (!location) return res
      current = new URL(location, current).toString()
      continue
    }
    return res
  }
  throw new Error(
    `redirected more than ${MAX_HOPS} times — the region redirect is looping`
  )
}

// ─── Setup ────────────────────────────────────────────────────────────────

let publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
let flags = {}

const loadEnv = async () => {
  if (publishableKey) return
  try {
    const { readFileSync } = await import("node:fs")
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    publishableKey =
      env.match(/^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=(.*)$/m)?.[1]?.trim() ?? ""
  } catch {
    // No .env.local — store endpoints will be skipped rather than failed,
    // since a missing key is a config gap, not a broken storefront.
  }
}

const loadFlags = async () => {
  if (!publishableKey) return
  try {
    const res = await fetchWithTimeout(`${BACKEND}/store/feature-flags`, {
      headers: { "x-publishable-api-key": publishableKey },
    })
    if (res.ok) flags = (await res.json())?.flags ?? {}
  } catch {
    // Backend down is reported by the /health check; don't double-report.
  }
}

// ─── Tier 1: HTTP ─────────────────────────────────────────────────────────

const checkApi = async () => {
  console.log("\nAPI")
  for (const item of API) {
    const label = `API ${item.path}`

    if (item.flag && flags[item.flag] === false) {
      record("skip", label, `feature "${item.flag}" is off`)
      continue
    }
    if (item.key && !publishableKey) {
      record("skip", label, "no publishable key available")
      continue
    }

    try {
      const res = await fetchWithTimeout(`${BACKEND}${item.path}`, {
        headers: item.key ? { "x-publishable-api-key": publishableKey } : {},
      })
      if (!res.ok) {
        record(false, label, `HTTP ${res.status}`)
        continue
      }
      const body = await res.text()
      if (item.expect && !body.includes(item.expect)) {
        record(false, label, `body missing "${item.expect}"`)
        continue
      }
      if (item.json) {
        let parsed
        try {
          parsed = JSON.parse(body)
        } catch {
          record(false, label, "response was not JSON")
          continue
        }
        if (!(item.json in parsed)) {
          record(false, label, `JSON missing "${item.json}"`)
          continue
        }
      }
      record(true, label)
    } catch (err) {
      record(false, label, err.message)
    }
  }
}

const checkPages = async () => {
  console.log("\nPages")
  for (const page of PAGES) {
    const label = `GET ${page.path}`

    if (page.flag && flags[page.flag] === false) {
      record("skip", label, `feature "${page.flag}" is off`)
      continue
    }

    try {
      const res = await fetchPage(`${STOREFRONT}${page.path}`)
      if (!res.ok) {
        record(false, label, `HTTP ${res.status}`)
        continue
      }
      const html = await res.text()
      const missing = page.expect.filter((needle) => !html.includes(needle))
      if (missing.length) {
        record(false, label, `rendered without ${missing.map((m) => `"${m}"`).join(", ")}`)
        continue
      }
      record(true, label)
    } catch (err) {
      record(false, label, err.message)
    }
  }
}

const checkAssets = async () => {
  console.log("\nStatic assets")
  for (const path of ASSETS) {
    const label = `GET ${path}`
    try {
      // `manual` on purpose: a redirect here is the bug. next/image fetches
      // the source without cookies, gets the redirect and fails, which is
      // exactly how every /public PNG broke.
      const res = await fetchWithTimeout(`${STOREFRONT}${path}`, {
        redirect: "manual",
      })
      if (res.status >= 300 && res.status < 400) {
        record(false, label, `redirected (${res.status}) — assets must be served directly`)
        continue
      }
      if (!res.ok) {
        record(false, label, `HTTP ${res.status}`)
        continue
      }
      const type = res.headers.get("content-type") ?? ""
      if (!/image|icon|octet-stream/.test(type)) {
        record(false, label, `unexpected content-type "${type}"`)
        continue
      }
      record(true, label)
    } catch (err) {
      record(false, label, err.message)
    }
  }
}

// ─── Tier 2: browser ──────────────────────────────────────────────────────

const findChrome = async () => {
  const { existsSync } = await import("node:fs")
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p)) ?? null
}

const getWebSocket = async () => {
  if (typeof WebSocket !== "undefined") return { Impl: WebSocket, native: true }
  try {
    const mod = await import("ws")
    return { Impl: mod.default, native: false }
  } catch {
    return null
  }
}

const checkLayout = async () => {
  console.log("\nLayout")

  if (SKIP_BROWSER) {
    record("skip", "layout checks", "--no-browser")
    return
  }

  const ws = await getWebSocket()
  if (!ws) {
    record(
      "skip",
      "layout checks",
      "no WebSocket — use Node 22+, or `yarn add -D ws`"
    )
    return
  }

  const chrome = await findChrome()
  if (!chrome) {
    record("skip", "layout checks", "no Chrome found — set CHROME_PATH")
    return
  }

  const { spawn } = await import("node:child_process")
  const { mkdtempSync, rmSync } = await import("node:fs")
  const { tmpdir } = await import("node:os")
  const { join } = await import("node:path")

  const profile = mkdtempSync(join(tmpdir(), "ceedmart-smoke-"))
  const port = 9333
  const proc = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore", detached: false }
  )

  const cleanup = () => {
    try {
      proc.kill("SIGKILL")
    } catch {}
    try {
      rmSync(profile, { recursive: true, force: true })
    } catch {}
  }

  try {
    // Wait for CDP.
    let target = null
    for (let i = 0; i < 40 && !target; i++) {
      await new Promise((r) => setTimeout(r, 500))
      try {
        const list = await (await fetch(`http://localhost:${port}/json/list`)).json()
        target = list.find((t) => t.type === "page")
      } catch {}
    }
    if (!target) {
      record(false, "layout checks", "Chrome did not expose a debugging target")
      return
    }

    const socket = new ws.Impl(target.webSocketDebuggerUrl)
    let msgId = 0
    const pending = new Map()
    const onMessage = (raw) => {
      const msg = JSON.parse(typeof raw === "string" ? raw : raw.toString())
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg)
        pending.delete(msg.id)
      }
    }
    if (ws.native) socket.addEventListener("message", (e) => onMessage(e.data))
    else socket.on("message", onMessage)
    await new Promise((r) =>
      ws.native ? socket.addEventListener("open", r) : socket.on("open", r)
    )

    const send = (method, params = {}) =>
      new Promise((res) => {
        const id = ++msgId
        pending.set(id, res)
        socket.send(JSON.stringify({ id, method, params }))
      })
    const evaluate = async (expression) =>
      (
        await send("Runtime.evaluate", {
          expression,
          awaitPromise: true,
          returnByValue: true,
        })
      )?.result?.result?.value

    await send("Page.enable")
    await send("Runtime.enable")

    // The delivery-location modal greets a first-time visitor and overlays
    // the page; dismiss it so it is not mistaken for the content.
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send("Page.navigate", { url: `${STOREFRONT}/${REGION}` })
    await new Promise((r) => setTimeout(r, 5000))
    await evaluate(
      `(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Port Harcourt|Lagos|Uyo/.test(x.textContent||''));if(b){b.click();return 1}return 0})()`
    )
    await new Promise((r) => setTimeout(r, 1200))

    const livePages = PAGES.filter((p) => !p.flag || flags[p.flag] !== false)

    for (const viewport of WIDTHS) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      })

      for (const page of livePages) {
        const label = `${viewport.name} ${viewport.width}px ${page.path}`
        await send("Page.navigate", { url: `${STOREFRONT}${page.path}` })
        await new Promise((r) => setTimeout(r, 2800))

        const raw = await evaluate(`JSON.stringify({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          errored: /Application error|Unhandled Runtime Error/.test(document.body.innerText || ""),
          empty: (document.body.innerText || "").trim().length < 80,
          overlaps: (() => {
            const bars = [...document.querySelectorAll('*')].filter(el => {
              const s = getComputedStyle(el);
              if (s.position !== 'fixed') return false;
              const b = el.getBoundingClientRect();
              return b.height > 0 && b.bottom > window.innerHeight - 240;
            }).map(el => el.getBoundingClientRect());
            return bars.some((a, i) => bars.some((b, j) => i !== j && a.top < b.bottom && b.top < a.bottom));
          })(),
        })`)

        let state
        try {
          state = JSON.parse(raw)
        } catch {
          record(false, label, "could not read page state")
          continue
        }

        if (state.errored) {
          record(false, label, "rendered a Next.js error overlay")
        } else if (state.empty) {
          record(false, label, "rendered almost nothing")
        } else if (state.overflow > 1) {
          // The single most common mobile bug, and invisible to every
          // static check.
          record(false, label, `scrolls sideways by ${state.overflow}px`)
        } else if (state.overlaps) {
          // Two fixed bottom bars stacked on top of one another — the
          // storefront already has a mobile nav at bottom-0.
          record(false, label, "fixed bottom elements overlap")
        } else {
          record(true, label)
        }
      }
    }

    socket.close()
  } finally {
    cleanup()
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────

console.log(`Storefront: ${STOREFRONT}`)
console.log(`Backend:    ${BACKEND}`)

await loadEnv()
await loadFlags()

const live = Object.entries(flags).filter(([, on]) => on).map(([k]) => k)
console.log(`Flags on:   ${live.length ? live.join(", ") : "none"}`)

await checkApi()
await checkPages()
await checkAssets()
await checkLayout()

const failed = results.filter((r) => r.ok === false)
const skipped = results.filter((r) => r.ok === "skip")
const passed = results.filter((r) => r.ok === true)

console.log(
  `\n${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`
)

if (skipped.length) {
  // A skipped check is not a passed one. Say so, so a green run that
  // silently checked nothing cannot be mistaken for coverage.
  console.log("Skipped checks were NOT verified.")
}

if (failed.length) {
  console.log("\nFailures:")
  for (const f of failed) console.log(`  ${f.name} — ${f.detail}`)
  process.exit(1)
}

process.exit(0)
