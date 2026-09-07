"use client"

import { Button, Input, Text, clx } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  saveConfiguration,
  submitConfiguration,
  validateConfiguration,
  type ComponentCategory,
  type Selection,
  type Validation,
} from "@lib/data/build-catalog"
import BuildDiagram, {
  LABELS,
  NON_PHYSICAL,
} from "@modules/builds/components/build-diagram"

// The guided configurator (BRD §7.3, §7.4, §7.10).
//
// ── Layout ──────────────────────────────────────────────────────────────
// Choices on the left, the machine on the right. A build sheet alone is a
// list of names and numbers and does not show what is still undecided; the
// diagram does, and hovering either side lights the other so the link is
// never in doubt.
//
// ── Why dropdowns ───────────────────────────────────────────────────────
// A slot can hold dozens of parts. Rendering them all as buttons made the
// page a wall of options where the only way to compare two processors was
// to scroll past forty. A select collapses each slot to one line, which is
// also how the picker behaves natively on a phone.
//
// ── The two rules that shape the rest ───────────────────────────────────
// §7.3 — a hard incompatibility BLOCKS submission and cannot be dismissed;
// a recommendation may be OVERRIDDEN after acknowledgement.
// §7.10 — every blocking failure is explained. Each finding shows what is
// wrong and what to do about it, because a dead end with no exit just
// loses the sale.

type Props = {
  categories: ComponentCategory[]
  buildType: "desktop" | "laptop"
  countryCode: string
}

