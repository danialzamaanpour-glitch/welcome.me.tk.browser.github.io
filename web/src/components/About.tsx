import { useRef } from 'react';
import { aboutPoints } from '../data/content';
import { siteConfig } from '../config/site';
import { useParallax } from '../hooks/useParallax';
import { IconDroplet, IconShield } from './Icons';
import Reveal from './Reveal';

const POINT_ICONS = [IconDroplet, IconShield, IconDroplet];

export default function About() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  useParallax(imageRef, 0.07);

  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <Reveal className="about__media">
          <img
            ref={imageRef}
            src="/media/polaroids-900.jpg"
            alt="مجموعهٔ چاپ‌های عکس دانیال چپ در قاب‌های سفید"
            loading="lazy"
            decoding="async"
            width={900}
            height={1125}
          />
          <div className="about__media-badge">
            <img src="/media/logo-720.jpg" alt="" width={38} height={38} aria-hidden="true" />
            <span>
              <strong>{siteConfig.brand.fa}</strong>
              {siteConfig.brand.tagline}
            </span>
          </div>
        </Reveal>

        <Reveal className="about__body" delay={1}>
          <span className="eyebrow" dir="ltr">
            About
          </span>
          <h2 className="display section-head__title">
            چاپی که به تصویر
            <br />
            وفادار است
          </h2>
          <p className="lede" style={{ marginTop: '20px' }}>
            دانیال چپ یک لابراتوار چاپ دیجیتال است که روی یک کار متمرکز است: تبدیل عکس
            شما به چاپی که همان حس لحظهٔ گرفتن عکس را داشته باشد.
          </p>
          <p className="lede">
            هر فایل پیش از چاپ بررسی می‌شود، رنگ‌ها با دقت تنظیم می‌شوند و خروجی روی
            کاغذ یا شاسی مناسب همان تصویر چاپ می‌شود؛ بدون اغراق، بدون رنگ‌های غیرواقعی.
          </p>

          <div className="about__points">
            {aboutPoints.map((point, index) => {
              const Icon = POINT_ICONS[index % POINT_ICONS.length];
              return (
                <div className="about__point" key={point.title}>
                  <span className="about__point-icon">
                    <Icon />
                  </span>
                  <div>
                    <h4>{point.title}</h4>
                    <p>{point.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
