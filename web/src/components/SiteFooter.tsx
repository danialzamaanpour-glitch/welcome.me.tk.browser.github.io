import { navLinks, services } from '../data/content';
import { siteConfig, hasContact } from '../config/site';
import { requestOrder } from '../lib/order';
import { IconArrow, IconInstagram, IconMail, IconPhone, IconPin, IconTelegram } from './Icons';

export default function SiteFooter() {
  const { contact, brand } = siteConfig;

  return (
    <footer className="site-footer">
      <img className="site-footer__stamp" src="/media/logo-720.jpg" alt="" aria-hidden="true" />
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a className="brand" href="#home" aria-label={`${brand.fa} — ${brand.tagline}`}>
              <img className="brand__mark" src="/media/logo-720.jpg" alt="" width={40} height={40} />
              <span className="brand__text">
                <span className="brand__latin">{brand.latin}</span>
                <span className="brand__fa">{brand.tagline}</span>
              </span>
            </a>
            <p className="site-footer__tagline">
              چاپ عکس، چاپ روی شاسی و قاب و عکس پرسنلی؛ با کنترل رنگ و کیفیت لابراتواری.
            </p>
            <a className="btn btn--ghost site-footer__cta" href="#order">
              درخواست چاپ
              <IconArrow />
            </a>
          </div>

          <div className="site-footer__col">
            <h4>خدمات</h4>
            <ul className="site-footer__links">
              {services.map((service) => (
                <li key={service.id}>
                  <button type="button" onClick={() => requestOrder(service.title)}>
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>دسترسی سریع</h4>
            <ul className="site-footer__links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>ارتباط</h4>
            <ul className="site-footer__links">
              <li>
                {hasContact('phone') ? (
                  <a href={`tel:${contact.phone}`} dir="ltr">
                    <IconPhone /> {contact.phone}
                  </a>
                ) : (
                  <span className="placeholder">تلفن — به‌زودی</span>
                )}
              </li>
              <li>
                {hasContact('email') ? (
                  <a href={`mailto:${contact.email}`}>
                    <IconMail /> {contact.email}
                  </a>
                ) : (
                  <span className="placeholder">ایمیل — به‌زودی</span>
                )}
              </li>
              <li>
                {hasContact('address') ? (
                  <span>
                    <IconPin /> {contact.address}
                  </span>
                ) : (
                  <span className="placeholder">نشانی — به‌زودی</span>
                )}
              </li>
              {(hasContact('instagram') || hasContact('telegram')) && (
                <li className="site-footer__social">
                  {hasContact('instagram') && (
                    <a href={contact.instagram} aria-label="اینستاگرام" target="_blank" rel="noreferrer">
                      <IconInstagram />
                    </a>
                  )}
                  {hasContact('telegram') && (
                    <a href={contact.telegram} aria-label="تلگرام" target="_blank" rel="noreferrer">
                      <IconTelegram />
                    </a>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {brand.fa} — تمامی حقوق محفوظ است.</span>
          <span className="latin" dir="ltr">
            DANIAL CHAP · ART &amp; PRINT
          </span>
          <a href="#home">بازگشت به بالای صفحه ↑</a>
        </div>
      </div>
    </footer>
  );
}
