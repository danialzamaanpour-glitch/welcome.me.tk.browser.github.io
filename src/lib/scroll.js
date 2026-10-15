/** Scroll helpers that respect the visitor's reduced-motion preference. */
export function prefersReducedScroll() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToId(id, { offset = 0 } = {}) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: prefersReducedScroll() ? 'auto' : 'smooth' })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedScroll() ? 'auto' : 'smooth' })
}
