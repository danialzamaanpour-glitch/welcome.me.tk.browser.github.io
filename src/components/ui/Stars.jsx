import Icon from './Icon.jsx'
import { cn } from '../../lib/format.js'

/**
 * Star rating. `value` may be fractional — the fill is rounded to the nearest
 * star for display, and the numeric value is rendered separately by callers so
 * the exact rating is always readable.
 */
export function Stars({ value = 5, size = 14, className = '', label }) {
  const rounded = Math.round(value)
  return (
    <span className={cn('inline-flex items-center gap-[3px] text-ink', className)} role="img" aria-label={label || `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon key={star} name="star" size={size} filled={star <= rounded} strokeWidth={1.4} />
      ))}
    </span>
  )
}

export default Stars
