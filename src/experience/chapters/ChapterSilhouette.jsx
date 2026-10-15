import { Ruler } from '../../components/icons'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

const FIT_NOTES = [
  { label: 'Shoulder', value: 'Dropped, soft set-in' },
  { label: 'Body', value: 'Boxy, generous through the chest' },
  { label: 'Trims', value: 'Ribbed cuffs, hem and hood edge' },
]

/**
 * CHAPTER 05 — THE SILHOUETTE
 * The camera pulls back for the full-garment view while the fit copy holds in
 * place. The size guide is one click away and is never hidden behind the scene.
 */
export default function ChapterSilhouette({ onOpenSizeGuide }) {
  const reduced = usePrefersReducedMotion()

  const ref = useChapterScope(
    (el, gsap) => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(el.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(el.querySelectorAll('[data-reveal]'), { opacity: 0, y: 16, stagger: 0.08 }, 0.22)
    },
    { disabled: reduced },
  )

  return (
    <section className="chapter chapter--silhouette" id="chapter-05" data-chapter="05" ref={ref} aria-labelledby="chapter-05-title">
      <div className="chapter__inner chapter__inner--right">
        <p className="chapter__index" data-reveal>
          05 — Silhouette
        </p>
        <h2 className="display display--chapter" id="chapter-05-title">
          <span className="mask">
            <span className="mask__line" data-mask-line>
              Made to move.
            </span>
          </span>
        </h2>
        <p className="display display--statement" data-reveal>
          Relaxed by design
        </p>
        <p className="chapter__copy" data-reveal>
          An oversized fit designed for effortless everyday styling — the shoulder sits wide, the
          body stays boxy, and the trims hold the shape.
        </p>
        <ul className="fit-notes" data-reveal>
          {FIT_NOTES.map((note) => (
            <li key={note.label} className="fit-notes__row">
              <span className="fit-notes__label">{note.label}</span>
              <span className="fit-notes__value">{note.value}</span>
            </li>
          ))}
        </ul>
        <div className="chapter__actions" data-reveal>
          <button type="button" className="btn btn--ghost btn--icon" onClick={onOpenSizeGuide}>
            <Ruler width={16} height={16} />
            Size &amp; fit guide
          </button>
        </div>
      </div>
    </section>
  )
}
