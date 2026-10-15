import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

const ANNOTATIONS = [
  { text: 'Oversized silhouette', top: '30%', side: 'right' },
  { text: 'Structured hood', top: '54%', side: 'right' },
  { text: 'Everyday essential', top: '76%', side: 'right' },
]

/**
 * CHAPTER 02 — THE GARMENT IN MOTION
 * The garment itself turns through 3D space, driven by scroll progress, while
 * construction annotations are drawn in around it.
 */
export default function ChapterMotion() {
  const reduced = usePrefersReducedMotion()

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(el.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(el.querySelector('[data-copy]'), { opacity: 0, y: 14 }, 0.2)
        .from(el.querySelectorAll('[data-annotation-line]'), {
          scaleX: 0,
          transformOrigin: 'left center',
          stagger: 0.12,
        }, 0.3)
        .from(el.querySelectorAll('[data-annotation]'), { opacity: 0, x: 12, stagger: 0.12 }, 0.34)
        .from(el.querySelector('[data-motion-list]'), { opacity: 0, y: 16 }, 0.2)
    },
    { disabled: reduced },
  )

  return (
    <section className="chapter chapter--motion" id="chapter-02" data-chapter="02" aria-labelledby="chapter-02-title">
      <div className="chapter__inner chapter__inner--left">
        <p className="chapter__index" data-reveal>
          02 — Motion
        </p>
        <h2 className="display display--chapter" id="chapter-02-title">
          <span className="mask">
            <span className="mask__line" data-mask-line>
              Form meets
            </span>
          </span>
          <span className="mask">
            <span className="mask__line" data-mask-line>
              function.
            </span>
          </span>
        </h2>
        <p className="chapter__copy" data-copy>
          The silhouette is drafted first and detailed last. Keep scrolling and the piece
          turns through the studio — front, three-quarter, side, back — because it is a real
          object on a real turntable, not a sequence of flat frames.
        </p>
        <ul className="annotations annotations--desktop" aria-hidden="true">
          {ANNOTATIONS.map((a) => (
            <li key={a.text} className="annotation" data-annotation style={{ top: a.top }}>
              <span className="annotation__line" data-annotation-line />
              <span className="annotation__text">{a.text}</span>
            </li>
          ))}
        </ul>
        <ul className="chapter__labels chapter__labels--mobile" data-motion-list>
          {ANNOTATIONS.map((a) => (
            <li key={a.text} className="micro micro--muted">
              {a.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
