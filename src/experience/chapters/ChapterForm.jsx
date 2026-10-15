import ChapterLabels from '../ChapterLabels'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

/** Names of what the film shows as it turns the silhouette through the studio. */
const LABELS = ['Oversized silhouette', 'Dropped shoulders', 'Adjustable hood']

/**
 * CHAPTER 02 — FORM
 * The camera works around the garment; the copy and the editorial labels arrive
 * while the shape of the piece is what fills the frame. Every label names a
 * feature the catalogue states or the film shows — nothing is measured from it.
 */
export default function ChapterForm() {
  const reduced = usePrefersReducedMotion()

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(el.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(el.querySelectorAll('[data-reveal]'), { opacity: 0, y: 16, stagger: 0.08 }, 0.18)
        .from(el.querySelectorAll('[data-film-label]'), { opacity: 0, y: 12, stagger: 0.07 }, 0.3)
    },
    { disabled: reduced },
  )

  return (
    <section
      className="chapter chapter--form"
      id="chapter-02"
      data-chapter="02"
      ref={ref}
      aria-labelledby="chapter-02-title"
    >
      <div className="chapter__inner chapter__inner--left">
        <div className="chapter__copy-block">
          <p className="chapter__index" data-reveal>
            02 / Form
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
          <p className="chapter__copy" data-reveal>
            An oversized silhouette. A considered shape.
          </p>
        </div>
        <ChapterLabels labels={LABELS} />
      </div>
    </section>
  )
}
