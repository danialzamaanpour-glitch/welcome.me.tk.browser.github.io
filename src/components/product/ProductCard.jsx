import { Link } from 'react-router-dom'
import Media from '../ui/Media.jsx'
import Icon from '../ui/Icon.jsx'
import { useStore } from '../../lib/store.jsx'
import { discountPercent, formatMoney, cn } from '../../lib/format.js'

/** Compact product tile used by every listing and recommendation grid. */
export function ProductCard({ product, priority = false, className = '' }) {
  const { currency, toggleWishlist, isWishlisted, pushToast, announce } = useStore()
  const saved = isWishlisted(product.id)
  const discount = discountPercent(product.price, product.originalPrice)
  const image = (product.images || product.colors[0]?.images || [])[0]

  const onToggle = () => {
    const added = toggleWishlist(product.id)
    pushToast({
      title: added ? 'Saved to wishlist' : 'Removed from wishlist',
      description: product.name
    })
    announce(added ? `${product.name} saved to your wishlist` : `${product.name} removed from your wishlist`)
  }

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-surface">
        <Link to={`/product/${product.slug}`} className="block" aria-label={`${product.name}, view product`}>
          <Media
            image={image}
            ratio="1 / 1"
            sizes="card"
            priority={priority}
            className="transition-transform duration-250 group-hover:scale-[1.02]"
          />
        </Link>

        {product.badge || product.stock <= 0 ? (
          <span
            className={cn(
              'absolute left-0 top-0 px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.1em]',
              product.stock <= 0 ? 'bg-surface2 text-muted' : product.badge === 'Sale' ? 'bg-cta text-white' : 'bg-surface2 text-ink'
            )}
          >
            {product.stock <= 0 ? 'Sold Out' : product.badge}
          </span>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            'absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border bg-paper/95 transition-colors duration-200 hover:border-ink',
            saved ? 'border-ink text-ink' : 'border-line text-muted hover:text-ink'
          )}
        >
          <Icon name="heart" size={16} filled={saved} className={saved ? 'animate-heart-pop' : ''} />
        </button>
      </div>

      <div className="pt-3">
        <h3 className="text-[14px] font-semibold leading-snug">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-muted">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-[15px] font-semibold tabular-nums">{formatMoney(product.price, currency)}</span>
          {product.originalPrice ? (
            <span className="text-meta text-faint line-through tabular-nums">
              {formatMoney(product.originalPrice, currency)}
            </span>
          ) : null}
          {discount ? <span className="text-label font-semibold text-danger">{discount}% OFF</span> : null}
        </p>
        <p className="mt-0.5 text-label text-faint">{product.colors.length} colours</p>
      </div>
    </article>
  )
}

export default ProductCard
