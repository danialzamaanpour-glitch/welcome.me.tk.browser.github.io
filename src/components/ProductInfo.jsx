import { useEffect, useState } from 'react'
import RatingStars from './RatingStars'
import ColorSelector from './ColorSelector'
import SizeSelector from './SizeSelector'
import QuantityStepper from './QuantityStepper'
import TrustBadges from './TrustBadges'
import WishlistButton from './WishlistButton'
import { colorById, isColorSizeAvailable } from '../data/products'
import { discountPercent } from '../lib/format'
import { scrollToId } from '../lib/scroll'
import { useShop } from '../store/ShopContext'

/**
 * Purchase panel — the reference layout: title, rating, price, colour, size,
 * quantity, add to bag, wishlist and trust row. Everything reads and writes the
 * same variant state as the cinematic colour chapter.
 */
export default function ProductInfo({ product, onOpenSizeGuide, ctaId }) {
  const { money, getSelection, setColor, setSize, addToCart, setCartOpen, notify } = useShop()
  const { colorId, size } = getSelection(product)
  const [qty, setQty] = useState(1)
  const [status, setStatus] = useState('')

  const color = colorById(product, colorId)
  const discount = discountPercent(product.price, product.compareAt)
  const available = isColorSizeAvailable(product, colorId, size)

  useEffect(() => {
    setQty(1)
  }, [colorId, size, product.id])

  const handleAdd = () => {
    const ok = addToCart(product, colorId, size, qty)
    if (ok) {
      setStatus(`${product.name}, ${color.name}, size ${size} added to your bag.`)
      setCartOpen(true)
    } else {
      setStatus('That size is not available in this finish.')
    }
  }

  const handleUnavailable = (s) => {
    const message = `Size ${s} is not available in ${color.name}`
    setStatus(message)
    notify(message, 'error')
  }

  return (
    <div className="info">
      {product.badge && <span className="pill">{product.badge}</span>}
      <h1 className="info__title">{product.name}</h1>

      <div className="info__rating">
        <RatingStars value={product.rating} count={product.reviewCount} />
        <button type="button" className="micro-link" onClick={() => scrollToId('reviews')}>
          Read reviews
        </button>
      </div>

      <div className="info__price">
        <span className="price">{money(product.price)}</span>
        {product.compareAt && <span className="price price--was">{money(product.compareAt)}</span>}
        {discount && <span className="pill pill--dark">{discount}% off</span>}
      </div>

      <p className="info__desc">{product.shortDescription}</p>

      <ColorSelector product={product} colorId={colorId} onSelect={(id) => setColor(product, id)} />

      <SizeSelector
        product={product}
        colorId={colorId}
        size={size}
        onSelect={(s) => setSize(product, s)}
        onUnavailable={handleUnavailable}
        onOpenSizeGuide={onOpenSizeGuide}
      />

      <div className="info__qty">
        <QuantityStepper value={qty} onChange={setQty} />
        <span className="micro micro--muted">Free shipping on orders over $99</span>
      </div>

      <div className="info__actions" id={ctaId}>
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={handleAdd}
          aria-describedby="add-to-bag-status"
        >
          Add to bag
        </button>
        <WishlistButton product={product} variant="button" />
      </div>
      <p id="add-to-bag-status" className="visually-hidden" role="status">
        {status}
      </p>
      {!available && (
        <p className="info__warning">
          Size {size} is not available in {color.name}. Choose another size or finish.
        </p>
      )}

      <ul className="info__bullets">
        {product.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <TrustBadges />

      <p className="info__note">
        Demonstration storefront: the catalogue, variant availability and reviews are local sample
        data stored in your browser. No order is placed until you complete the demonstration
        checkout on this site.
      </p>
    </div>
  )
}
