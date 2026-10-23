import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** stagger step, multiplied by ~95ms */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure';
  className?: string;
  id?: string;
};

/**
 * Scroll-triggered reveal. Adds `.is-in` the first time the element enters
 * the viewport, then disconnects. Reduced-motion users get the end state
 * immediately (see tokens.css).
 */
export default function Reveal({ children, delay = 0, as = 'div', className = '', id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      id,
      className: `reveal ${className}`.trim(),
      style: { '--d': delay } as CSSProperties,
    },
    children,
  );
}
