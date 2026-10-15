import Icon from './Icon.jsx'
import { cn } from '../../lib/format.js'

/** Quantity stepper used by the cart page, drawer, and product panel. */
export function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', label = 'Quantity' }) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const textSize = size === 'sm' ? 'w-8 text-meta' : 'w-10 text-body'

  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          buttonSize,
          'flex items-center justify-center text-ink transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:text-line'
        )}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className={cn(textSize, 'text-center font-medium tabular-nums')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          buttonSize,
          'flex items-center justify-center text-ink transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:text-line'
        )}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  )
}

export default QuantityStepper
