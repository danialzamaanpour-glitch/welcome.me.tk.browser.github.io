import { Minus, Plus } from './icons'

export default function QuantityStepper({ value, onChange, min = 1, max = 9, label = 'Quantity', compact = false }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className={`stepper${compact ? ' stepper--sm' : ''}`} role="group" aria-label={label}>
      <button type="button" className="stepper__btn" onClick={dec} disabled={value <= min} aria-label="Decrease quantity">
        <Minus width={14} height={14} />
      </button>
      <span className="stepper__value" aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button type="button" className="stepper__btn" onClick={inc} disabled={value >= max} aria-label="Increase quantity">
        <Plus width={14} height={14} />
      </button>
    </div>
  )
}
