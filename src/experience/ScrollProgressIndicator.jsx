import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from './useChapterScope'
import { scrollToId } from '../lib/scroll'

const CHAPTERS = [
  { id: 'chapter-01', index: '01', label: 'Arrival' },
  { id: 'chapter-02', index: '02', label: 'In motion' },
  { id: 'chapter-03', index: '03', label: 'In detail' },
  { id: 'chapter-04', index: '04', label: 'Spectrum' },
  { id: 'chapter-05', index: '05', label: 'Silhouette' },
]

/**
 * Chapter rail: shows the current chapter and overall progress through the
 * presentation. The progress value is written straight into a CSS variable, so
 * scrolling never re-renders React.
 */
export default function ScrollProgressIndicator() {
  const railRef = useRef(null)
  const [active, setActive] = useState(CHAPTERS[0].id)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const ctx = ScrollTrigger ? null : null
    const triggers = CHAPTERS.map((chapter) => {
      const el = document.getElementById(chapter.id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActive(chapter.id)
        },
      })
    }).filter(Boolean)

    const progressTrigger = ScrollTrigger.create({
      trigger: '#experience',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        railRef.current?.style.setProperty('--progress', String(self.progress))
      },
    })

    return () => {
      triggers.forEach((t) => t.kill())
      progressTrigger.kill()
      void ctx
    }
  }, [])

  useEffect(() => {
    const el = document.getElementById('experience')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' },
    )
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
