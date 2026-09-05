"use client"

import { Button, Input, Label, Text, clx } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  saveConfiguration,
  submitConfiguration,
  validateConfiguration,
  type ComponentCategory,
  type Selection,
  type Validation,
} from "@lib/data/build-catalog"

// The guided PC/laptop configurator (BRD §7.3, §7.4, §7.10).
//
// Two rules shape the whole component:
//
//  1. §7.3 — "warnings must distinguish between a hard incompatibility that
//     BLOCKS submission and a recommendation the customer may OVERRIDE after
//     acknowledgement." So blocking findings sit inline and cannot be
//     dismissed; warnings get a checkbox.
//
//  2. §7.10 — "the system explains every blocking compatibility failure."
//     Each finding shows what is wrong AND what to do about it, because a
//     dead end with no exit just loses the sale.
//
// Validation runs on the server (§7.9). The debounce exists so a customer
// clicking through options does not fire a request per click, not to hide
// latency — the picker stays usable while a check is in flight, and only the
// submit button waits on the answer.

type Props = {
  categories: ComponentCategory[]
  buildType: "desktop" | "laptop"
  countryCode: string
}

const naira = (kobo: number | null | undefined) =>
  kobo == null ? "—" : `₦${(Number(kobo) / 100).toLocaleString()}`

