import type { ReactNode } from 'react';
import { services } from '../data/content';
import { requestOrder } from '../lib/order';
import { useRevealOnView } from '../hooks/useRevealOnView';
import { useTilt } from '../hooks/useTilt';
import { IconArrow, IconFrame, IconId, IconPhoto } from './Icons';
import Reveal from './Reveal';

const ICONS = {
  photo: IconPhoto,
  frame: IconFrame,
  id: IconId,
};

const NUMERALS = ['۰۱', '۰۲', '۰۳'];

export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow" dir="ltr">
              Services
            </span>
            <h2 className="display section-head__title">
              سه مسیر برای دیدن
              <br />
              عکس‌هایتان
            </h2>
          </div>
          <p className="section-head__aside">
            از چاپ تک‌برگ تا قاب آمادهٔ دیوار و عکس پرسنلی؛ هر سفارش پیش از چاپ بازبینی
            می‌شود تا <strong>رنگ و جزئیات</strong> همان‌طور که دیده‌اید چاپ شود.
          </p>
        </Reveal>

        <div className="services__grid">
          {services.map((service, index) => {
            const Icon = ICONS[service.icon];
            return (
              <ServiceCard key={service.id} index={index}>
                <span className="service-card__index">{NUMERALS[index]}</span>
                <span className="service-card__icon">
                  <Icon />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                <button
                  type="button"
                  className="service-card__action"
                  onClick={() => requestOrder(service.title)}
                >
                  سفارش این خدمت
                  <IconArrow />
                </button>
              </ServiceCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ServiceCardProps = {
  children: ReactNode;
  index: number;
};

function ServiceCard({ children, index }: ServiceCardProps) {
  const tilt = useTilt(4);
  useRevealOnView(tilt.ref, index);

  return (
    <article
      ref={tilt.ref}
      className="service-card reveal"
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      {children}
    </article>
  );
}
