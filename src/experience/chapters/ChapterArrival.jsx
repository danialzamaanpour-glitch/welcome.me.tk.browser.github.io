import { Link } from 'react-router-dom'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'
import { scrollToId } from '../../lib/scroll'

/**
 * CHAPTER 01 — ARRIVAL
 * The film opens on its first frame (the garment standing in the studio, seen
 * from the back) and the headline is choreographed on mount. The copy then
 * drifts away from the focal area as the chapter is scrolled out.
 */
export default function ChapterArrival({ product }) {
  const reduced = usePrefersReducedMotion()

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(
          el.querySelectorAll('[data-mask-line]'),
          { yPercent: 120, duration: 1.15, stagger: 0.09 },
          0.15,
        )
        .from(
          el.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 18, duration: 0.9, stagger: 0.09 },
          0.55,
        )

      gsap.to(el.querySelector('[data-hero-lift]'), {
        yPercent: -12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { disabled: reduced },
  )

  const color = product.colors[0]

  return (
    <section
      className="chapter chapter--arrival"
      id="chapter-01"
      data-chapter="01"
      ref={ref}
      aria-labelledby="chapter-01-title"
    >
      <div className="chapter__inner chapter__inner--arrival">
        <div className="hero__top" data-reveal>
          <span className="micro">01 / Arrival</span>
          <span className="micro micro--muted">The essential oversized hoodie</span>
        </div>

        <div className="hero__main" data-hero-lift>
          <h1 className="display display--hero" id="chapter-01-title">
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Essentials.
              </span>
            </span>
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Redefined.
              </span>
            </span>
          </h1>
          <p className="hero__sub" data-reveal>
            Everyday comfort. Elevated form.
          </p>
          <div className="hero__actions" data-reveal>
            <button type="button" className="btn btn--primary" onClick={() => scrollToId('product')}>
              Explore the hoodie
            </button>
            <Link className="btn btn--ghost" to={`/product/${product.slug}`}>
              Go to the product page
            </Link>
          </div>
        </div>

        <aside className="hero__meta" data-reveal>
          <p className="chapter__copy">
            Meet the essential oversized hoodie: a refined everyday silhouette presented through a
            new perspective.
          </p>
          <dl className="meta-list">
            <div>
              <dt>Piece</dt>
              <dd>{product.name}</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>{color.name}</dd>
            </div>
            <div>
              <dt>Sizes</dt>
              <dd>{product.sizes.join(' · ')}</dd>
            </div>
          </dl>
          <p className="micro micro--quiet">
            Studio film · your scroll moves the frame
          </p>
        </aside>

        <div className="hero__scroll" data-reveal>
          <span className="micro">Scroll to move the film</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
