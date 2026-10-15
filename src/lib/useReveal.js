import { useEffect, useRef } from 'react'

/**
 * Adds `.is-in` to every `.reveal` descendant (and the container itself) once it
 * scrolls into view. CSS owns the transition, so nothing here can fight the
 * scroll-linked GSAP timelines used by the cinematic chapters.
 */
export function useReveal({ threshold = 0.15, stagger = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = [root, ...root.querySelectorAll('.reveal')].filter((n) =>
      n.classList.contains('reveal'),
    )
    if (!nodes.length) {
      root.classList.add('is-in')
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }
    if (stagger) {
      nodes.forEach((n, i) => {
        n.style.transitionDelay = `${Math.min(i * stagger, 600)}ms`
      })
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => {
      observer.disconnect()
      nodes.forEach((n) => {
        n.style.transitionDelay = ''
      })
    }
  }, [threshold, stagger])

  return ref
}
