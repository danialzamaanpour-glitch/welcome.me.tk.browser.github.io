import ChapterLabels from '../ChapterLabels'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

/**
 * Names of what the film's closer frames show. The hood, the trims and the
 * pocket are stated by the catalogue and visible in the presentation; no seam
 * count, stitch density or specification is claimed here.
 */
const LABELS = ['Hood construction', 'Front pocket', 'Ribbed cuffs and hem']

/**
 * CHAPTER 04 — CONSTRUCTION
 * The final third of the film, where the garment has turned far enough for the
 * build to read: hood, trims and pocket.
 */
export default function ChapterConstruction() {
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
      className="chapter chapter--construction"
      id="chapter-04"
      data-chapter="04"
      ref={ref}
      aria-labelledby="chapter-04-title"
    >
      <div className="chapter__inner chapter__inner--right">
        <div className="chapter__copy-block">
          <p className="chapter__index" data-reveal>
            04 / Construction
          </p>
          <h2 className="display display--chapter" id="chapter-04-title">
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Every detail,
              </span>
            </span>
            <span className="mask">
              <span className="mask__line" data-mask-line>
                considered.
              </span>
            </span>
          </h2>
          <p className="chapter__copy" data-reveal>
            Designed around the essentials.
          </p>
          <p className="chapter__copy" data-reveal>
            Explore the hood, pocket, seams, and other construction details visible in the product
            presentation.
          </p>
        </div>
        <ChapterLabels labels={LABELS} />
      </div>
    </section>
  )
}
