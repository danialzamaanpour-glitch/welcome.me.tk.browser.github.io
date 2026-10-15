import { isColorSizeAvailable } from '../data/products'

/**
 * Size selector.
 *
 * Sold-out sizes use aria-disabled (not `disabled`) so selecting one is still
 * possible and produces a clear spoken-and-visible error instead of a dead
 * control, and the sold-out state is marked with a strike-through rather than
 * colour alone.
 */
export default function SizeSelector({ product, colorId, size, onSelect, onUnavailable, onOpenSizeGuide }) {
  const unavailable = []
  product.sizes.forEach((s) => {
    if (!isColorSizeAvailable(product, colorId, s)) unavailable.push(s)
  })

  return (
    <div className="selector">
      <div className="selector__head">
        <span className="selector__label">Size</span>
        <button type="button" className="micro-link" onClick={onOpenSizeGuide}>
          Size guide
        </button>
      </div>
      <ul className="size-row" role="radiogroup" aria-label="Size">
        {product.sizes.map((s) => {
          const available = isColorSizeAvailable(product, colorId, s)
          const selected = s === size
          return (
            <li key={s}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={!available}
                className={`size-btn${selected ? ' is-selected' : ''}${!available ? ' is-unavailable' : ''}`}
                onClick={() => (available ? onSelect(s) : onUnavailable?.(s))}
              >
                {s}
              </button>
            </li>
          )
        })}
      </ul>
      {unavailable.length > 0 && (
        <p className="selector__hint">
          Not available in this finish: {unavailable.join(' · ')}
        </p>
      )}
    </div>
  )
}
