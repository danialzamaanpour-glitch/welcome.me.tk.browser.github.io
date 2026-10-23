import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

/**
 * Sets --rx / --ry (tilt) and --mx / --my (pointer bloom position) CSS
 * variables on the referenced element. Pointer-only: touch devices keep the
 * flat presentation.
 */
export function useTilt(maxTilt = 5) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      el.style.setProperty('--ry', `${(x - 0.5) * maxTilt * 2}deg`);
      el.style.setProperty('--rx', `${(y - 0.5) * -maxTilt * 2}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    },
    [maxTilt],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
