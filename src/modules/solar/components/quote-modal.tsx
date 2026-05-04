"use client"

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import type {
  QuoteRequest,
  SolarBundle,
} from "../../../types/solar"
import { submitSolarQuote } from "@lib/data/solar"

type Props = {
  open: boolean
  onClose: () => void
  bundle: SolarBundle
  calculationId: string | null
  onSuccess: (quoteId: string) => void
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function QuoteModal({
  open,
  onClose,
  bundle,
  calculationId,
  onSuccess,
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  if (!open) return null

  const validate = (): string | null => {
    if (!name.trim()) return "Please enter your name."
    if (!emailRe.test(email)) return "Please enter a valid email address."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const req: QuoteRequest = {
        calculation_id: calculationId ?? undefined,
        selected_tier: bundle.tier,
        selected_bundle: bundle,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim() || undefined,
        customer_location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      }
      const res = await submitSolarQuote(req)
      onSuccess(res.quote.id)
    } catch (err: any) {
      setError(err?.message || "Could not submit quote. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-end small:items-center justify-center p-0 small:p-6"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full small:max-w-lg bg-white rounded-t-large small:rounded-rounded p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold text-ui-fg-base mb-1">
          Get your solar quote
        </h2>
        <p className="text-sm text-grey-60 mb-5">
          Our team will reach out with a tailored quote for the{" "}
          <span className="font-medium capitalize">{bundle.tier}</span> bundle.
        </p>

        <div className="flex flex-col gap-3">
          <Field
            label="Full name"
            required
            value={name}
            onChange={setName}
            disabled={submitting}
          />
          <Field
            label="Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            disabled={submitting}
          />
          <Field
            label="Phone"
            value={phone}
            onChange={setPhone}
            disabled={submitting}
            placeholder="+234..."
          />
          <Field
            label="Location"
            value={location}
            onChange={setLocation}
            disabled={submitting}
            placeholder="e.g. Lekki, Lagos"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-grey-50 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={submitting}
              placeholder="Anything we should know? (timeline, building type, etc.)"
              className="px-3 py-2 rounded-base border border-grey-20 bg-white text-sm text-ui-fg-base focus:outline-none focus:border-ceedmart-navy resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-ceedmart-navy hover:bg-ceedmart-navy-light"
            isLoading={submitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  disabled,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-grey-50 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="h-10 px-3 rounded-base border border-grey-20 bg-white text-sm text-ui-fg-base focus:outline-none focus:border-ceedmart-navy"
      />
    </div>
  )
}
