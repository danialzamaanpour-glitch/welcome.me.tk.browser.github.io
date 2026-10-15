import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bag, Heart, Menu, Search, User } from './icons'
import { useShop } from '../store/ShopContext'
import SearchOverlay from './SearchOverlay'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?sort=newest', label: 'New arrivals' },
  { to: '/collections', label: 'Collections' },
  { to: '/shop?sale=1', label: 'Sale' },
  { to: '/journal', label: 'Journal' },
]

export default function SiteHeader({ onOpenMenu }) {
  const { cartCount, wishlist, setCartOpen } = useShop()
  const [searchOpen, setSearchOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`header${condensed ? ' is-condensed' : ''}`}>
        <div className="header__inner container">
          <button
            type="button"
            className="icon-btn header__menu"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
          >
            <Menu />
          </button>

          <Link to="/" className="wordmark" aria-label="VELORA — home">
            Velora
          </Link>

          <nav className="header__nav" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `header__link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search />
            </button>
            <Link to="/account" className="icon-btn header__account" aria-label="Account and orders">
              <User />
            </Link>
            <Link to="/wishlist" className="icon-btn header__wishlist" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Heart filled={wishlist.length > 0} />
              {wishlist.length > 0 && <span className="badge badge--quiet">{wishlist.length}</span>}
            </Link>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Open bag, ${cartCount} items`}
            >
              <Bag />
              <span className={`badge${cartCount > 0 ? '' : ' badge--empty'}`} aria-hidden="true">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
