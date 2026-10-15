import { Check } from './icons'
import { contrastInk } from '../lib/color'
import { colorById, isColorSizeAvailable } from '../data/products'

/**
 * Colour selector. Selection is never colour-only: the chosen swatch carries a
 * ring and a check mark, the name is written out beside it, and each control is
 * announced with its availability.
 */
export default function ColorSelector({ product, colorId, onSelect, size = 'md' }) {
  const color = colorById(product, colorId)

  return (
    <div className="selector">
      <div className="selector__head">
        <span className="selector__label">Colour</span>
        <span className="selector__value">{color?.name}</span>
      </div>
      <ul className={`swatch-row swatch-row--${size}`} role="radiogroup" aria-label="Colour">
        {product.colors.map((c) => {
          const selected = c.id === colorId
          const sizes = product.sizes.filter((s) => isColorSizeAvailable(product, c.id, s))
          const soldOut = sizes.length === 0
          return (
            <li key={c.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${c.name}${soldOut ? ' — sold out' : ''}`}
                className={`swatch${selected ? ' is-selected' : ''}${soldOut ? ' is-soldout' : ''}`}
                onClick={() => onSelect(c.id)}
              >
                <span className="swatch__disc" style={{ background: c.hex }}>
                  {selected && (
                    <Check width={15} height={15} className="swatch__check" style={{ color: contrastInk(c.hex) }} />
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
