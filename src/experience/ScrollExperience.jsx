import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { rig, CAMERA_KEYS } from '../three/sceneState'
import StageCanvas from '../three/StageCanvas'
import { gsap, ScrollTrigger } from './useChapterScope'
import { usePrefersReducedMotion } from '../lib/motion'
import ScrollProgressIndicator from './ScrollProgressIndicator'
import ChapterArrival from './chapters/ChapterArrival'
import ChapterMotion from './chapters/ChapterMotion'
import ChapterDetails from './chapters/ChapterDetails'
import ChapterSpectrum from './chapters/ChapterSpectrum'
import ChapterSilhouette from './chapters/ChapterSilhouette'

/**
 * Chapters 01–05: the cinematic scroll experience.
 *
 * One master ScrollTrigger writes the scroll progress into the rig; every
 * chapter keeps its own scoped timeline, so nothing competes for the scroll.
 * Nothing is pinned with a scroll-jacking library: the stage is a CSS sticky
 * element and the camera simply follows the real scroll position.
 */
export default function ScrollExperience({ product, colorHex, colorId, onSelectColor, onOpenSizeGuide }) {
  const rootRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          rig.progress = self.progress
        },
      })
    }, el)
    rig.progress = 0
    setReady(true)
    // Positions are recalculated once the canvases and fonts have settled.
    const timer = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  // Subtle pointer parallax, desktop only, never when motion is reduced.
  useEffect(() => {
    if (reduced || typeof window === 'undefined') return
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (coarse) return
    const onMove = (e) => {
      rig.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      rig.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      rig.pointerX = 0
      rig.pointerY = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <section className="experience" id="experience" ref={rootRef} aria-label="Cinematic product presentation">
      <div className="stage">
        <div className="stage__backdrop" aria-hidden="true" />
        <StageCanvas color={colorHex} />
      </div>

      <ChapterArrival product={product} />
      <ChapterMotion />
      <ChapterDetails />
      <ChapterSpectrum product={product} colorId={colorId} onSelectColor={onSelectColor} />
      <ChapterSilhouette onOpenSizeGuide={onOpenSizeGuide} />

      <div className="experience__tail" aria-hidden="true" />

      <div className="experience__skip">
        <Link className="micro-link" to={`/product/${product.slug}`}>
          Skip the presentation — go to the product page
        </Link>
      </div>

      <ScrollProgressIndicator ready={ready} />
      <noscript>
        <p className="experience__noscript">
          This presentation is a scroll-driven 3D scene. The full product information and
          purchase controls are available below, and on the product page.
        </p>
      </noscript>
    </section>
  )
}
