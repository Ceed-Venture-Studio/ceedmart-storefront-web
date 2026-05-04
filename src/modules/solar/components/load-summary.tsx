import type { LoadProfile } from "../../../types/solar"

type Props = {
  load: LoadProfile
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-grey-50 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-lg font-semibold text-ui-fg-base">{value}</span>
  </div>
)

export default function LoadSummary({ load }: Props) {
  return (
    <div className="bg-white border border-grey-20 rounded-rounded p-4 small:p-6">
      <h3 className="text-base font-semibold text-ui-fg-base mb-4">
        Your load profile
      </h3>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4">
        <Stat label="Connected load" value={`${(load.total_load_w / 1000).toFixed(2)} kW`} />
        <Stat label="Peak (with surge)" value={`${(load.peak_load_w / 1000).toFixed(2)} kW`} />
        <Stat label="Daily energy" value={`${load.daily_kwh.toFixed(1)} kWh`} />
        <Stat label="Night energy" value={`${load.night_kwh.toFixed(1)} kWh`} />
      </div>
      {load.has_heavy_motors && (
        <div className="mt-4 px-3 py-2 bg-ceedmart-gold/10 border border-ceedmart-gold/40 rounded-base text-sm text-ui-fg-base">
          Heavy motor loads detected — sized with extra surge headroom (
          {load.margin_pct}% safety margin).
        </div>
      )}
    </div>
  )
}
