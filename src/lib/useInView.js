import { useEffect, useRef, useState } from 'react'

/** True while the element is intersecting the viewport (with a small margin). */
export function useInView(ref, { rootMargin = '200px', threshold = 0 } = {}) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting))
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return inView
}

/** Pointer position in normalised [-1,1] space, written into a ref (no re-render). */
export function usePointerRef(target = { x: 0, y: 0 }) {
  const ref = useRef(target)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onMove = (e) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      ref.current.x = 0
      ref.current.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return ref
}
