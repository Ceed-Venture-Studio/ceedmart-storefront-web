"use client"

import { useState, useMemo } from "react"

type CountryDialCode = {
  code: string
  dial: string
  flag: string
  name: string
}

const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: "NG", dial: "+234", flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria" },
  { code: "US", dial: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "United States" },
  { code: "GB", dial: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "United Kingdom" },
  { code: "GH", dial: "+233", flag: "\u{1F1EC}\u{1F1ED}", name: "Ghana" },
  { code: "KE", dial: "+254", flag: "\u{1F1F0}\u{1F1EA}", name: "Kenya" },
  { code: "ZA", dial: "+27", flag: "\u{1F1FF}\u{1F1E6}", name: "South Africa" },
  { code: "CA", dial: "+1", flag: "\u{1F1E8}\u{1F1E6}", name: "Canada" },
  { code: "DE", dial: "+49", flag: "\u{1F1E9}\u{1F1EA}", name: "Germany" },
  { code: "FR", dial: "+33", flag: "\u{1F1EB}\u{1F1F7}", name: "France" },
  { code: "IN", dial: "+91", flag: "\u{1F1EE}\u{1F1F3}", name: "India" },
  { code: "CN", dial: "+86", flag: "\u{1F1E8}\u{1F1F3}", name: "China" },
  { code: "AE", dial: "+971", flag: "\u{1F1E6}\u{1F1EA}", name: "UAE" },
  { code: "SA", dial: "+966", flag: "\u{1F1F8}\u{1F1E6}", name: "Saudi Arabia" },
  { code: "EG", dial: "+20", flag: "\u{1F1EA}\u{1F1EC}", name: "Egypt" },
  { code: "CM", dial: "+237", flag: "\u{1F1E8}\u{1F1F2}", name: "Cameroon" },
  { code: "TZ", dial: "+255", flag: "\u{1F1F9}\u{1F1FF}", name: "Tanzania" },
  { code: "UG", dial: "+256", flag: "\u{1F1FA}\u{1F1EC}", name: "Uganda" },
  { code: "RW", dial: "+250", flag: "\u{1F1F7}\u{1F1FC}", name: "Rwanda" },
  { code: "SN", dial: "+221", flag: "\u{1F1F8}\u{1F1F3}", name: "Senegal" },
  { code: "CI", dial: "+225", flag: "\u{1F1E8}\u{1F1EE}", name: "Côte d'Ivoire" },
]

type PhoneInputProps = {
  name: string
  required?: boolean
  defaultValue?: string
  "data-testid"?: string
}

const PhoneInput = ({
  name,
  required,
  defaultValue,
  "data-testid": testId,
}: PhoneInputProps) => {
  const parseDefault = (val?: string) => {
    if (!val) return { countryCode: "NG", number: "" }
    for (const c of COUNTRY_DIAL_CODES) {
      if (val.startsWith(c.dial)) {
        return { countryCode: c.code, number: val.slice(c.dial.length) }
      }
    }
    return { countryCode: "NG", number: val.replace(/^\+?234/, "") }
  }

  const parsed = parseDefault(defaultValue)
  const [selectedCountry, setSelectedCountry] = useState(parsed.countryCode)
  const [phoneNumber, setPhoneNumber] = useState(parsed.number)

  const country = useMemo(
    () => COUNTRY_DIAL_CODES.find((c) => c.code === selectedCountry)!,
    [selectedCountry]
  )

  const fullValue = `${country.dial}${phoneNumber}`

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhoneNumber(digits)
  }

  return (
    <div className="relative w-full">
      {/* Hidden input submits the full phone number with dial code */}
      <input type="hidden" name={name} value={phoneNumber ? fullValue : ""} />

      <div
        className="flex items-center w-full h-11 border rounded-md bg-ui-bg-field border-ui-border-base hover:bg-ui-bg-field-hover focus-within:shadow-borders-interactive-with-active overflow-hidden"
        data-testid={testId}
      >
        {/* Country selector */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value)
              setPhoneNumber("")
            }}
            className="appearance-none bg-transparent pl-3 pr-7 h-full text-sm cursor-pointer focus:outline-none"
            aria-label="Country code"
          >
            {COUNTRY_DIAL_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2">
            <svg
              className="w-3 h-3 text-ui-fg-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-ui-border-base flex-shrink-0" />

        {/* Phone number input */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="8012345678"
          value={phoneNumber}
          onChange={handleNumberChange}
          maxLength={10}
          required={required}
          autoComplete="tel-national"
          className="flex-1 h-full px-3 bg-transparent text-sm focus:outline-none placeholder:text-ui-fg-muted"
        />
      </div>

    </div>
  )
}

export default PhoneInput
