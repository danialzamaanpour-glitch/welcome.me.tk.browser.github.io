import { useEffect, useRef, useState } from 'react';
import { cinematicChapters } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const FRAME_COUNT = 121;
const LOAD_CONCURRENCY = 6;
const READY_AT = Math.ceil(FRAME_COUNT * 0.65);

const pad3 = (value: number) => String(value).padStart(3, '0');

function frameSource(index: number) {
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  return `${mobile ? '/frames/mobile' : '/frames/desktop'}/f${pad3(index + 1)}.webp`;
}

/**
 * Scene 2 — the scroll-scrubbed cinematic sequence.
 *
 * The uploaded video is decoded ahead of time into a 121-frame WebP sequence
 * (see scripts/extract-frames.sh). Scroll position drives which frame is
 * painted on the canvas, so the camera move advances one way when scrolling
 * down and runs backwards when scrolling up — no playback clock involved.
 * The canvas is redrawn only when the visible frame actually changes.
 */
export default function CinematicScroll() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLSpanElement>(null);
  const loaderPctRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const framesRef = useRef<Array<HTMLImageElement | null>>(
    Array.from({ length: FRAME_COUNT }, () => null),
  );
  const stillRef = useRef<HTMLImageElement | null>(null);
  const readyRef = useRef(false);
  const chapterRef = useRef(-1);

  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);

  /* poster frame used until (and behind) the decoded sequence */
  useEffect(() => {
    const image = new Image();
    image.src = '/media/still-1600.jpg';
    image.decode?.().catch(() => undefined);
    stillRef.current = image;
  }, []);

  /* progressive frame preload */
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const queue = Array.from({ length: FRAME_COUNT }, (_, index) => index);
    let done = 0;

    const finish = () => {
      if (cancelled || readyRef.current) return;
      readyRef.current = true;
      setReady(true);
    };

    const worker = async () => {
      while (queue.length > 0) {
        const index = queue.shift();
        if (index === undefined) return;
        const image = new Image();
        image.decoding = 'async';
        image.src = frameSource(index);
        try {
          await image.decode();
        } catch {
          /* an undecodable frame falls back to the nearest loaded neighbour */
        }
        if (cancelled) return;
        framesRef.current[index] = image;
        done += 1;

        const pct = Math.round((done / FRAME_COUNT) * 100);
        if (loaderBarRef.current) loaderBarRef.current.style.width = `${pct}%`;
        if (loaderPctRef.current) loaderPctRef.current.textContent = `${pct}٪`;
        if (done >= READY_AT) finish();
      }
    };

    void Promise.all(Array.from({ length: LOAD_CONCURRENCY }, worker));

    // never leave the loader on screen if the network stalls
    const bailout = window.setTimeout(finish, 9000);

    return () => {
      cancelled = true;
      window.clearTimeout(bailout);
    };
  }, [reduced]);

  /* scroll → frame */
  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let smooth = 0;
    let lastIndex = -1;
    let lastWidth = 0;

    const paint = (index: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        lastWidth = width;
      }

      const frames = framesRef.current;
      let image = frames[index];
      if (!image) {
        for (let i = index - 1; i >= 0; i -= 1) {
          if (frames[i]) {
            image = frames[i];
            break;
          }
        }
      }
      if (!image) {
        for (let i = index + 1; i < frames.length; i += 1) {
          if (frames[i]) {
            image = frames[i];
            break;
          }
        }
      }
      if (!image) image = stillRef.current;

      ctx.clearRect(0, 0, width, height);
      if (!image || !image.naturalWidth) return;

      // Fill the frame on portrait/small screens, letterbox inside the
      // blurred backdrop on wide screens so the original composition holds.
      const fillsScreen = width / height < 1.2;
      const scale = fillsScreen
        ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
        : Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const offsetX = fillsScreen ? (width - drawWidth) * 0.55 : (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const target = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;

      smooth += (target - smooth) * 0.17;
      if (Math.abs(target - smooth) < 0.0008) smooth = target;

      const index = Math.round(smooth * (FRAME_COUNT - 1));

      if (index !== lastIndex || lastWidth === 0) {
        paint(index);
        lastIndex = index;

        if (counterRef.current) {
          counterRef.current.textContent = `${pad3(index + 1)} / ${FRAME_COUNT}`;
        }

        const nextChapter = smooth < 0.34 ? 0 : smooth < 0.68 ? 1 : 2;
        if (nextChapter !== chapterRef.current) {
          chapterRef.current = nextChapter;
          setChapter(nextChapter);
        }
      }

      wrap.style.setProperty('--p', smooth.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => {
      lastIndex = -1;
      lastWidth = 0;
    });
    observer.observe(canvas);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="cinematic--static" id="scene" aria-label="تجربهٔ چاپ">
        <div className="cinematic__static-media">
          <img
            src="/media/still-1600.jpg"
            alt="چاپ‌های عکس دانیال چپ روی میز تاریک در نور استودیویی"
            width={1600}
            height={1067}
            loading="lazy"
          />
        </div>
        <div className="cinematic__static-copy">
          {cinematicChapters.map((item) => (
            <div key={item.index} style={{ marginBottom: '28px' }}>
              <span className="caption__index">{item.index}</span>
              <h2 className="caption__title">{item.title}</h2>
              <p className="caption__text" style={{ marginInline: 'auto' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="cinematic-scroll" id="scene" ref={wrapRef} aria-label="تجربهٔ سینمایی چاپ">
      <div className="cinematic">
        <div className="cinematic__backdrop" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          className="cinematic__canvas"
          role="img"
          aria-label="نمای سینمایی از چاپ‌های عکس دانیال چپ، هم‌زمان با اسکرول صفحه"
        />
        <div className="cinematic__grade" aria-hidden="true" />

        <div className="cinematic__chrome">
          <span className="cinematic__label" dir="ltr">
            Cinematic sequence
          </span>
          <span className="cinematic__frame-count" ref={counterRef} dir="ltr">
            001 / {FRAME_COUNT}
          </span>
        </div>

        <div className="cinematic__captions">
          {cinematicChapters.map((item, index) => (
            <div
              key={item.index}
              className={`caption ${index === chapter ? 'is-active' : ''}`}
              aria-hidden={index !== chapter}
            >
              <span className="caption__index">{item.index}</span>
              <h2 className="caption__title">{item.title}</h2>
              <p className="caption__text">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="cinematic__rail" aria-hidden="true">
          <div className="cinematic__rail-track">
            <div className="cinematic__rail-fill" />
          </div>
          <span className="cinematic__rail-label" dir="ltr">
            SCROLL
          </span>
        </div>

        <div
          ref={loaderRef}
          className={`cinematic__loader ${ready ? 'is-hidden' : ''}`}
          aria-live="polite"
        >
          <div className="cinematic__loader-inner">
            <span className="cinematic__loader-title">در حال آماده‌سازی تجربهٔ سینمایی…</span>
            <div className="cinematic__loader-bar">
              <span ref={loaderBarRef} style={{ width: '0%' }} />
            </div>
            <span className="cinematic__loader-pct" ref={loaderPctRef} dir="ltr">
              0٪
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
