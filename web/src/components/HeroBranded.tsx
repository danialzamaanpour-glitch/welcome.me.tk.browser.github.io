import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { siteConfig } from '../config/site';

/**
 * Scene 1 — the branded hero asset, presented as a lit print in a dark room.
 *
 * The poster stays pinned while the next section slides over it; its own
 * scroll progress (0 → 1 over ~half a viewport) drives a slight scale-down and
 * fade so the handoff into the cinematic sequence never feels like a jump.
 */
export default function HeroBranded() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.style.setProperty('--hp', '0');
      return;
    }

    let raf = 0;
    let last = -1;

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      // Progress spans the whole pinned-and-releasing window, so the print
      // recedes gently while the cinematic sheet rises over it.
      const p = Math.min(1, Math.max(0, -rect.top / rect.height));
      if (Math.abs(p - last) > 0.002) {
        wrap.style.setProperty('--hp', p.toFixed(3));
        last = p;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame || event.pointerType !== 'mouse') return;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frame.style.setProperty('--ry', `${x * 4}deg`);
    frame.style.setProperty('--rx', `${y * -3}deg`);
  };

  const handlePointerLeave = () => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty('--ry', '0deg');
    frame.style.setProperty('--rx', '0deg');
  };

  return (
    <div className="hero-scroll" id="hero" ref={wrapRef}>
      <section className="hero" aria-label={`${siteConfig.brand.fa} — ${siteConfig.brand.tagline}`}>
        <div
          className="hero__stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="hero__frame" ref={frameRef}>
            <img
              src="/media/hero-1920.jpg"
              srcSet="/media/hero-1024.jpg 1024w, /media/hero-1600.jpg 1600w, /media/hero-1920.jpg 1920w"
              sizes="(max-width: 900px) 94vw, min(92vw, 1240px)"
              alt="دانیال چپ — چاپ عکس با کیفیت لابراتواری، چاپ عکس، چاپ روی شاسی و قاب، عکس پرسنلی"
              width={1920}
              height={1280}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <div className="hero__meta">
          <div className="hero__meta-line hero__meta-line--fa">
            <strong>{siteConfig.brand.fa}</strong>
            <span>{siteConfig.brand.tagline}</span>
          </div>
          <a className="scroll-cue" href="#scene">
            برای آغاز تجربه، اسکرول کنید
            <span className="scroll-cue__track" aria-hidden="true" />
          </a>
          <div className="hero__meta-line" dir="ltr">
            <strong>DANIAL CHAP</strong>
            <span>ART &amp; PRINT</span>
          </div>
        </div>
      </section>
    </div>
  );
}
