import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CinematicStage from './CinematicStage'
import { cinema } from './cinematicState'
import { gsap, ScrollTrigger } from './useChapterScope'
import { usePrefersReducedMotion } from '../lib/motion'
import ScrollProgressIndicator from './ScrollProgressIndicator'
import ChapterArrival from './chapters/ChapterArrival'
import ChapterForm from './chapters/ChapterForm'
import ChapterTexture from './chapters/ChapterTexture'
import ChapterConstruction from './chapters/ChapterConstruction'
import ChapterEssential from './chapters/ChapterEssential'

/**
 * Chapters 01–05: the cinematic presentation.
 *
 * The generated film of the garment plays on the sticky stage, and its playhead
 * follows the scroll position of this section (progress 0 → 1, mapped onto the
 * film's real duration by useVideoScrub). One master ScrollTrigger writes that
 * progress into the shared `cinema` object; every chapter keeps its own scoped
 * timeline, so nothing competes for the scroll and nothing is scroll-jacked —
 * the stage is a CSS sticky element.
 *
 * The order of the chapters is the order of the film: opening composition, the
 * turn through the silhouette, the surface, the build, and the closing frame
 * that hands over to the shopping interface.
 */
export default function ScrollExperience({ product, colorId, onSelectColor, onOpenSizeGuide }) {
  const rootRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          cinema.progress = self.progress
        },
      })
    }, el)
    cinema.progress = 0
    setReady(true)
    // Positions are recalculated once fonts, the poster and the film have settled.
    const timer = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <section
      className="experience"
      id="experience"
      ref={rootRef}
      aria-label="Cinematic product presentation"
    >
      <CinematicStage reduced={reduced} />

      <ChapterArrival product={product} />
      <ChapterForm />
      <ChapterTexture />
      <ChapterConstruction />
      <ChapterEssential
        product={product}
        colorId={colorId}
        onSelectColor={onSelectColor}
        onOpenSizeGuide={onOpenSizeGuide}
      />

      <div className="experience__tail" aria-hidden="true" />

      <div className="experience__skip">
        <Link className="micro-link" to={`/product/${product.slug}`}>
          Skip the presentation — go to the product page
        </Link>
      </div>

      <ScrollProgressIndicator ready={ready} />
      <noscript>
        <p className="experience__noscript">
          This presentation scrubs a studio film of the garment with your scroll. The full product
          information and purchase controls are available below, and on the product page.
        </p>
      </noscript>
    </section>
  )
}
