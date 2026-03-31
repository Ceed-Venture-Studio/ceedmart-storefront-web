import { useMemo } from "react"
import NativeSelect from "@modules/common/components/native-select"
import {
  NIGERIA_STATE_NAMES,
  getLGAsForState,
} from "@lib/data/nigeria-states-lgas"

type NigeriaAddressSelectProps = {
  stateValue: string
  lgaValue: string
  onStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onLgaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  stateName: string
  lgaName: string
  stateTestId?: string
  lgaTestId?: string
  required?: boolean
}

const NigeriaAddressSelect = ({
  stateValue,
  lgaValue,
  onStateChange,
  onLgaChange,
  stateName,
  lgaName,
  stateTestId,
  lgaTestId,
  required,
}: NigeriaAddressSelectProps) => {
  const lgas = useMemo(() => getLGAsForState(stateValue), [stateValue])

  return (
    <>
      <NativeSelect
        placeholder="State"
        name={stateName}
        value={stateValue}
        onChange={onStateChange}
        required={required}
        data-testid={stateTestId}
      >
        {NIGERIA_STATE_NAMES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        placeholder="LGA"
        name={lgaName}
        value={lgaValue}
        onChange={onLgaChange}
        required={required}
        data-testid={lgaTestId}
      >
        {lgas.map((lga) => (
          <option key={lga} value={lga}>
            {lga}
          </option>
        ))}
      </NativeSelect>
    </>
  )
}

export default NigeriaAddressSelect
