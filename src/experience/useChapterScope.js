import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scopes a GSAP timeline (or a set of ScrollTriggers) to one chapter element.
 *
 * Everything is registered inside a gsap.context, so unmounting — including
 * route changes — reverts the tweens and kills their scroll triggers and
 * listeners. Initial `from` states are applied in a layout effect, so there is
 * no flash of unmasked content before the first frame.
 *
 * With reduced motion the whole build is skipped and the chapter stays in its
 * final, static state.
 */
export function useChapterScope(build, { disabled = false, deps = [] } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (disabled) {
      el.setAttribute('data-static', 'true')
      return
    }
    el.removeAttribute('data-static')
    const ctx = gsap.context(() => build(el, gsap), el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, ...deps])

  return ref
}

export { gsap, ScrollTrigger }

/** The scroll range over which a chapter "arrives" into the pinned position. */
export const ARRIVE = { start: 'top bottom', end: 'top top' }
