import { Star } from './icons'

/** Rating display. The count is announced for screen readers, not just drawn. */
export default function RatingStars({ value = 0, count, className = '', size = 14, showValue = true }) {
  const rounded = Math.round(value)
  return (
    <span className={`rating ${className}`}>
      <span className="rating__stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} filled={i < rounded} width={size} height={size} />
        ))}
      </span>
      <span className="rating__text">
        {showValue && <span className="rating__value">{value.toFixed(1)}</span>}
        {typeof count === 'number' && <span className="rating__count">({count} reviews)</span>}
      </span>
      <span className="visually-hidden">
        Rated {value.toFixed(1)} out of 5{typeof count === 'number' ? ` from ${count} reviews` : ''}
      </span>
    </span>
  )
}