const sessionToken = () => {
  if (typeof window === "undefined") return undefined
  const key = "ceedmart_build_session"
  let token = window.localStorage.getItem(key)
  if (!token) {
    token = `bs_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    try {
      window.localStorage.setItem(key, token)
    } catch {
      // Private browsing — the build just won't survive a reload.
    }
  }
  return token
}

const Configurator = ({ categories, buildType, countryCode }: Props) => {
  const [picks, setPicks] = useState<Record<string, { optionId: string; quantity: number }>>({})
  // Plenty of machines have no separate graphics card, and saying so is
  // faster than scrolling a list to find "Integrated graphics". Ticking it
  // clears both graphics slots and puts them out of the way, so the two
  // cannot end up disagreeing — a card chosen with graphics switched off.
  const [noGpu, setNoGpu] = useState(false)
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  const [validation, setValidation] = useState<Validation | null>(null)
  const [checking, setChecking] = useState(false)
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const [savedRef, setSavedRef] = useState<string | null>(null)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [busy, setBusy] = useState(false)

  const slotRefs = useRef<Record<string, HTMLSelectElement | null>>({})
  const summaryRef = useRef<HTMLDivElement | null>(null)

  const selections: Selection[] = useMemo(
    () =>
      Object.entries(picks).map(([category_code, p]) => ({
        category_code,
        option_id: p.optionId,
        quantity: p.quantity,
      })),
    [picks]
  )

  const optionsById = useMemo(() => {
    const map = new Map<string, ComponentCategory["options"][0]>()
    for (const c of categories) for (const o of c.options) map.set(o.id, o)
    return map
  }, [categories])

  const filled = useMemo(() => new Set(Object.keys(picks)), [picks])

  // ── Brand filtering ────────────────────────────────────────────────────
  // An option may declare `brands`. Choosing Apple then hides every Intel
  // and AMD chip, and leaves Tower and Studio as the only form factors —
  // rather than listing parts that cannot be bought together and objecting
  // afterwards. Options with no `brands` key belong to every brand.
  //
  // Filtering, not disabling: a list of things you are not allowed to pick
  // is longer and no more useful than a list of things you can.
  const selectedBrand = useMemo(() => {
    const pick = picks["brand"]
    if (!pick) return null
    const option = categories
      .find((c) => c.code === "brand")
      ?.options.find((o) => o.id === pick.optionId)
    return (option?.attributes as Record<string, unknown> | undefined)?.brand
      ? String((option!.attributes as Record<string, unknown>).brand)
      : option?.label ?? null
  }, [picks, categories])

  const visible = useMemo(() => {
    if (!selectedBrand) return categories
    return categories.map((category) => ({
      ...category,
      options: category.options.filter((option) => {
        const brands = (option.attributes as Record<string, unknown> | undefined)
          ?.brands
        if (!Array.isArray(brands) || brands.length === 0) return true
        return brands.map(String).includes(selectedBrand)
      }),
    }))
  }, [categories, selectedBrand])

  useEffect(() => {
    if (!noGpu) return
    setPicks((current) => {
      if (!current.gpu && !current.gpu_ram) return current
      const next = { ...current }
      delete next.gpu
      delete next.gpu_ram
      return next
    })
  }, [noGpu])

  // Changing brand can hide something already chosen — pick an Intel chip,
  // then switch to Apple, and the selection survives out of sight, blocking
  // submission with a rule about a part no longer on screen. Drop anything
  // the new brand does not offer.
  useEffect(() => {
    const allowed = new Set(visible.flatMap((c) => c.options.map((o) => o.id)))
    const stale = Object.entries(picks).filter(
      ([, pick]) => pick && !allowed.has(pick.optionId)
    )
    if (!stale.length) return
    setPicks((current) => {
      const next = { ...current }
      for (const [code] of stale) delete next[code]
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Physical slots go in the diagram; the rest are listed under it.
  const [physical, extras] = useMemo(
    () => [
      visible.filter((c) => !NON_PHYSICAL.has(c.code)),
      visible.filter((c) => NON_PHYSICAL.has(c.code)),
    ],
    [visible]
  )

  // Debounced server validation (§7.9 — the server is the authority).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!selections.length) {
      setValidation(null)
      return
    }
    if (timer.current) clearTimeout(timer.current)
    setChecking(true)
    timer.current = setTimeout(async () => {
      setValidation(await validateConfiguration(buildType, selections, acknowledged))
      setChecking(false)
    }, 400)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [selections, acknowledged, buildType])

  const choose = useCallback((code: string, optionId: string) => {
    setPicks((current) => {
      const next = { ...current }
      if (!optionId) delete next[code]
      else next[code] = { optionId, quantity: current[code]?.quantity ?? 1 }
      return next
    })
    // A changed part can resolve or replace a warning, so old
    // acknowledgements must not carry over silently.
    setAcknowledged([])
    setSavedRef(null)
  }, [])

  const blockedSlots = useMemo(() => {
    const set = new Set<string>()
    for (const f of validation?.blocking ?? []) f.categories.forEach((c) => set.add(c))
    return set
  }, [validation])

  const focusSlot = (code: string) => {
    setActiveSlot(code)
    slotRefs.current[code]?.focus()
    slotRefs.current[code]?.scrollIntoView({ block: "center", behavior: "smooth" })
  }

  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await saveConfiguration({
        build_type: buildType,
        selections,
        acknowledged_warnings: acknowledged,
        session_token: sessionToken(),
      })
      setSavedRef(res.configuration.reference)
    } catch (e: any) {
      setError(e?.message ?? "Could not save this build")
    } finally {
      setBusy(false)
    }
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    try {
      let reference = savedRef
      if (!reference) {
        const saved = await saveConfiguration({
          build_type: buildType,
          selections,
          acknowledged_warnings: acknowledged,
          session_token: sessionToken(),
        })
        reference = saved.configuration.reference
        setSavedRef(reference)
      }
      const res = await submitConfiguration(reference, {
        customer_name: form.get("name")?.toString().trim() ?? "",
        customer_email: form.get("email")?.toString().trim() ?? "",
        customer_phone: form.get("phone")?.toString().trim() || undefined,
        delivery_state: form.get("state")?.toString().trim() || undefined,
        notes: form.get("notes")?.toString().trim() || undefined,
        acknowledged_warnings: acknowledged,
      })
      setSubmittedRef(res.request.reference)
    } catch (e: any) {
      setError(e?.message ?? "Could not send this build for quoting")
    } finally {
      setBusy(false)
    }
  }

  if (submittedRef) {
    return (
      <div className="border border-ui-border-base rounded-lg p-6 bg-ui-bg-subtle flex flex-col gap-3">
        <Text className="text-xl font-semibold text-ceedmart-navy">
          Build sent for quoting
        </Text>
        <Text className="text-ui-fg-subtle">
          Your reference is{" "}
          <span className="font-mono font-semibold text-ui-fg-base">{submittedRef}</span>.
          A specialist will check your parts, confirm availability and send a
          priced quote by email.
        </Text>
      </div>
    )
  }

  const slotRow = (category: ComponentCategory) => {
    const chosen = picks[category.code]
    const isBlocked = blockedSlots.has(category.code)
    const isMissing = validation?.missing.includes(category.code)
    const option = chosen ? optionsById.get(chosen.optionId) : undefined

    return (
      <div
        key={category.code}
        onMouseEnter={() => setActiveSlot(category.code)}
        onMouseLeave={() => setActiveSlot(null)}
        className={clx(
          "flex flex-col gap-1 rounded-lg border px-3 py-2.5 small:py-1.5 transition-colors",
          isBlocked
            ? "border-ui-border-error bg-ui-bg-subtle"
            : activeSlot === category.code
              ? "border-ceedmart-blue"
              : "border-ui-border-base"
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor={`slot-${category.code}`}
            className="txt-small-plus text-ui-fg-base"
          >
            {LABELS[category.code] ?? category.label}
            {category.is_required && <span className="text-ui-fg-error"> *</span>}
          </label>
          {category.code === "gpu" && (
            <label className="flex items-center gap-1.5 txt-small text-ui-fg-subtle cursor-pointer">
              <input
                type="checkbox"
                checked={noGpu}
                onChange={(e) => setNoGpu(e.target.checked)}
                data-testid="no-gpu-checkbox"
                className="cursor-pointer"
              />
              No graphics card
            </label>
          )}
          {!chosen && isMissing && (
            <span className="txt-small text-ui-fg-error">Needed</span>
          )}
        </div>

        <select
          id={`slot-${category.code}`}
          ref={(el) => {
            slotRefs.current[category.code] = el
          }}
          value={chosen?.optionId ?? ""}
          onFocus={() => setActiveSlot(category.code)}
          onBlur={() => setActiveSlot(null)}
          onChange={(e) => choose(category.code, e.target.value)}
          disabled={noGpu && (category.code === "gpu" || category.code === "gpu_ram")}
          className="w-full rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-2.5 small:py-1.5 text-base small:text-sm text-ui-fg-base focus:outline-none focus:border-ceedmart-navy disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {category.is_required ? "Choose one…" : "None"}
          </option>
          {category.options.map((o) => (
            <option key={o.id} value={o.id} disabled={o.is_fixed}>
              {o.label}
              {o.is_fixed ? " (fixed on this model)" : ""}
            </option>
          ))}
        </select>

        {chosen && category.allows_multiple && (
          <div className="flex items-center gap-2">
            <span className="txt-small text-ui-fg-muted">Quantity</span>
            <Input
              className="w-20"
              inputMode="numeric"
              value={String(chosen.quantity)}
              onChange={(e) =>
                setPicks((c) =>
                  c[category.code]
                    ? {
                        ...c,
                        [category.code]: {
                          ...c[category.code],
                          quantity: Math.min(
                            category.max_quantity,
                            Math.max(1, Number(e.target.value) || 1)
                          ),
                        },
                      }
                    : c
                )
              }
            />
            <span className="txt-small text-ui-fg-muted">
              up to {category.max_quantity}
            </span>
          </div>
        )}

        {category.help_text && !chosen && (
          <Text className="txt-small text-ui-fg-muted">{category.help_text}</Text>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[minmax(0,1fr)_minmax(0,380px)] medium:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-6 small:gap-8 items-start pb-40 small:pb-0">
      {/* ── Choices ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 order-2 small:order-1">
        <section className="flex flex-col gap-2">
          <h2 className="txt-medium-plus text-ui-fg-base">The machine</h2>
          {physical.map(slotRow)}
        </section>

        {extras.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="txt-medium-plus text-ui-fg-base">
              Software, extras and setup
            </h2>
            {extras.map(slotRow)}
          </section>
        )}
      </div>

      {/* ── The machine, drawn ────────────────────────────────────── */}
      <aside className="order-1 small:order-2 small:sticky small:top-24 flex flex-col gap-4">
        <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-3 small:p-4 [&_svg]:max-h-[38vh] small:[&_svg]:max-h-none [&_svg]:mx-auto">
          <BuildDiagram
            buildType={buildType}
            filled={filled}
            active={activeSlot}
            onHover={setActiveSlot}
            onSelect={focusSlot}
          />
          <Text className="txt-small text-ui-fg-muted text-center mt-2">
            {filled.size === 0
              ? "Pick a part and it lights up here."
              : `${filled.size} of ${categories.length} chosen — tap a part to jump to it.`}
          </Text>
        </div>

        <div
          ref={summaryRef}
          className="rounded-lg border border-ui-border-base p-4 flex flex-col gap-3 order-3 small:order-none"
        >
          <div className="flex items-baseline justify-between">
            <Text className="txt-medium-plus text-ui-fg-base">Your build</Text>
            {checking && (
              <Text className="txt-small text-ui-fg-muted">Checking…</Text>
            )}
          </div>

          {/* No figures anywhere in this flow, deliberately. What a build
              costs depends on what the parts cost to source that week, so
              any number here would be a guess the quote then has to argue
              with. Promise the quote instead. */}
          <Text className="txt-small text-ui-fg-subtle">
            A specialist prices this once you send it, confirming every part
            is available before anything is charged.
          </Text>

          {/* Blocking — cannot be dismissed (§7.3). */}
          {validation?.blocking.map((f) => (
            <div
              key={f.code}
              className="rounded-md border border-ui-border-error bg-ui-bg-subtle p-3"
            >
              <Text className="txt-small-plus text-ui-fg-error">{f.message}</Text>
              {f.remedy && (
                <Text className="txt-small text-ui-fg-subtle mt-1">{f.remedy}</Text>
              )}
              <button
                type="button"
                onClick={() => focusSlot(f.categories[0])}
                className="txt-small text-ui-fg-interactive underline mt-1"
              >
                Change {LABELS[f.categories[0]] ?? f.categories[0]}
              </button>
            </div>
          ))}

          {/* Warnings — overridable after acknowledgement (§7.3). */}
          {validation?.warnings.map((f) => (
            <div
              key={f.code}
              className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-3"
            >
              <Text className="txt-small-plus text-ui-fg-base">{f.message}</Text>
              {f.remedy && (
                <Text className="txt-small text-ui-fg-subtle mt-1">{f.remedy}</Text>
              )}
              <label className="flex items-start gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged.includes(f.code)}
                  className="mt-1 h-4 w-4 accent-ceedmart-navy"
                  onChange={(e) =>
                    setAcknowledged((codes) =>
                      e.target.checked
                        ? [...codes, f.code]
                        : codes.filter((c) => c !== f.code)
                    )
                  }
                />
                <span className="txt-small text-ui-fg-subtle">
                  I understand and want to continue
                </span>
              </label>
            </div>
          ))}

          {validation && validation.missing.length > 0 && (
            <Text className="txt-small text-ui-fg-subtle">
              Still to choose: {validation.missing_labels.join(", ")}.
            </Text>
          )}

          {error && <Text className="txt-small text-ui-fg-error">{error}</Text>}

          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={save}
              isLoading={busy}
              disabled={selections.length === 0}
              className="h-11 small:h-8"
            >
              {savedRef ? `Saved as ${savedRef}` : "Save this build"}
            </Button>
            {/* Hidden on mobile — the sticky bar already carries it, and two
                identical primary actions on one screen is a coin toss. */}
            <Button
              onClick={() => setShowContact(true)}
              disabled={!validation?.can_submit || busy}
              className="hidden small:inline-flex"
            >
              Get a quote
            </Button>
          </div>

          {showContact && (
            <form
              onSubmit={submit}
              className="flex flex-col gap-3 border-t border-ui-border-base pt-3"
            >
              <Input name="name" placeholder="Your name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone (optional)" />
              <Input name="state" placeholder="Delivery state (optional)" />
              <Input name="notes" placeholder="Anything else? (optional)" />
              <Button type="submit" isLoading={busy} className="h-11 small:h-8">
                Send for quoting
              </Button>
            </form>
          )}
        </div>
      </aside>

      {/* Mobile: progress and the next step follow you down the page. On a
          phone the summary card sits below fourteen dropdowns, and a shopper
          adjusting parts should not have to scroll to find out whether they
          can send it. Hidden once the contact form is open — two competing
          submit buttons is worse than none.
          
          Sits at bottom-[65px], not bottom-0: the storefront already has a
          fixed mobile nav of that height at z-50, and a bar underneath it
          would be half-covered. */}
      {!showContact && selections.length > 0 && (
        <div className="small:hidden fixed bottom-[65px] inset-x-0 z-40 border-t border-ui-border-base bg-ui-bg-base px-4 py-3 flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="txt-small text-ui-fg-muted">Your build</span>
            <span className="txt-medium-plus text-ceedmart-navy truncate">
              {filled.size} part{filled.size === 1 ? "" : "s"} chosen
            </span>
          </div>
          {/* The label has to name the ACTUAL blocker. "0 left" was wrong
              in the common case: nothing missing, but an unacknowledged
              warning still holding submission — so the button read as
              finished and did nothing when tapped. */}
          <Button
            className="ml-auto shrink-0 h-11 px-5"
            onClick={() => {
              if (validation?.can_submit) {
                setShowContact(true)
                return
              }
              // Blocked: take them to the thing that is blocking it rather
              // than leaving a dead button.
              const target =
                validation?.blocking[0]?.categories[0] ??
                validation?.missing[0]
              if (target) focusSlot(target)
              else summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            }}
            disabled={busy}
          >
            {validation?.can_submit
              ? "Get a quote"
              : (validation?.blocking.length ?? 0) > 0
                ? "Fix a clash"
                : (validation?.missing.length ?? 0) > 0
                  ? `${validation!.missing.length} to choose`
                  : "Confirm a warning"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Configurator
