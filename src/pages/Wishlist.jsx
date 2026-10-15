import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductById } from '../data/products'
import { useReveal } from '../lib/useReveal'
import { useShop } from '../store/ShopContext'

export default function Wishlist() {
  const { wishlist } = useShop()
  const ref = useReveal({ stagger: 0.06 })
  const items = wishlist.map(getProductById).filter(Boolean)

  return (
    <div className="page wishlist" ref={ref}>
      <header className="container page-head">
        <p className="micro micro--muted reveal">Wishlist</p>
        <h1 className="page-title reveal">Saved pieces</h1>
        <p className="section-copy reveal">
          Saved in this browser on this device — this repository has no account system or server to
          store a wishlist against.
        </p>
      </header>

      <div className="container">
        {items.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">Nothing saved yet.</p>
            <p className="empty-state__copy">
              Tap the heart on any piece and it will wait for you here.
            </p>
            <Link className="btn btn--primary" to="/shop">
              Browse the collection
            </Link>
          </div>
        ) : (
          <ul className="card-grid card-grid--shop">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
