import { useEffect, type RefObject } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Depth parallax for a background layer: writes a small offset (in px) to the
 * `--par` custom property, based on how far the element sits from the centre
 * of the viewport. Work is skipped while the element is off screen.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, strength = 0.16) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let last = Number.NaN;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom > -240 && rect.top < vh + 240) {
        const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const value = Math.max(-1.1, Math.min(1.1, offset)) * strength * 100;
        if (Number.isNaN(last) || Math.abs(value - last) > 0.15) {
          el.style.setProperty('--par', `${value.toFixed(2)}px`);
          last = value;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, strength, reduced]);
}
