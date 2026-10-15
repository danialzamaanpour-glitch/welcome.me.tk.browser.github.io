import { Check, Ruler } from '../../components/icons'
import { colorById } from '../../data/products'
import { contrastInk } from '../../lib/color'
import { scrollToId } from '../../lib/scroll'
import { useShop } from '../../store/ShopContext'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

/**
 * CHAPTER 05 — THE ESSENTIAL
 * The film holds on its closing composition (it stops on the last frame here and
 * never loops), a restrained summary arrives, and the presentation hands over to
 * the shopping interface. The finish swatches drive the same variant state as the
 * purchase panel below — one source of truth.
 */
export default function ChapterEssential({ product, colorId, onSelectColor, onOpenSizeGuide }) {
  const reduced = usePrefersReducedMotion()
  const { money } = useShop()
  const color = colorById(product, colorId)

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(el.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(el.querySelectorAll('[data-reveal]'), { opacity: 0, y: 16, stagger: 0.08 }, 0.18)
        .from(el.querySelectorAll('[data-swatch]'), { opacity: 0, y: 12, scale: 0.94, stagger: 0.06 }, 0.32)
    },
    { disabled: reduced },
  )

  return (
    <section
      className="chapter chapter--essential"
      id="chapter-05"
      data-chapter="05"
      ref={ref}
      aria-labelledby="chapter-05-title"
    >
      <div className="chapter__inner chapter__inner--right">
        <div className="chapter__copy-block">
          <p className="chapter__index" data-reveal>
            05 / The essential
          </p>
          <h2 className="display display--chapter" id="chapter-05-title">
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Made for
              </span>
            </span>
            <span className="mask">
              <span className="mask__line" data-mask-line>
                everyday.
              </span>
            </span>
          </h2>
          <p className="chapter__copy" data-reveal>
            Your next everyday essential.
          </p>

          <div className="essential__summary" data-reveal>
            <p className="spectrum__current">
              <span className="spectrum__name">{color.name}</span>
              <span className="spectrum__price">{money(product.price)}</span>
            </p>
            <ul className="swatch-row swatch-row--micro" role="radiogroup" aria-label="Colour finish">
              {product.colors.map((c) => {
                const selected = c.id === colorId
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={c.name}
                      className={`swatch swatch--micro${selected ? ' is-selected' : ''}`}
                      onClick={() => onSelectColor(c.id)}
                      data-swatch
                    >
                      <span className="swatch__disc" style={{ background: c.hex }}>
                        {selected && (
                          <Check
                            width={12}
                            height={12}
                            className="swatch__check"
                            style={{ color: contrastInk(c.hex) }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="chapter__actions" data-reveal>
            <button type="button" className="btn btn--primary" onClick={() => scrollToId('product')}>
              Explore the hoodie
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={onOpenSizeGuide}>
              <Ruler width={16} height={16} />
              Size &amp; fit guide
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
