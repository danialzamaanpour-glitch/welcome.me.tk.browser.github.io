import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import Breadcrumbs from '../ui/Breadcrumbs.jsx'
import Button from '../ui/Button.jsx'
import Drawer from '../ui/Drawer.jsx'
import Icon from '../ui/Icon.jsx'
import { CATEGORIES, PRODUCTS, SWATCHES } from '../../data/products.js'
import { useStore } from '../../lib/store.jsx'
import { cn, formatMoney, pluralize } from '../../lib/format.js'

const PAGE_SIZE = 8
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' }
]

const PRICE_CEILING = Math.ceil(Math.max(...PRODUCTS.map((product) => product.price)) / 10) * 10
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const COLOR_OPTIONS = ['charcoal', 'lightGray', 'cream', 'black', 'slate', 'sand', 'offWhite', 'navy']

function toggleInSet(set, value) {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

/**
 * Shared listing surface: filter sidebar (drawer on mobile), sort, active
 * filter chips, product count, empty state and load-more pagination. Every
 * filter and sort actually narrows the rendered product set.
 */
export function ProductListing({
  title,
  subtitle,
  breadcrumbs,
  products,
  lockedCategory = null,
  lockedCollection = null,
  emptyMessage = 'No products match these filters.'
}) {
  const { currency, setSearchOpen } = useStore()
  const [params, setParams] = useSearchParams()
  const [categories, setCategories] = useState(() => new Set(lockedCategory ? [] : []))
  const [colors, setColors] = useState(() => new Set())
  const [sizes, setSizes] = useState(() => new Set())
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [saleOnly, setSaleOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [sort, setSort] = useState('featured')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState(params.get('q') || '')

  // Deep links such as /shop?category=Hoodies drive the category filter.
  const urlCategory = params.get('category')
  const urlCollection = params.get('collection')
  const urlSale = params.get('sale')
  const urlNew = params.get('new')

  useEffect(() => {
    if (urlCategory) setCategories(new Set([urlCategory]))
  }, [urlCategory])

  useEffect(() => {
    if (urlSale === '1') setSaleOnly(true)
    if (urlNew === '1') setNewOnly(true)
  }, [urlSale, urlNew])

  useEffect(() => {
    setQuery(params.get('q') || '')
  }, [params])

  // Reset pagination whenever the result set changes shape.
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [categories, colors, sizes, maxPrice, inStockOnly, saleOnly, newOnly, sort, query, urlCollection])

  const scoped = useMemo(() => {
    let list = products
    if (lockedCategory) list = list.filter((product) => product.category === lockedCategory)
    if (lockedCollection) list = list.filter((product) => product.collection === lockedCollection)
    if (urlCollection && !lockedCollection) {
      const name = urlCollection.charAt(0).toUpperCase() + urlCollection.slice(1)
      list = list.filter((product) => product.collection === name)
    }
    return list
  }, [products, lockedCategory, lockedCollection, urlCollection])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = scoped.filter((product) => {
      if (categories.size && !categories.has(product.category)) return false
      if (colors.size) {
        const colorKeys = product.colors.map((color) => color.name)
        const selectedNames = [...colors].map((key) => SWATCHES[key]?.name).filter(Boolean)
        if (!selectedNames.some((name) => colorKeys.includes(name))) return false
      }
      if (sizes.size) {
        const availableLabels = product.sizes.filter((size) => size.available).map((size) => size.label)
        if (![...sizes].some((label) => availableLabels.includes(label))) return false
      }
      if (product.price > maxPrice) return false
      if (inStockOnly && product.stock <= 0) return false
      if (saleOnly && !product.originalPrice) return false
      if (newOnly && !product.isNew) return false
      if (term) {
        const haystack = `${product.name} ${product.category} ${product.collection} ${product.shortDescription}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })

    const sorted = [...list]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.reviewCount - a.reviewCount)
        break
      default:
        sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return sorted
  }, [scoped, categories, colors, sizes, maxPrice, inStockOnly, saleOnly, newOnly, sort, query])

  const categoryCounts = useMemo(() => {
    const counts = {}
    scoped.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    return counts
  }, [scoped])

  const activeChips = [
    ...[...categories].map((value) => ({ key: `category-${value}`, label: value, clear: () => setCategories(toggleInSet(categories, value)) })),
    ...[...colors].map((value) => ({
      key: `color-${value}`,
      label: SWATCHES[value]?.name || value,
      clear: () => setColors(toggleInSet(colors, value))
    })),
    ...[...sizes].map((value) => ({ key: `size-${value}`, label: `Size ${value}`, clear: () => setSizes(toggleInSet(sizes, value)) })),
    ...(maxPrice < PRICE_CEILING
      ? [{ key: 'price', label: `Under ${formatMoney(maxPrice, currency)}`, clear: () => setMaxPrice(PRICE_CEILING) }]
      : []),
    ...(inStockOnly ? [{ key: 'stock', label: 'In stock', clear: () => setInStockOnly(false) }] : []),
    ...(saleOnly ? [{ key: 'sale', label: 'On sale', clear: () => setSaleOnly(false) }] : []),
    ...(newOnly ? [{ key: 'new', label: 'New arrivals', clear: () => setNewOnly(false) }] : []),
    ...(query ? [{ key: 'query', label: `“${query}”`, clear: () => { setQuery(''); params.delete('q'); setParams(params) } }] : [])
  ]

  const clearAll = () => {
    setCategories(new Set())
    setColors(new Set())
    setSizes(new Set())
    setMaxPrice(PRICE_CEILING)
    setInStockOnly(false)
    setSaleOnly(false)
    setNewOnly(false)
    if (query) {
      setQuery('')
      params.delete('q')
      setParams(params)
    }
  }

  const filterPanel = (
    <div className="space-y-8">
      {!lockedCategory ? (
        <fieldset>
          <legend className="text-label font-semibold uppercase tracking-[0.12em]">Category</legend>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <label className="flex cursor-pointer items-center gap-3 text-meta text-muted transition-colors hover:text-ink">
                  <input
                    type="checkbox"
                    checked={categories.has(category)}
                    onChange={() => setCategories(toggleInSet(categories, category))}
                    className="h-4 w-4 shrink-0 accent-[#050505]"
                  />
                  <span className={cn(categories.has(category) && 'font-medium text-ink')}>{category}</span>
                  <span className="ml-auto text-label text-faint">{categoryCounts[category] || 0}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-label font-semibold uppercase tracking-[0.12em]">Colour</legend>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {COLOR_OPTIONS.map((key) => {
            const swatch = SWATCHES[key]
            const active = colors.has(key)
            return (
              <li key={key}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setColors(toggleInSet(colors, key))}
                  className={cn(
                    'flex w-full items-center gap-2 border px-2.5 py-2 text-left text-label transition-colors',
                    active ? 'border-ink text-ink' : 'border-line text-muted hover:border-faint'
                  )}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="truncate">{swatch.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-label font-semibold uppercase tracking-[0.12em]">Size</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={sizes.has(size)}
              onClick={() => setSizes(toggleInSet(sizes, size))}
              className={cn(
                'h-10 min-w-[46px] border text-meta font-medium transition-colors',
                sizes.has(size) ? 'border-cta bg-cta text-white' : 'border-line text-ink hover:border-ink'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label font-semibold uppercase tracking-[0.12em]">Price</legend>
        <label htmlFor="price-range" className="mt-4 block text-meta text-muted">
          Up to <span className="font-semibold text-ink">{formatMoney(maxPrice, currency)}</span>
        </label>
        <input
          id="price-range"
          type="range"
          min={20}
          max={PRICE_CEILING}
          step={5}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="mt-3 w-full accent-[#050505]"
        />
      </fieldset>

      <fieldset>
        <legend className="text-label font-semibold uppercase tracking-[0.12em]">Availability</legend>
        <ul className="mt-4 space-y-2.5">
          {[
            { label: 'In stock only', checked: inStockOnly, onChange: () => setInStockOnly((value) => !value) },
            { label: 'On sale', checked: saleOnly, onChange: () => setSaleOnly((value) => !value) },
            { label: 'New arrivals', checked: newOnly, onChange: () => setNewOnly((value) => !value) }
          ].map((option) => (
            <li key={option.label}>
              <label className="flex cursor-pointer items-center gap-3 text-meta text-muted transition-colors hover:text-ink">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={option.onChange}
                  className="h-4 w-4 shrink-0 accent-[#050505]"
                />
                <span className={cn(option.checked && 'font-medium text-ink')}>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  )

  const shown = filtered.slice(0, visible)

  return (
    <div className="shell py-8 lg:py-12">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-body text-muted">{subtitle}</p> : null}
        </div>
        <p className="text-meta text-muted" aria-live="polite">
          {pluralize(filtered.length, 'product')}
        </p>
      </header>

      {/* Search within the listing */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-line py-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 border border-line px-3">
          <Icon name="search" size={16} className="shrink-0 text-faint" />
          <label htmlFor="listing-search" className="sr-only">
            Search within these products
          </label>
          <input
            id="listing-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this collection"
            className="h-11 w-full border-0 bg-transparent text-meta focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                params.delete('q')
                setParams(params)
              }}
              className="shrink-0 text-label text-muted transition-colors hover:text-ink"
            >
              Clear
            </button>
          ) : null}
        </div>

        <Button
          variant="outline"
          onClick={() => setFiltersOpen(true)}
          className="gap-2 lg:hidden"
          aria-haspopup="dialog"
        >
          <Icon name="filter" size={16} />
          Filters{activeChips.length ? ` (${activeChips.length})` : ''}
        </Button>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-label text-muted">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 border border-line bg-paper px-3 text-meta text-ink focus:border-ink focus:outline-none"
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeChips.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-label text-muted transition-colors hover:border-ink hover:text-ink"
              aria-label={`Remove filter ${chip.label}`}
            >
              {chip.label}
              <Icon name="close" size={12} />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="link-underline ml-1 text-label font-medium text-ink">
            Clear all
          </button>
        </div>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        <div>
          {shown.length === 0 ? (
            <div className="border border-line bg-surface px-6 py-16 text-center">
              <Icon name="search" size={26} className="mx-auto text-faint" />
              <p className="mt-4 text-[16px] font-semibold">{emptyMessage}</p>
              <p className="mt-2 text-meta text-muted">
                Try widening the price range, or clearing a filter to see more of the collection.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={clearAll}>Clear all filters</Button>
                <Button variant="outline" onClick={() => setSearchOpen(true)}>
                  Search the store
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
                {shown.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
              </div>
              {visible < filtered.length ? (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <p className="text-label text-muted">
                    Showing {shown.length} of {filtered.length}
                  </p>
                  <Button variant="outline" size="lg" onClick={() => setVisible((current) => current + PAGE_SIZE)}>
                    Load more products
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        title="Filters"
        width="w-full max-w-[360px]"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={clearAll}>
              Clear all
            </Button>
            <Button size="lg" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length}
            </Button>
          </div>
        }
      >
        {filterPanel}
      </Drawer>
    </div>
  )
}

export default ProductListing
