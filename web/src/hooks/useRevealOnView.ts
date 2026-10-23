import { useEffect, type RefObject } from 'react';

/**
 * Adds `.is-in` to an existing element the first time it scrolls into view.
 * Used where the same node also needs pointer handlers (tilt cards), so the
 * reveal lives on the real element instead of a wrapper.
 */
export function useRevealOnView(ref: RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty('--d', String(delay));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}
