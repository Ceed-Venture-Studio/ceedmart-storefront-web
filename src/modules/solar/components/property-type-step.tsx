"use client"

import { clx } from "@medusajs/ui"
import type { PropertyType } from "../data/appliances"

type Props = {
  value: PropertyType | null
  onChange: (v: PropertyType) => void
}

// Material Symbols icons — inline SVG paths (Apache 2.0).
const HomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
)

const ApartmentIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
  </svg>
)

const Card = ({
  active,
  Icon,
  title,
  desc,
  onClick,
}: {
  active: boolean
  Icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clx(
      "flex-1 text-left p-5 rounded-rounded border-2 bg-white transition-all",
      active
        ? "border-ceedmart-navy shadow-md"
        : "border-grey-20 hover:border-grey-40"
    )}
  >
    <Icon
      className={clx(
        "w-8 h-8 mb-3 transition-colors",
        active ? "text-ceedmart-navy" : "text-grey-60"
      )}
    />
    <div className="text-base font-semibold text-ui-fg-base">{title}</div>
    <div className="text-sm text-grey-60 mt-1">{desc}</div>
  </button>
)

export default function PropertyTypeStep({ value, onChange }: Props) {
  return (
    <div className="bg-white border border-grey-20 rounded-rounded p-4 small:p-6">
      <h2 className="text-lg font-semibold text-ui-fg-base mb-1">
        Where will the system be installed?
      </h2>
      <p className="text-sm text-grey-60 mb-5">
        We&apos;ll start you off with the essentials people in your kind of
        space usually need to keep running.
      </p>
      <div className="flex flex-col small:flex-row gap-3">
        <Card
          active={value === "residence"}
          Icon={HomeIcon}
          title="Home / Residence"
          desc="Apartments, flats, duplexes, family homes."
          onClick={() => onChange("residence")}
        />
        <Card
          active={value === "office"}
          Icon={ApartmentIcon}
          title="Office / Workspace"
          desc="Offices, shops, clinics, co-working spaces."
          onClick={() => onChange("office")}
        />
      </div>
    </div>
  )
}
