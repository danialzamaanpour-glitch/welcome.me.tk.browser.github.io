import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import { NAV_LINKS } from '../../data/content.js'
import { useClickOutside } from '../../lib/hooks.js'
import { useStore } from '../../lib/store.jsx'
import { cn } from '../../lib/format.js'

function NavDropdown({ item }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const closeTimer = useRef(0)
  useClickOutside(wrapperRef, open, () => setOpen(false))

  const openMenu = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 py-2 text-label font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-muted"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <Icon name="chevronDown" size={12} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 border border-line bg-paper py-2 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)] transition-all duration-200',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        {item.children.map((child) => (
          <Link
            key={child.label}
            to={child.to}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-meta text-muted transition-colors hover:bg-hover hover:text-ink"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { cartCount, setCartOpen, setSearchOpen, setNavOpen } = useStore()
  const location = useLocation()

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-[2px]">
      <div className="shell flex h-[62px] items-center justify-between gap-4 lg:h-[68px]">
        <div className="flex items-center gap-3 lg:gap-6">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-hover"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
          >
            <Icon name="menu" size={20} />
          </button>
          <Link
            to="/"
            className="text-[19px] font-extrabold uppercase leading-none tracking-[0.15em] text-ink lg:text-[21px]"
            aria-label="VELORA — home"
          >
            Velora
          </Link>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <NavDropdown item={item} />
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'inline-block py-2 text-label font-semibold uppercase tracking-[0.12em] transition-colors hover:text-muted',
                        isActive && location.pathname === item.to ? 'text-ink' : 'text-ink'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-hover"
            aria-label="Search products"
            aria-haspopup="dialog"
          >
            <Icon name="search" size={19} />
          </button>
          <Link
            to="/account"
            className="hidden h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-hover sm:flex"
            aria-label="Account"
          >
            <Icon name="user" size={19} />
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-hover"
            aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            aria-haspopup="dialog"
          >
            <Icon name="bag" size={19} />
            {cartCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cta px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
