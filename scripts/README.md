# scripts

## `yarn smoke`

Runs the storefront and checks it actually works. Start the backend and the
storefront first, then:

```bash
yarn smoke                              # localhost defaults
STOREFRONT_URL=… BACKEND_URL=… yarn smoke
yarn smoke --no-browser                 # skip the layout tier
```

### What it checks

| Tier | Checks | Needs |
|---|---|---|
| API | backend health, and every store endpoint the new pages depend on — status, JSON shape | — |
| Pages | every key route returns 200 **and renders its own content** | — |
| Static assets | `/logo.png`, the favicon and a `next/image` URL are served directly, **not redirected** | — |
| Layout | horizontal overflow, error overlays, blank renders and colliding fixed bars at 390 / 820 / 1440px | any installed Chrome |

Feature-flagged pages are skipped when their flag is off, so a run against
an environment with auctions disabled does not fail on the auctions page.

### Why it exists

Typecheck, unit tests and `next build` all passed on a storefront that
could not serve a single page. Each check here corresponds to a real bug
that got through all three:

- a page linked from the nav that was never built
- a synchronous export in a `"use server"` module, which 500s the whole app
  at module compile — including pages that worked seconds earlier
- a middleware substring match treating `/logo.png` as a country prefix,
  because `"logo.png"` contains `"ng"`, so every `/public` PNG redirected
  and `next/image` could not fetch it
- a sticky bar placed at `bottom-0` on top of the existing mobile nav
- layout that scrolled sideways on a phone

None are visible without running the thing.

### Reading the output

A skipped check is **not** a passed one, and the summary says so. If the
layout tier skips, set `CHROME_PATH` to a Chrome or Chromium binary.
