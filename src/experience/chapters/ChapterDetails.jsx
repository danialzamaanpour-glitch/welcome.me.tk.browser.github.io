import FabricArt from '../../components/FabricArt'
import { useChapterScope } from '../useChapterScope'
import { usePrefersReducedMotion } from '../../lib/motion'

const MOMENTS = [
  {
    id: 'fabric',
    index: 'A',
    kicker: 'The fabric',
    title: 'Heavyweight comfort',
    copy: 'A substantial feel, a soft touch, and a silhouette designed for everyday wear.',
    art: {
      kind: 'fleece',
      tone: '#33343a',
      exposure: 1.05,
      caption: 'Rendered fleece surface — generated height field, lit from one soft key. Not photography.',
    },
  },
  {
    id: 'construction',
    index: 'B',
    kicker: 'The construction',
    title: 'Built around the essentials',
    copy: 'Considered proportions. Clean construction. Timeless utility.',
    art: {
      kind: 'twill',
      tone: '#2A2B2F',
      overlay: 'seam',
      caption: 'Generated twill with a topstitched seam — the construction read as surface, not specification.',
    },
  },
  {
    id: 'signature',
    index: 'C',
    kicker: 'The signature',
    title: 'Quietly distinctive',
    copy: 'A tonal wordmark set into the chest, legible only up close.',
    art: {
      kind: 'twill',
      tone: '#2C2D31',
      overlay: 'wordmark',
      caption: 'Tone-on-tone wordmark on the same generated weave. No print claim is made beyond the reference.',
    },
  },
]

/**
 * CHAPTER 03 — CRAFTED IN DETAIL
 * Three scroll-driven moments. The camera moves in for a real close-up of the
 * garment while each moment arrives beside it.
 */
export default function ChapterDetails() {
  const reduced = usePrefersReducedMotion()

  const ref = useChapterScope(
    (el, gsap) => {
      const header = el.querySelector('[data-details-header]')
      gsap
        .timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          scrollTrigger: { trigger: header, start: 'top bottom', end: 'top top', scrub: 1 },
        })
        .from(header.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
        .from(header.querySelector('[data-reveal]'), { opacity: 0, y: 14 }, 0.2)

      el.querySelectorAll('[data-moment]').forEach((moment) => {
        const art = moment.querySelector('[data-art]')
        gsap
          .timeline({
            defaults: { ease: 'power2.out', duration: 0.6 },
            scrollTrigger: { trigger: moment, start: 'top 88%', end: 'top 28%', scrub: 1 },
          })
          .from(moment.querySelectorAll('[data-mask-line]'), { yPercent: 118, stagger: 0.08 }, 0)
          .from(moment.querySelectorAll('[data-reveal]'), { opacity: 0, y: 16, stagger: 0.08 }, 0.18)
        if (art) {
          gsap.fromTo(
            art,
            { clipPath: 'inset(16% 14% 16% 14%)', scale: 1.05 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: moment, start: 'top 85%', end: 'top 30%', scrub: 1 },
            },
          )
          gsap.fromTo(
            moment.querySelector('[data-art-inner]'),
            { yPercent: 4 },
            {
              yPercent: -5,
              ease: 'none',
              scrollTrigger: { trigger: moment, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
      })
    },
    { disabled: reduced },
  )

  return (
    <section className="chapter chapter--details" id="chapter-03" data-chapter="03" ref={ref} aria-labelledby="chapter-03-title">
      <div className="details__header" data-details-header>
        <div className="container details__header-inner">
          <p className="chapter__index" data-reveal>
            03 — Detail
          </p>
          <h2 className="display display--chapter" id="chapter-03-title">
            <span className="mask">
              <span className="mask__line" data-mask-line>
                Details make
              </span>
            </span>
            <span className="mask">
              <span className="mask__line" data-mask-line>
                the difference.
              </span>
            </span>
          </h2>
        </div>
      </div>

      {MOMENTS.map((moment) => (
        <article className="moment" key={moment.id} data-moment>
          <div className="container moment__inner">
            <div className="moment__text">
              <p className="chapter__index" data-reveal>
                {moment.index} — {moment.kicker}
              </p>
              <h3 className="display display--moment">
                <span className="mask">
                  <span className="mask__line" data-mask-line>
                    {moment.title}
                  </span>
                </span>
              </h3>
              <p className="chapter__copy" data-reveal>
                {moment.copy}
              </p>
            </div>
            <div className="moment__art" data-art>
              <div className="moment__art-inner" data-art-inner>
                <FabricArt
                  kind={moment.art.kind}
                  tone={moment.art.tone}
                  overlay={moment.art.overlay}
                  exposure={moment.art.exposure}
                  caption={moment.art.caption}
                  className="fabric-art--moment"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
