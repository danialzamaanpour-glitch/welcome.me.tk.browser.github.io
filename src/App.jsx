import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ShopProvider } from './store/ShopContext'
import AnnouncementBar from './components/AnnouncementBar'
import SiteHeader from './components/SiteHeader'
import NavigationDrawer from './components/NavigationDrawer'
import CartDrawer from './components/CartDrawer'
import Toaster from './components/Toaster'
import SiteFooter from './components/SiteFooter'
import { ScrollTrigger } from './experience/useChapterScope'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Collections from './pages/Collections'
import Journal from './pages/Journal'
import JournalEntry from './pages/JournalEntry'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Account from './pages/Account'
import Support from './pages/Support'
import NotFound from './pages/NotFound'

/**
 * Route changes reset the scroll position and recalculate any scroll-linked
 * timelines that were measured before the new page had laid out.
 */
function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' })
    const timer = setTimeout(() => ScrollTrigger.refresh(), 140)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ShopProvider>
      <BrowserRouter>
        <RouteEffects />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
        <NavigationDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalEntry />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />
            <Route path="/account" element={<Account />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <SiteFooter />
        <CartDrawer />
        <Toaster />
      </BrowserRouter>
    </ShopProvider>
  )
}
