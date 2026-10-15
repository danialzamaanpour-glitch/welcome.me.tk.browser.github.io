import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import Stars from '../ui/Stars.jsx'
import SizeGuideModal from './SizeGuideModal.jsx'
import { useStore } from '../../lib/store.jsx'
import { discountPercent, formatMoney, cn } from '../../lib/format.js'
import { isAvailable } from '../../data/products.js'

const TRUST = [
  { icon: 'truck', title: 'Free Shipping', body: 'On orders over $99' },
  { icon: 'returns', title: 'Easy Returns', body: '30-day return policy' },
  { icon: 'shield', title: 'Secure Payment', body: '100% secure checkout' }
]

/**
 * The purchase column: badge, title, rating, pricing, description, colour and
 * size selection, add-to-cart, wishlist and service indicators.
 */
export function PurchasePanel({ product, colorName, onColorChange, sizeLabel, onSizeChange, onReviewsClick }) {
  const { currency, addToCart, setCartOpen, toggleWishlist, isWishlisted, pushToast, announce } = useStore()
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [sizeError, setSizeError] = useState('')

  const discount = discountPercent(product.price, product.originalPrice)
  const saved = isWishlisted(product.id)
  const selectedSwatch = product.colors.find((c) => c.name === colorName) || product.colors[0]

  const handleAdd = () => {
    if (!sizeLabel) {
      setSizeError('Please select a size before adding this item to your bag.')
      document.getElementById('size-options')?.querySelector('button')?.focus()
      return
    }
    if (!isAvailable(product, colorName, sizeLabel)) {
      pushToast({
        tone: 'error',
        title: 'That combination is unavailable',
        description: `${colorName} in size ${sizeLabel} is out of stock.`
      })
      return
    }
    setSizeError('')
    addToCart(product, { color: colorName, size: sizeLabel })
    pushToast({
      title: 'Added to bag',
      description: `${product.name} — ${colorName}, size ${sizeLabel}`
    })
    announce(`${product.name}, ${colorName}, size ${sizeLabel} added to your bag`)
    setCartOpen(true)
  }

  const handleWishlist = () => {
    const added = toggleWishlist(product.id)
    pushToast({
      title: added ? 'Saved to wishlist' : 'Removed from wishlist',
      description: product.name
    })
    announce(added ? `${product.name} saved to your wishlist` : `${product.name} removed from your wishlist`)
  }

  return (
    <div className="lg:sticky lg:top-24">
      {product.badge ? (
        <span className="inline-block border border-line bg-surface px-3 py-1 text-micro font-semibold uppercase tracking-[0.14em] text-ink">
          {product.badge}
        </span>
      ) : null}

      <h1 className="mt-4 text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-product">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-meta">
        <Stars value={product.rating} label={`Rated ${product.rating} out of 5`} />
        <span className="font-semibold">{product.rating.toFixed(1)}</span>
        <button
          type="button"
          onClick={onReviewsClick}
          className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
        >
          ({product.reviewCount} reviews)
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="text-price font-bold tabular-nums">{formatMoney(product.price, currency)}</span>
        {product.originalPrice ? (
          <span className="text-[16px] text-faint line-through tabular-nums">
            {formatMoney(product.originalPrice, currency)}
          </span>
        ) : null}
        {discount ? (
          <span className="bg-cta px-2 py-1 text-micro font-semibold uppercase tracking-[0.1em] text-white">
            {discount}% OFF
          </span>
        ) : null}
      </div>

      <p className="mt-5 max-w-xl text-body text-muted">{product.shortDescription}</p>

      {product.highlights?.length ? (
        <ul className="mt-5 space-y-1.5">
          {product.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-meta text-muted">
              <Icon name="check" size={15} className="mt-1 shrink-0 text-ink" />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <hr className="my-7 border-line" />

      {/* Colour */}
      <div>
        <p className="text-label font-medium uppercase tracking-[0.05em] text-muted">
          Color: <span className="text-ink">{selectedSwatch.name}</span>
        </p>
        <div className="mt-3 flex items-center gap-3" role="radiogroup" aria-label="Colour">
          {product.colors.map((swatch) => {
            const selected = swatch.name === colorName
            return (
              <button
                key={swatch.name}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Colour ${swatch.name}${selected ? ', selected' : ''}`}
                onClick={() => {
                  onColorChange(swatch.name)
                  setSizeError('')
                }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
                  selected ? 'border-ink' : 'border-line hover:border-faint'
                )}
              >
                <span
                  className="block h-6 w-6 rounded-full border border-black/10"
                  style={{ backgroundColor: swatch.hex }}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Size */}
      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-label font-medium uppercase tracking-[0.05em] text-muted">
            Size: <span className="text-ink">{sizeLabel || 'Select a size'}</span>
          </p>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex items-center gap-1.5 text-label text-muted transition-colors hover:text-ink"
          >
            <Icon name="ruler" size={15} />
            Size Guide
          </button>
        </div>
        <div id="size-options" className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
          {product.sizes.map((size) => {
            const selected = size.label === sizeLabel
            return (
              <button
                key={size.label}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!size.available || product.stock <= 0}
                aria-label={`Size ${size.label}${size.available ? '' : ' — out of stock'}${selected ? ', selected' : ''}`}
                onClick={() => {
                  onSizeChange(selected ? null : size.label)
                  setSizeError('')
                }}
                className={cn(
                  'h-11 min-w-[56px] px-4 text-meta font-medium transition-colors duration-200',
                  selected
                    ? 'border border-cta bg-cta text-white'
                    : 'border border-line bg-paper text-ink hover:border-ink',
                  !size.available &&
                    'cursor-not-allowed border-line bg-surface text-faint line-through hover:border-line'
                )}
              >
                {size.label}
              </button>
            )
          })}
        </div>
        {sizeError ? (
          <p role="alert" className="mt-3 flex items-center gap-2 text-label text-danger">
            <Icon name="alert" size={14} />
            {sizeError}
          </p>
        ) : null}
        {product.sizes.some((size) => !size.available) ? (
          <p className="mt-2 text-label text-faint">Struck-through sizes are out of stock.</p>
        ) : null}
      </div>

      {/* Actions */}
      {product.stock <= 0 ? (
        <p role="status" className="mt-7 flex items-center gap-2 border border-line bg-surface px-4 py-3 text-meta text-muted">
          <Icon name="info" size={16} />
          This piece is sold out. Sizes above are shown for reference until the next run.
        </p>
      ) : null}
      <div className="mt-7 flex gap-3">
        <Button size="lg" fullWidth onClick={handleAdd} className="gap-2.5" disabled={product.stock <= 0}>
          <Icon name="bag" size={18} />
          {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
        </Button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            'flex h-[50px] w-[50px] shrink-0 items-center justify-center border transition-colors duration-200',
            saved ? 'border-ink text-ink' : 'border-line text-muted hover:border-ink hover:text-ink'
          )}
        >
          <Icon name="heart" size={19} filled={saved} className={saved ? 'animate-heart-pop' : ''} />
        </button>
      </div>

      <p className="mt-3 text-label text-faint">
        Free returns within 30 days ·{' '}
        <Link to="/pages/shipping-returns" className="link-underline">
          Shipping details
        </Link>
      </p>

      {/* Service indicators */}
      <ul className="mt-7 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-3">
        {TRUST.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <Icon name={item.icon} size={19} className="mt-0.5 shrink-0 text-ink" />
            <span>
              <span className="block text-meta font-semibold">{item.title}</span>
              <span className="block text-label text-muted">{item.body}</span>
            </span>
          </li>
        ))}
      </ul>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}

export default PurchasePanel
