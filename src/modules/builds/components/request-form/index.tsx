"use client"

import { Button, Input, Label, Text, Textarea } from "@medusajs/ui"
import { useState, useTransition } from "react"

import { submitBuildRequest } from "@lib/data/builds"

// Custom-build request form (BRD §7.5, §7.10).
//
// The BRD's acceptance criterion is that "a customer can submit an assisted
// request WITHOUT KNOWING COMPONENT TERMINOLOGY". So every field asks about
// outcomes — what you'll do with it, what you can spend, what it must run —
// and none asks for a socket, a chipset or a wattage. A specialist turns
// this into a configuration; that is the whole point of the assisted path.
//
// Budget is a range rather than a figure. A customer who has not priced
// components does not have a figure, and forcing one makes them guess low
// and feel misled when the quote lands.

const USE_CASES = [
  "Gaming",
  "Video & photo editing",
  "3D / CAD / rendering",
  "Software development",
  "Office & productivity",
  "Trading / multi-monitor",
  "Server or workstation",
]

const RequestForm = () => {
  const [buildType, setBuildType] = useState<"desktop" | "laptop">("desktop")
  const [useCase, setUseCase] = useState("")
  const [reference, setReference] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const naira = (key: string) => {
      const raw = form.get(key)?.toString().trim()
      if (!raw) return undefined
      const n = Number(raw.replace(/[^\d.]/g, ""))
      // The form collects naira; everything server-side is kobo.
      return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : undefined
    }

    startTransition(async () => {
      try {
        const res = await submitBuildRequest({
          customer_name: form.get("name")?.toString().trim() ?? "",
          customer_email: form.get("email")?.toString().trim() ?? "",
          customer_phone: form.get("phone")?.toString().trim() || undefined,
          delivery_state: form.get("state")?.toString().trim() || undefined,
          build_type: buildType,
          intended_use: useCase || form.get("use_other")?.toString().trim() || "",
          budget_min: naira("budget_min"),
          budget_max: naira("budget_max"),
          required_software: form
            .get("software")
            ?.toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          preferred_brands: form
            .get("brands")
            ?.toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          performance_notes: form.get("performance")?.toString().trim() || undefined,
          portability_needs:
            buildType === "laptop"
              ? form.get("portability")?.toString().trim() || undefined
              : undefined,
          needed_by: form.get("needed_by")?.toString() || undefined,
          notes: form.get("notes")?.toString().trim() || undefined,
        })
        setReference(res.request.reference)
      } catch (err: any) {
        setError(
          err?.message ??
            "We couldn't send that. Check your details and try again."
        )
      }
    })
  }

  if (reference) {
    return (
      <div className="border border-ui-border-base rounded-lg p-6 bg-ui-bg-subtle flex flex-col gap-3">
        <Text className="text-xl font-semibold text-ceedmart-navy">
          Request received
        </Text>
        <Text className="text-ui-fg-subtle">
          Your reference is{" "}
          <span className="font-mono font-semibold text-ui-fg-base">
            {reference}
          </span>
          . One of our build specialists will look at what you need and come
          back with a quote by email.
        </Text>
        <Text className="txt-small text-ui-fg-muted">
          Quote this reference if you contact us on WhatsApp or by phone.
        </Text>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="txt-medium-plus text-ui-fg-base mb-2">
          What are we building?
        </legend>
        <div className="flex gap-3">
          {(["desktop", "laptop"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBuildType(type)}
              aria-pressed={buildType === type}
              className={
                buildType === type
                  ? "flex-1 rounded-lg border-2 border-ceedmart-navy bg-ceedmart-navy/5 px-4 py-3 text-left"
                  : "flex-1 rounded-lg border border-ui-border-base px-4 py-3 text-left hover:border-ceedmart-navy/40"
              }
            >
              <span className="txt-medium-plus text-ui-fg-base capitalize block">
                {type === "desktop" ? "Desktop PC" : "Laptop"}
              </span>
              <span className="txt-small text-ui-fg-subtle">
                {type === "desktop"
                  ? "Built to your spec from parts"
                  : "Configured from available models"}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="use">What will you use it for?</Label>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setUseCase(label === useCase ? "" : label)}
              aria-pressed={useCase === label}
              className={
                useCase === label
                  ? "rounded-full border border-ceedmart-navy bg-ceedmart-navy text-white txt-small px-3 py-1"
                  : "rounded-full border border-ui-border-base txt-small px-3 py-1 hover:border-ceedmart-navy/40"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <Input
          id="use"
          name="use_other"
          placeholder="Or describe it in your own words"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget_min">Budget from (₦)</Label>
          <Input id="budget_min" name="budget_min" inputMode="numeric" placeholder="500,000" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget_max">Budget up to (₦)</Label>
          <Input id="budget_max" name="budget_max" inputMode="numeric" placeholder="900,000" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="software">
          Anything it must run? (games, apps — comma separated)
        </Label>
        <Input
          id="software"
          name="software"
          placeholder="AutoCAD, Premiere Pro, Call of Duty"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="performance">
          How hard will you push it? <span className="text-ui-fg-muted">(optional)</span>
        </Label>
        <Textarea
          id="performance"
          name="performance"
          rows={2}
          placeholder="e.g. 4K editing all day, or 1080p gaming at high settings"
        />
      </div>

      {buildType === "laptop" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="portability">How portable does it need to be?</Label>
          <Input
            id="portability"
            name="portability"
            placeholder="Carried daily / mostly on a desk / travels a lot"
          />
        </div>
      )}

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="brands">Preferred brands (optional)</Label>
          <Input id="brands" name="brands" placeholder="ASUS, Lenovo" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="needed_by">Needed by (optional)</Label>
          <Input id="needed_by" name="needed_by" type="date" />
        </div>
      </div>

      <hr className="border-ui-border-base" />

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" autoComplete="tel" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="state">Delivery state (optional)</Label>
          <Input id="state" name="state" placeholder="Lagos" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Anything else? (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      {error && <Text className="txt-small text-ui-fg-error">{error}</Text>}

      <Button type="submit" isLoading={pending} className="w-full small:w-auto">
        Send my request
      </Button>

      <Text className="txt-small text-ui-fg-muted">
        No payment now. A specialist reviews your request and sends a priced
        quote you can accept, change or turn down.
      </Text>
    </form>
  )
}

export default RequestForm
