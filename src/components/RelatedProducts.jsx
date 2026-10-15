import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { ArrowRight } from './icons'
import { RELATED_PRODUCTS } from '../data/products'
import { useReveal } from '../lib/useReveal'

/**
 * CHAPTER 08 — THE COLLECTION REVEAL
 * The individual piece opens out into the collection: four cards, staggered in
 * with a restrained lift, every card a real link with a working wishlist toggle.
 */
export default function RelatedProducts({ products = RELATED_PRODUCTS }) {
  const ref = useReveal({ stagger: 0.08, threshold: 0.1 })

  return (
    <section className="related" ref={ref} aria-labelledby="related-heading">
      <div className="container section-head section-head--split">
        <div>
          <p className="micro micro--muted reveal">08 — The collection</p>
          <h2 className="section-title reveal" id="related-heading">
            The art of everyday.
          </h2>
          <p className="section-copy reveal">
            Four pieces from the same pattern book — the same restraint, different shapes.
          </p>
        </div>
        <Link className="link-arrow reveal" to="/shop">
          View all <ArrowRight width={16} height={16} />
        </Link>
      </div>

      <div className="container">
        <ul className="card-grid">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} angle={i % 2 === 0 ? 'front' : 'three'} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
