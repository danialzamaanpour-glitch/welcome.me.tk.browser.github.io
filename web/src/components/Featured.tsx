import { useRef } from 'react';
import { products, services } from '../data/content';
import { requestOrder } from '../lib/order';
import { useParallax } from '../hooks/useParallax';
import { useRevealOnView } from '../hooks/useRevealOnView';
import { useTilt } from '../hooks/useTilt';
import { IconArrow, IconBox } from './Icons';
import Reveal from './Reveal';

export default function Featured() {
  return (
    <section className="section featured" id="products">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow" dir="ltr">
              Selected work
            </span>
            <h2 className="display section-head__title">چاپ‌هایی که روی دیوار می‌مانند</h2>
          </div>
          <p className="section-head__aside">
            هر محصول با چاپ اختصاصی و بازبینی نهایی آماده می‌شود. برای ابعاد، نوع کاغذ و
            زمان تحویل، از همین بخش استعلام بگیرید.
          </p>
        </Reveal>

        <div className="featured__grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} index={index} product={product} />
          ))}
        </div>

        <GalleryBand />
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: (typeof products)[number]; index: number }) {
  const tilt = useTilt(3.2);
  useRevealOnView(tilt.ref, index);
  const serviceTitle = services.find((service) => service.id === product.serviceId)?.title;

  return (
    <article
      ref={tilt.ref}
      className="product-card reveal"
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="product-card__media">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          width={1200}
          height={900}
        />
        <span className="product-card__tag">{product.tag}</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__desc">{product.description}</p>
        <button
          type="button"
          className="product-card__cta"
          onClick={() => requestOrder(serviceTitle)}
        >
          استعلام و سفارش
          <IconArrow />
        </button>
      </div>
    </article>
  );
}

function GalleryBand() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  useParallax(imageRef, 0.1);

  return (
    <Reveal className="gallery-band">
      <img
        ref={imageRef}
        className="gallery-band__img"
        src="/media/gallery-1800.jpg"
        alt="نمونهٔ چیدمان قاب‌های چاپی دانیال چپ روی دیوار"
        loading="lazy"
        decoding="async"
        width={1800}
        height={1200}
      />
      <div className="gallery-band__inner">
        <div>
          <h3 className="gallery-band__title">
            از یک فایل تا دیوار خانه؛ با چیدمان و ابعاد درست
          </h3>
          <p className="gallery-band__note">
            اگر مطمئن نیستید کدام ابعاد و قابی برای فضای شما مناسب است، در فرم سفارش
            بنویسید؛ در انتخاب اندازه و حاشیه کنارتان هستیم.
          </p>
        </div>
        <a className="btn btn--ghost" href="#order">
          <IconBox />
          مشاورهٔ انتخاب ابعاد
        </a>
      </div>
    </Reveal>
  );
}
