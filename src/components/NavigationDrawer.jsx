import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Close } from './icons'
import { useShop } from '../store/ShopContext'
import { COLLECTIONS } from '../data/products'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?sort=newest', label: 'New arrivals' },
  { to: '/collections', label: 'Collections' },
  { to: '/shop?sale=1', label: 'Sale' },
  { to: '/journal', label: 'Journal' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account', label: 'Account & orders' },
]

export default function NavigationDrawer({ open, onClose }) {
  const panelRef = useRef(null)
  const { wishlist } = useShop()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const t = setTimeout(() => panelRef.current?.querySelector('a, button')?.focus(), 40)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="overlay overlay--left" role="dialog" aria-modal="true" aria-label="Navigation">
      <button type="button" className="overlay__scrim" aria-label="Close menu" onClick={onClose} />
      <div className="drawer drawer--left" ref={panelRef}>
        <div className="drawer__head">
          <span className="wordmark wordmark--sm">Velora</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <Close />
          </button>
        </div>
        <nav className="drawer__nav" aria-label="Menu">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `drawer__link${isActive ? ' is-active' : ''}`}
              onClick={onClose}
            >
              {item.label}
              {item.to === '/wishlist' && wishlist.length > 0 && (
                <span className="drawer__count">{wishlist.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="drawer__foot">
          <p className="micro micro--muted">Collections</p>
          <ul className="search__chips">
            {COLLECTIONS.map((c) => (
              <li key={c.id}>
                <Link className="chip" to={`/shop?collection=${c.id}`} onClick={onClose}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
