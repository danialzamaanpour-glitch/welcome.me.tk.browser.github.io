import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ArrowRight } from '../components/icons'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import { useReveal } from '../lib/useReveal'

export default function Collections() {
  const ref = useReveal({ stagger: 0.06, threshold: 0.05 })

  return (
    <div className="page collections" ref={ref}>
      <header className="container page-head">
        <p className="micro micro--muted reveal">Collections</p>
        <h1 className="page-title reveal">Three ways to wear the same restraint.</h1>
        <p className="section-copy reveal">
          Every collection is built from the same palette and the same oversized pattern book.
        </p>
      </header>

      {COLLECTIONS.map((collection) => {
        const items = PRODUCTS.filter((p) => p.collections.includes(collection.id)).slice(0, 4)
        return (
          <section className="collection" key={collection.id} aria-labelledby={`collection-${collection.id}`}>
            <div className="container section-head section-head--split">
              <div>
                <h2 className="section-title reveal" id={`collection-${collection.id}`}>
                  {collection.name}
                </h2>
                <p className="section-copy reveal">{collection.description}</p>
              </div>
              <Link className="link-arrow reveal" to={`/shop?collection=${collection.id}`}>
                Shop {collection.name} <ArrowRight width={16} height={16} />
              </Link>
            </div>
            <div className="container">
              <ul className="card-grid">
                {items.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}
    </div>
  )
}
