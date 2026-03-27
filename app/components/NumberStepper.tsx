import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import React from "react"
import { MetricKey } from "../types"

type NumberStepperProps = {
  value: number
  onChange: (value: number) => void
  metricName: MetricKey
  className?: string
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  metricName,
  className = "",
}) => {
  const clamp = (val: number) => Math.min(Math.max(val, -100), 100)

  const dec = () => onChange(clamp(value - 1))
  const inc = () => onChange(clamp(value + 1))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10)
    if (!isNaN(parsed)) onChange(clamp(parsed))
  }

  return (
    <div
      className={`flex flex-col items-center border rounded ${className} bg-${metricName}/50`}
    >
      <button
        type="button"
        onClick={inc}
        disabled={value >= 100}
        className="p-1 active:scale-95 disabled:opacity-40 border-b border-black bg-gray-200 w-full rounded-t flex items-center justify-center"
        aria-label="Increase"
      >
        <ArrowBigUp fill="000" size={14} strokeWidth={4} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        className="w-full text-xs text-center outline-none appearance-none py-1"
        disabled
      />

      <button
        type="button"
        onClick={dec}
        disabled={value <= -100}
        className="p-1 active:scale-95 disabled:opacity-40 border-t border-black bg-gray-200 w-full rounded-b flex items-center justify-center"
        aria-label="Decrease"
      >
        <ArrowBigDown fill="000" size={14} strokeWidth={4} />
      </button>
    </div>
  )
}