// A stable per-browser key so an anonymous shopper does not lose a build
// they spent twenty minutes on.
const sessionToken = () => {
  if (typeof window === "undefined") return undefined
  const key = "ceedmart_build_session"
  let token = window.localStorage.getItem(key)
  if (!token) {
    token = `bs_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    try {
      window.localStorage.setItem(key, token)
    } catch {
      // Private browsing — the build just won't persist across reloads.
    }
  }
  return token
}

const Configurator = ({ categories, buildType, countryCode }: Props) => {
  const [picks, setPicks] = useState<Record<string, { optionId: string; quantity: number }>>({})
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  const [validation, setValidation] = useState<Validation | null>(null)
  const [checking, setChecking] = useState(false)
  const [savedRef, setSavedRef] = useState<string | null>(null)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [busy, setBusy] = useState(false)

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
    const map = new Map<string, { option: ComponentCategory["options"][0]; category: ComponentCategory }>()
    for (const category of categories) {
      for (const option of category.options) map.set(option.id, { option, category })
    }
    return map
  }, [categories])

  // Debounced server validation.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!selections.length) {
      setValidation(null)
      return
    }
    if (timer.current) clearTimeout(timer.current)
    setChecking(true)

    timer.current = setTimeout(async () => {
      const result = await validateConfiguration(buildType, selections, acknowledged)
      setValidation(result)
      setChecking(false)
    }, 400)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [selections, acknowledged, buildType])

  const choose = useCallback((categoryCode: string, optionId: string) => {
    setPicks((current) => {
      const next = { ...current }
      if (next[categoryCode]?.optionId === optionId) delete next[categoryCode]
      else next[categoryCode] = { optionId, quantity: current[categoryCode]?.quantity ?? 1 }
      return next
    })
    // A changed part can resolve or replace a warning, so old
    // acknowledgements must not carry over silently.
    setAcknowledged([])
    setSavedRef(null)
  }, [])

  const setQuantity = (categoryCode: string, quantity: number) =>
    setPicks((current) =>
      current[categoryCode]
        ? { ...current, [categoryCode]: { ...current[categoryCode], quantity } }
        : current
    )

  const blockedCategories = useMemo(() => {
    const set = new Set<string>()
    for (const f of validation?.blocking ?? []) f.categories.forEach((c) => set.add(c))
    return set
  }, [validation])

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
          <span className="font-mono font-semibold text-ui-fg-base">
            {submittedRef}
          </span>
          . A specialist will check your parts, confirm availability and send a
          priced quote by email.
        </Text>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 large:grid-cols-[1fr_340px] gap-8 items-start">
      {/* ── Slots ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {categories.map((category) => {
          const chosen = picks[category.code]
          const isBlocked = blockedCategories.has(category.code)
          const isMissing = validation?.missing.includes(category.code)

          return (
            <section
              key={category.code}
              className={clx(
                "border rounded-lg p-4",
                isBlocked
                  ? "border-ui-border-error bg-ui-bg-subtle"
                  : "border-ui-border-base"
              )}
            >
              <header className="flex items-baseline justify-between gap-3 mb-1">
                <h2 className="txt-medium-plus text-ui-fg-base">
                  {category.label}
                  {category.is_required && (
                    <span className="text-ui-fg-error ml-1">*</span>
                  )}
                </h2>
                {isMissing && (
                  <span className="txt-small text-ui-fg-error">Not chosen</span>
                )}
              </header>

              {category.help_text && (
                <Text className="txt-small text-ui-fg-muted mb-3">
                  {category.help_text}
                </Text>
              )}

              {category.options.length === 0 ? (
                <Text className="txt-small text-ui-fg-muted">
                  Nothing available in this slot yet.
                </Text>
              ) : (
                <div className="flex flex-col gap-2">
                  {category.options.map((option) => {
                    const selected = chosen?.optionId === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        // §7.4 — never imply a soldered part can be changed.
                        disabled={option.is_fixed}
                        aria-pressed={selected}
                        onClick={() => choose(category.code, option.id)}
                        className={clx(
                          "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left",
                          selected
                            ? "border-ceedmart-navy bg-ceedmart-navy/5"
                            : "border-ui-border-base hover:border-ceedmart-navy/40",
                          option.is_fixed && "opacity-70 cursor-not-allowed"
                        )}
                      >
                        <span className="flex flex-col">
                          <span className="txt-medium text-ui-fg-base">
                            {option.label}
                          </span>
                          {option.is_fixed && (
                            <span className="txt-small text-ui-fg-muted">
                              Fixed on this model — can&apos;t be changed
                            </span>
                          )}
                        </span>
                        <span className="txt-medium tabular-nums text-ui-fg-subtle whitespace-nowrap">
                          {naira(option.indicative_price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {chosen && category.allows_multiple && (
                <div className="flex items-center gap-2 mt-3">
                  <Label size="small" htmlFor={`qty-${category.code}`}>
                    How many?
                  </Label>
                  <Input
                    id={`qty-${category.code}`}
                    className="w-20"
                    inputMode="numeric"
                    value={String(chosen.quantity)}
                    onChange={(e) =>
                      setQuantity(
                        category.code,
                        Math.min(
                          category.max_quantity,
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      )
                    }
                  />
                  <Text className="txt-small text-ui-fg-muted">
                    up to {category.max_quantity}
                  </Text>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* ── Summary ───────────────────────────────────────────────── */}
      <aside className="large:sticky large:top-24 flex flex-col gap-4 border border-ui-border-base rounded-lg p-4">
        <div className="flex items-baseline justify-between">
          <Text className="txt-medium-plus text-ui-fg-base">Your build</Text>
          {checking && (
            <Text className="txt-small text-ui-fg-muted">Checking…</Text>
          )}
        </div>

        {selections.length === 0 ? (
          <Text className="txt-small text-ui-fg-muted">
            Pick a part to get started.
          </Text>
        ) : (
          <ul className="flex flex-col gap-1">
            {selections.map((s) => {
              const entry = optionsById.get(s.option_id)
              if (!entry) return null
              return (
                <li
                  key={s.category_code}
                  className="flex justify-between gap-2 txt-small"
                >
                  <span className="text-ui-fg-subtle">
                    {entry.option.label}
                    {(s.quantity ?? 1) > 1 ? ` ×${s.quantity}` : ""}
                  </span>
                  <span className="tabular-nums text-ui-fg-base whitespace-nowrap">
                    {naira(
                      entry.option.indicative_price == null
                        ? null
                        : entry.option.indicative_price * (s.quantity ?? 1)
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {validation && (
          <div className="flex items-baseline justify-between border-t border-ui-border-base pt-3">
            <Text className="txt-small text-ui-fg-muted">Estimate</Text>
            <Text className="text-lg font-bold text-ceedmart-navy tabular-nums">
              {naira(validation.estimated_total)}
            </Text>
          </div>
        )}

        <Text className="txt-small text-ui-fg-muted">
          An estimate, not a quote. A specialist confirms parts, availability
          and the final price before you pay anything.
        </Text>

        {/* Blocking — cannot be dismissed. */}
        {validation?.blocking.map((f) => (
          <div
            key={f.code}
            className="rounded-md border border-ui-border-error bg-ui-bg-subtle p-3"
          >
            <Text className="txt-small-plus text-ui-fg-error">{f.message}</Text>
            {f.remedy && (
              <Text className="txt-small text-ui-fg-subtle mt-1">{f.remedy}</Text>
            )}
          </div>
        ))}

        {/* Warnings — overridable after acknowledgement (§7.3). */}
        {validation?.warnings.map((f) => {
          const ticked = acknowledged.includes(f.code)
          return (
            <div
              key={f.code}
              className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-3"
            >
              <Text className="txt-small-plus text-ui-fg-base">{f.message}</Text>
              {f.remedy && (
                <Text className="txt-small text-ui-fg-subtle mt-1">
                  {f.remedy}
                </Text>
              )}
              <label className="flex items-start gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ticked}
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
          )
        })}

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
          >
            {savedRef ? `Saved as ${savedRef}` : "Save this build"}
          </Button>

          <Button
            onClick={() => setShowContact(true)}
            disabled={!validation?.can_submit || busy}
          >
            Get a quote
          </Button>
        </div>

        {showContact && (
          <form onSubmit={submit} className="flex flex-col gap-3 border-t border-ui-border-base pt-3">
            <Input name="name" placeholder="Your name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="phone" placeholder="Phone (optional)" />
            <Input name="state" placeholder="Delivery state (optional)" />
            <Input name="notes" placeholder="Anything else? (optional)" />
            <Button type="submit" isLoading={busy}>
              Send for quoting
            </Button>
          </form>
        )}
      </aside>
    </div>
  )
}

export default Configurator
