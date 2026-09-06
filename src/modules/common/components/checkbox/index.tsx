import { Checkbox, Label } from "@medusajs/ui"
import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  /**
   * Defaults to `name`. This used to be the constant "checkbox", which is
   * fine until a form has two — then both labels point at the first input
   * and clicking the second label toggles the wrong box.
   */
  id?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  id,
  'data-testid': dataTestId
}) => {
  const inputId = id ?? name ?? "checkbox"

  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id={inputId}
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label
        htmlFor={inputId}
        className="!transform-none !txt-medium"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
