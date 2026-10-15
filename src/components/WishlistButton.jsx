import { Heart } from './icons'
import { useShop } from '../store/ShopContext'

/**
 * Wishlist toggle. Saved pieces persist in the visitor's browser (this repo has
 * no backend service) and the heart state is always paired with a real label, so
 * the state never relies on the icon alone.
 */
export default function WishlistButton({ product, variant = 'icon', className = '' }) {
  const { isWished, toggleWishlist } = useShop()
  const wished = isWished(product.id)

  if (variant === 'button') {
    return (
      <button
        type="button"
        className={`btn btn--ghost btn--icon${wished ? ' is-wished' : ''} ${className}`}
        onClick={() => toggleWishlist(product)}
        aria-pressed={wished}
      >
        <Heart filled={wished} />
        {wished ? 'Saved' : 'Wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`wish-btn${wished ? ' is-wished' : ''} ${className}`}
      onClick={() => toggleWishlist(product)}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
    >
      <Heart filled={wished} width={17} height={17} />
    </button>
  )
}
