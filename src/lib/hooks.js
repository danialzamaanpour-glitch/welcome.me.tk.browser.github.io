import { useCallback, useEffect, useRef, useState } from 'react'

/** Move focus into a container while it is open, restore it on close. */
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active || !containerRef.current) return undefined
    const previous = document.activeElement
    const container = containerRef.current
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

    const focusFirst = () => {
      const [first] = container.querySelectorAll(selector)
      ;(first || container).focus?.()
    }
    const timer = window.setTimeout(focusFirst, 30)

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const focusable = Array.from(container.querySelectorAll(selector)).filter(
        (node) => node.offsetParent !== null
      )
      if (focusable.length === 0) return
      const firstNode = focusable[0]
      const lastNode = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault()
        lastNode.focus()
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault()
        firstNode.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      if (previous instanceof HTMLElement) previous.focus?.()
    }
  }, [containerRef, active])
}

/** Call `handler` when Escape is pressed while `active`. */
export function useEscapeKey(active, handler) {
  useEffect(() => {
    if (!active) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handler()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, handler])
}

/** Call `handler` on pointer-down outside the referenced element. */
export function useClickOutside(ref, active, handler) {
  useEffect(() => {
    if (!active) return undefined
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler()
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [ref, active, handler])
}

/** Current window scrollY, throttled to animation frames. */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        frame = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  return scrollY
}

/** Debounce a fast-changing value (search input, filters). */
export function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Scroll a section into view without leaking an id into the URL. */
export function useScrollToRef() {
  const ref = useRef(null)
  const scrollTo = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  return [ref, scrollTo]
}
