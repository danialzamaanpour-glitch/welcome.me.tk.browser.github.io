import { Link } from 'react-router-dom'
import Drawer from '../ui/Drawer.jsx'
import Icon from '../ui/Icon.jsx'
import { NAV_LINKS } from '../../data/content.js'
import { useStore } from '../../lib/store.jsx'

/** Mobile navigation drawer: every header destination, reachable by touch. */
export function MobileNavDrawer() {
  const { navOpen, setNavOpen, setSearchOpen, wishlistCount, cartCount } = useStore()

  const close = () => setNavOpen(false)

  return (
    <Drawer open={navOpen} onClose={close} side="left" title="Menu" width="w-full max-w-[360px]">
      <nav aria-label="Mobile">
        <ul className="space-y-1">
          {NAV_LINKS.map((item) => (
            <li key={item.label} className="border-b border-line py-1">
              <Link
                to={item.to}
                onClick={close}
                className="block py-3 text-[17px] font-semibold tracking-[-0.01em] transition-colors hover:text-muted"
              >
                {item.label}
              </Link>
              {item.children ? (
                <ul className="-mt-1 pb-3 pl-4">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        to={child.to}
                        onClick={close}
                        className="block py-1.5 text-meta text-muted transition-colors hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => {
            close()
            setSearchOpen(true)
          }}
          className="flex w-full items-center gap-3 border border-line px-4 py-3 text-meta text-muted transition-colors hover:bg-hover hover:text-ink"
        >
          <Icon name="search" size={17} />
          Search products
        </button>
        <dl className="space-y-2 text-meta text-muted">
          <div className="flex items-center justify-between">
            <dt>Wishlist</dt>
            <dd>
              <Link to="/wishlist" onClick={close} className="link-underline text-ink">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
              </Link>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Shopping bag</dt>
            <dd>
              <Link to="/cart" onClick={close} className="link-underline text-ink">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </Drawer>
  )
}

export default MobileNavDrawer
