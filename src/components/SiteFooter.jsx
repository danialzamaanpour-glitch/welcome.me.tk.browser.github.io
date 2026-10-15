import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../data/products'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="wordmark wordmark--sm">Velora</span>
          <p className="footer__tagline">
            Wear the dimension. A monochrome studio wardrobe, presented in real time.
          </p>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <h2 className="footer__heading">Shop</h2>
          <ul>
            <li>
              <Link to="/shop?category=Hoodies">Hoodies</Link>
            </li>
            <li>
              <Link to="/shop?category=Sweatshirts">Sweatshirts</Link>
            </li>
            <li>
              <Link to="/shop?category=Tees">Tees</Link>
            </li>
            <li>
              <Link to="/shop?sale=1">Sale</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Collections">
          <h2 className="footer__heading">Collections</h2>
          <ul>
            {COLLECTIONS.map((c) => (
              <li key={c.id}>
                <Link to={`/shop?collection=${c.id}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/journal">Journal</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Help">
          <h2 className="footer__heading">Help</h2>
          <ul>
            <li>
              <Link to="/support#shipping">Shipping</Link>
            </li>
            <li>
              <Link to="/support#returns">Returns</Link>
            </li>
            <li>
              <Link to="/support#size">Size &amp; fit</Link>
            </li>
            <li>
              <Link to="/support#contact">Contact</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/account">Orders</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p className="micro micro--muted">
          © {new Date().getFullYear()} VELORA — demonstration storefront. No real orders, payments
          or shipments take place on this site.
        </p>
        <p className="micro micro--muted">
          Real-time 3D: Three.js · React Three Fiber — Scroll: GSAP ScrollTrigger — Fabric: generated
          height fields, no photography.
        </p>
      </div>
    </footer>
  )
}
