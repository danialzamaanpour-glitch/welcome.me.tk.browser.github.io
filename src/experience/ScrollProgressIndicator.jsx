import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, cinema } from './cinematicState'
import { gsap, ScrollTrigger } from './useChapterScope'
import { scrollToId } from '../lib/scroll'

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)

/**
 * Chapter rail: which chapter the presentation is currently in, plus how far the
 * visitor has travelled through the film.
 *
 * Desktop gets the vertical rail beside the stage; phones get the same five
 * steps as a compact horizontal indicator along the bottom edge (see the
 * `chapter-rail` media queries). Every step is a real button, so the rail works
 * from the keyboard, and each one scrolls to that chapter's own scroll position —
 * measured from the live DOM, so it always matches the section's real geometry
 * and never argues with the scroll engine.
 *
 * The active step and the progress line are driven from the shared scroll
 * progress: a CSS variable for the line and a state change only when the active
 * chapter actually changes, so scrolling never re-renders the list.
 */
export default function ScrollProgressIndicator({ ready = true }) {
  const railRef = useRef(null)
  const stopsRef = useRef([])
  const activeRef = useRef(CHAPTERS[0].id)
  const [active, setActive] = useState(CHAPTERS[0].id)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const measure = () => {
      const section = document.getElementById('experience')
      if (!section) return
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const travel = section.offsetHeight - window.innerHeight
      if (travel <= 0) return
      stopsRef.current = CHAPTERS.map(({ id }) => {
        const node = document.getElementById(id)
        if (!node) return 0
        const top = node.getBoundingClientRect().top + window.scrollY
        return clamp01((top - sectionTop) / travel)
      })
    }

    const tick = () => {
      railRef.current?.style.setProperty('--progress', String(clamp01(cinema.progress)))
      const stops = stopsRef.current
      if (!stops.length) return
      let index = 0
      for (let i = 0; i < stops.length; i += 1) {
        if (cinema.progress + 0.002 >= stops[i]) index = i
      }
      const id = CHAPTERS[index]?.id
      if (id && id !== activeRef.current) {
        activeRef.current = id
        setActive(id)
      }
    }

    measure()
    tick()
    gsap.ticker.add(tick)
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)
    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ready])

  useEffect(() => {
    const el = document.getElementById('experience')
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '-12% 0px -12% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <nav
      className={`chapter-rail${visible ? ' is-visible' : ''}`}
      ref={railRef}
      aria-label="Chapter navigation"
    >
      <span className="chapter-rail__track" aria-hidden="true">
        <span className="chapter-rail__fill" />
      </span>
      <ol className="chapter-rail__list">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              className={`chapter-rail__item${active === chapter.id ? ' is-active' : ''}`}
              onClick={() => scrollToId(chapter.id)}
              aria-current={active === chapter.id ? 'true' : undefined}
            >
              <span className="chapter-rail__index">{chapter.index}</span>
              <span className="chapter-rail__label">{chapter.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
