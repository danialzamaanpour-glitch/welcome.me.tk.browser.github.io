import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import { useReveal } from '../lib/useReveal'

const CATEGORIES = ['All', 'Hoodies', 'Sweatshirts', 'Tees']
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

/** Shop with working category, collection, sale, search and sort filters (all in the URL). */
export default function Shop() {
  const [params, setParams] = useSearchParams()
  const ref = useReveal({ stagger: 0.05, threshold: 0.05 })

  const category = params.get('category') || 'All'
  const collection = params.get('collection') || ''
  const sale = params.get('sale') === '1'
  const sort = params.get('sort') || 'featured'
  const query = (params.get('q') || '').trim()

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === 'All' || value === '' ) next.delete(key)
      else next.set(key, value)
    })
    setParams(next, { replace: true })
  }

  const products = useMemo(() => {
    let list = [...PRODUCTS]
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (collection) list = list.filter((p) => p.collections.includes(collection))
    if (sale) list = list.filter((p) => p.compareAt && p.compareAt > p.price)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((p) =>
        [p.name, p.category, p.kind, ...p.collections].join(' ').toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating)
        break
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return list
  }, [category, collection, sale, sort, query])

  const activeCollection = COLLECTIONS.find((c) => c.id === collection)
  const hasFilters = category !== 'All' || Boolean(collection) || sale || Boolean(query)

  return (
    <div className="page shop" ref={ref}>
      <header className="container page-head">
        <p className="micro micro--muted reveal">Shop</p>
        <h1 className="page-title reveal">
          {activeCollection ? activeCollection.name : sale ? 'On sale' : category === 'All' ? 'All pieces' : category}
        </h1>
        <p className="section-copy reveal">
          {activeCollection
            ? activeCollection.description
            : 'The full wardrobe: oversized hoodies, sweatshirts and tees in a strictly monochrome palette.'}
        </p>
      </header>

      <div className="container shop__controls reveal">
        <div className="chip-row" role="group" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${category === c ? ' is-active' : ''}`}
              aria-pressed={category === c}
              onClick={() => update({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="chip-row" role="group" aria-label="Collections">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${collection === c.id ? ' is-active' : ''}`}
              aria-pressed={collection === c.id}
              onClick={() => update({ collection: collection === c.id ? '' : c.id })}
            >
              {c.name}
            </button>
          ))}
          <button
            type="button"
            className={`chip${sale ? ' is-active' : ''}`}
            aria-pressed={sale}
            onClick={() => update({ sale: sale ? '' : '1' })}
          >
            On sale
          </button>
        </div>

        <div className="shop__meta">
          <p className="micro micro--muted">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            {query ? ` for “${query}”` : ''}
          </p>
          <div className="shop__tools">
            {hasFilters && (
              <button
                type="button"
                className="micro-link"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
              >
                Clear filters
              </button>
            )}
            <label className="shop__sort">
              <span className="visually-hidden">Sort products</span>
              <select className="select" value={sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="container">
        {products.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">Nothing matches those filters.</p>
            <p className="empty-state__copy">Try another category, or clear the filters to see everything.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="card-grid card-grid--shop">
            {products.map((product, i) => (
              <li key={product.id}>
                <ProductCard product={product} angle={i % 3 === 1 ? 'three' : i % 3 === 2 ? 'side' : 'front'} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
