import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Close, Search as SearchIcon } from './icons'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import { useShop } from '../store/ShopContext'

/**
 * Working product search: filters the catalogue by name, category, collection and
 * garment type. Submitting jumps to the shop page with the query applied.
 */
export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { money } = useShop()

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const results = q
    ? PRODUCTS.filter((p) =>
        [p.name, p.category, p.kind, ...(p.collections || [])]
          .join(' ')
          .toLowerCase()
          .includes(q),
      ).slice(0, 6)
    : []

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" className="overlay__scrim" aria-label="Close search" onClick={onClose} />
      <div className="search">
        <div className="search__bar container">
          <SearchIcon width={20} height={20} />
          <input
            ref={inputRef}
            className="search__input"
            type="search"
            placeholder="Search hoodies, sweatshirts, collections…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search query"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <Close />
          </button>
        </div>

        <div className="search__body container">
          {!q && (
            <div className="search__suggestions">
              <p className="micro micro--muted">Browse</p>
              <ul className="search__chips">
                {COLLECTIONS.map((c) => (
                  <li key={c.id}>
                    <Link className="chip" to={`/shop?collection=${c.id}`} onClick={onClose}>
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className="chip" to="/shop?sale=1" onClick={onClose}>
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {q && results.length === 0 && (
            <p className="search__empty">
              No pieces match “{query}”. Try “hoodie”, “black”, or browse the full collection.
            </p>
          )}

          {results.length > 0 && (
            <ul className="search__results">
              {results.map((p) => (
                <li key={p.id}>
                  <Link className="search__result" to={`/product/${p.slug}`} onClick={onClose}>
                    <span className="search__result-name">{p.name}</span>
                    <span className="search__result-meta">
                      {p.category} · {money(p.price)}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link className="search__all" to={`/shop?q=${encodeURIComponent(query.trim())}`} onClick={onClose}>
                  See all results for “{query.trim()}”
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
