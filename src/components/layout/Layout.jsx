import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MobileNavDrawer from './MobileNavDrawer.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import SearchOverlay from '../search/SearchOverlay.jsx'
import Toaster from '../ui/Toaster.jsx'
import { useScrollY } from '../../lib/hooks.js'

/** Storefront shell shared by every route. */
export function Layout() {
  const scrollY = useScrollY()
  const { pathname } = useLocation()

  // New route, new page: start at the top (back/forward keeps its own position).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-cta focus:px-4 focus:py-2 focus:text-meta focus:text-white"
      >
        Skip to content
      </a>
      <AnnouncementBar collapsed={scrollY > 100} />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <MobileNavDrawer />
      <Toaster />
    </div>
  )
}

export default Layout
