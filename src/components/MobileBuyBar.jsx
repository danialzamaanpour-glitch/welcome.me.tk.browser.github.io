import { useEffect, useState } from 'react'
import { colorById } from '../data/products'
import { useShop } from '../store/ShopContext'

/**
 * Compact sticky purchase bar for phones. It only appears while the main
 * add-to-bag button is off screen, mirrors the current colour/size/price, and
 * calls the exact same cart action — one gesture, one line item.
 */
export default function MobileBuyBar({ product, ctaId }) {
  const { money, getSelection, addToCart, setCartOpen } = useShop()
  const [visible, setVisible] = useState(false)
  const { colorId, size } = getSelection(product)
  const color = colorById(product, colorId)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const target = document.getElementById(ctaId)
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.4 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [ctaId])

  return (
    <div className={`buy-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <div className="buy-bar__info">
        <span className="buy-bar__name">{product.name}</span>
        <span className="buy-bar__variant">
          {color.name} · {size} · {money(product.price)}
        </span>
      </div>
      <button
        type="button"
        className="btn btn--primary buy-bar__cta"
        tabIndex={visible ? 0 : -1}
        onClick={() => {
          if (addToCart(product, colorId, size, 1)) setCartOpen(true)
        }}
      >
        Add to bag
      </button>
    </div>
  )
}
