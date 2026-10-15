import { Check } from '../../components/icons'
import { contrastInk } from '../../lib/color'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'
import { colorById, isColorSizeAvailable } from '../../data/products'
import { useShop } from '../../store/ShopContext'

/**
 * CHAPTER 04 — THE COLOUR SPECTRUM
 * The swatches here drive the same variant state as the purchase panel, and the
 * live 3D model is recoloured — a real material change on the same geometry.
 */
export default function ChapterSpectrum({ product, colorId, onSelectColor }) {
  const reduced = usePrefersReducedMotion()
  const { money } = useShop()
  const color = colorById(product, colorId)
  const available = product.sizes.filter((s) => isColorSizeAvailable(product, colorId, s))
  const limited = available.length < product.sizes.length

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(el.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(el.querySelector('[data-copy]'), { opacity: 0, y: 14 }, 0.2)
        .from(el.querySelectorAll('[data-swatch]'), { opacity: 0, y: 18, scale: 0.94, stagger: 0.08 }, 0.28)
    },
    { disabled: reduced },
  )

  return (
    <section className="chapter chapter--spectrum" id="chapter-04" data-chapter="04" ref={ref} aria-labelledby="chapter-04-title">
      <div className="chapter__inner chapter__inner--left">
        <p className="chapter__index" data-reveal>
          04 — Spectrum
        </p>
        <h2 className="display display--chapter" id="chapter-04-title">
          <span className="mask">
            <span className="mask__line" data-mask-line>
              One silhouette.
            </span>
          </span>
          <span className="mask">
            <span className="mask__line" data-mask-line>
              Your expression.
            </span>
          </span>
        </h2>
        <p className="chapter__copy" data-copy>
          Four tonal finishes on the same pattern. Selecting one recolours the live model and the
          purchase panel below — a single source of truth for the variant you buy.
        </p>

        <div className="spectrum__selection">
          <p className="spectrum__current">
            <span className="spectrum__name">{color.name}</span>
            <span className="spectrum__price">{money(product.price)}</span>
          </p>
          <p className="micro micro--muted">
            {limited ? `Limited sizes in this finish: ${available.join(' · ')}` : 'Available in all sizes'}
          </p>
        </div>

        <ul className="swatch-row" role="radiogroup" aria-label="Colour">
          {product.colors.map((c) => {
            const selected = c.id === colorId
            const sizes = product.sizes.filter((s) => isColorSizeAvailable(product, c.id, s))
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`swatch swatch--lg${selected ? ' is-selected' : ''}`}
                  onClick={() => onSelectColor(c.id)}
                  data-swatch
                >
                  <span className="swatch__disc" style={{ background: c.hex }}>
                    {selected && (
                      <Check width={16} height={16} className="swatch__check" style={{ color: contrastInk(c.hex) }} />
                    )}
                  </span>
                  <span className="swatch__name">{c.name}</span>
                  <span className="swatch__meta">{sizes.length ? `${sizes.length} sizes` : 'Sold out'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
