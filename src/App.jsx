import { Route, Routes, useSearchParams } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Account from './pages/Account.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Blog, { BlogPost } from './pages/Blog.jsx'
import Collections, { CollectionDetail } from './pages/Collections.jsx'
import NewArrivals from './pages/NewArrivals.jsx'
import Sale from './pages/Sale.jsx'
import SearchPage from './pages/SearchPage.jsx'
import InfoPage from './pages/InfoPage.jsx'
import NotFound from './pages/NotFound.jsx'

/** Reads the ?q= term so the search page reacts to the query string. */
function SearchRoute() {
  const [params] = useSearchParams()
  return <SearchPage query={params.get('q') || ''} />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionDetail />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="sale" element={<Sale />} />
        <Route path="search" element={<SearchRoute />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="account" element={<Account />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="pages/:slug" element={<InfoPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
