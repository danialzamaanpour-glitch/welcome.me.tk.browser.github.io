import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import Media from '../ui/Media.jsx'
import { PRODUCTS } from '../../data/products.js'
import { useStore } from '../../lib/store.jsx'
import { useDebounced, useEscapeKey, useFocusTrap } from '../../lib/hooks.js'
import { formatMoney } from '../../lib/format.js'

const SUGGESTIONS = [
  { label: 'Hoodies', to: '/shop?category=Hoodies' },
  { label: 'Sweatshirts', to: '/shop?category=Sweatshirts' },
  { label: 'T-Shirts', to: '/shop?category=T-Shirts' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Sale', to: '/sale' }
]

function matches(product, term) {
  const haystack = [product.name, product.category, product.collection, product.shortDescription]
    .join(' ')
    .toLowerCase()
  return haystack.includes(term)
}

/** Full-screen search: suggestions, live product matches, and an empty state. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen, currency } = useStore()
  const [term, setTerm] = useState('')
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const debounced = useDebounced(term, 180)
  const query = debounced.trim().toLowerCase()

  useFocusTrap(panelRef, searchOpen)
  useEscapeKey(searchOpen, () => setSearchOpen(false))

  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(timer)
    }
    setTerm('')
    return undefined
  }, [searchOpen])

  const results = useMemo(() => {
    if (query.length < 2) return []
    return PRODUCTS.filter((product) => matches(product, query)).slice(0, 6)
  }, [query])

  const go = (to) => {
    setSearchOpen(false)
    navigate(to)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={() => setSearchOpen(false)} aria-hidden="true" />
      <div ref={panelRef} tabIndex={-1} className="relative mx-auto w-full max-w-3xl bg-paper px-5 pb-8 pt-6 sm:mt-16 sm:px-8 sm:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)] animate-fade-up">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <Icon name="search" size={20} className="shrink-0 text-muted" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) go(`/product/${results[0].slug}`)
              if (event.key === 'Enter' && !results[0] && query) go(`/search?q=${encodeURIComponent(term.trim())}`)
            }}
            placeholder="Search hoodies, sweatshirts, tees…"
            className="w-full border-0 bg-transparent text-[17px] text-ink placeholder:text-faint focus:outline-none"
            autoComplete="off"
          />
          {term ? (
            <button
              type="button"
              onClick={() => {
                setTerm('')
                inputRef.current?.focus()
              }}
              className="shrink-0 text-label text-muted transition-colors hover:text-ink"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-hover hover:text-ink"
            aria-label="Close search"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="mt-6">
          {query.length < 2 ? (
            <>
              <p className="eyebrow">Suggested categories</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => go(item.to)}
                      className="border border-line px-4 py-2 text-meta text-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-meta text-faint">Type at least two characters to see matching products.</p>
            </>
          ) : results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] font-semibold">No products match “{debounced.trim()}”</p>
              <p className="mt-1 text-meta text-muted">
                Try a category like “hoodie”, or browse the full collection.
              </p>
              <button
                type="button"
                onClick={() => go('/shop')}
                className="mt-5 inline-flex h-11 items-center border border-line px-5 text-meta transition-colors hover:border-ink"
              >
                Browse all products
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <ul className="mt-4 divide-y divide-line">
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => go(`/product/${product.slug}`)}
                      className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-hover"
                    >
                      <span className="w-14 shrink-0">
                        <Media
                          image={(product.images || product.colors[0]?.images || [])[0]}
                          ratio="1 / 1"
                          sizes="thumb"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-meta font-semibold">{product.name}</span>
                        <span className="block text-label text-muted">{product.category}</span>
                      </span>
                      <span className="text-meta font-semibold tabular-nums">
                        {formatMoney(product.price, currency)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {results.length === 6 ? (
                <button
                  type="button"
                  onClick={() => go(`/search?q=${encodeURIComponent(debounced.trim())}`)}
                  className="mt-5 inline-flex items-center gap-2 text-meta font-medium text-muted transition-colors hover:text-ink"
                >
                  See all results <Icon name="arrowRight" size={15} />
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
