import ChapterLabels from '../ChapterLabels'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

/** The surface as the film shows it: no fibre composition, no weight claim. */
const LABELS = ['Fabric surface', 'Folds and shading', 'Charcoal gray']

/**
 * CHAPTER 03 — TEXTURE
 * The film's surface phase, where the light rakes across the cloth. The video
 * stays the only visual here: the chapter adds words, not another picture.
 */
export default function ChapterTexture() {
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
      className="chapter chapter--texture"
      id="chapter-03"
      data-chapter="03"
      ref={ref}
      aria-labelledby="chapter-03-title"
    >
      <div className="chapter__inner chapter__inner--left">
        <div className="chapter__copy-block">
          <p className="chapter__index" data-reveal>
            03 / Texture
          </p>
          <h2 className="display display--chapter" id="chapter-03-title">
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Feel the
              </span>
            </span>
            <span className="mask">
              <span className="mask__line" data-mask-line>
                difference.
              </span>
            </span>
          </h2>
          <p className="chapter__copy" data-reveal>
            Texture in focus.
          </p>
          <p className="chapter__copy" data-reveal>
            Discover the surface, folds, and visual character of the garment as the light moves
            across it.
          </p>
        </div>
        <ChapterLabels labels={LABELS} />
      </div>
    </section>
  )
}
