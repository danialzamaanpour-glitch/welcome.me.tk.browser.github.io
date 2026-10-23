import { useEffect, useState, type CSSProperties } from 'react';
import { navLinks } from '../data/content';
import { siteConfig } from '../config/site';
import { IconArrow } from './Icons';

const SECTION_IDS = ['home', 'services', 'products', 'about', 'order'];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 26);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner container">
          <a className="brand" href="#home" aria-label={`${siteConfig.brand.fa} — ${siteConfig.brand.tagline}`}>
            <img
              className="brand__mark"
              src="/media/logo-720.jpg"
              alt=""
              width={40}
              height={40}
              loading="eager"
            />
            <span className="brand__text">
              <span className="brand__latin">DANIAL CHAP</span>
              <span className="brand__fa">لابراتوار چاپ دیجیتال</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="ناوبری اصلی">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`site-nav__link ${active === id ? 'is-active' : ''}`}
                  aria-current={active === id ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <a className="btn btn--primary site-header__cta" href="#order">
              سفارش چاپ
              <IconArrow />
            </a>
            <button
              type="button"
              className="burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="ناوبری موبایل">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              style={{ '--i': index } as CSSProperties}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <span>{link.latin}</span>
            </a>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <span>{siteConfig.brand.fa} — {siteConfig.brand.tagline}</span>
          <a className="btn btn--primary" href="#order" onClick={() => setOpen(false)}>
            درخواست چاپ
            <IconArrow />
          </a>
        </div>
      </div>
    </>
  );
}
