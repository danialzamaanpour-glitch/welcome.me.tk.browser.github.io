import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Close, Minus, Plus, Return, Truck } from './icons'
import GarmentArt from './GarmentArt'
import { useShop } from '../store/ShopContext'

/**
 * Bag drawer. Quantities, line totals, subtotal and removal all read from the
 * single cart source of truth, and every variant of the same product is its own
 * line (product + colour + size).
 */
export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartLines,
    subtotal,
    cartCount,
    updateQty,
    removeLine,
    money,
  } = useShop()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!cartOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setCartOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => panelRef.current?.querySelector('button, a')?.focus(), 40)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  const freeShippingGap = Math.max(0, 99 - subtotal)

  return (
    <div className="overlay overlay--right">
      <button type="button" className="overlay__scrim" aria-label="Close bag" onClick={() => setCartOpen(false)} />
      <aside
        className="drawer drawer--right"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        ref={panelRef}
      >
        <div className="drawer__head">
          <h2 className="drawer__title">
            Your bag <span className="drawer__count">{cartCount}</span>
          </h2>
          <button type="button" className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag">
            <Close />
          </button>
        </div>

        {cartLines.length === 0 ? (
          <div className="cart__empty">
            <p className="cart__empty-title">Your bag is empty.</p>
            <p className="cart__empty-copy">
              Add the Essential Oversized Hoodie, or browse the rest of the collection.
            </p>
            <div className="cart__empty-actions">
              <Link className="btn btn--primary" to="/shop" onClick={() => setCartOpen(false)}>
                Browse the collection
              </Link>
              <Link className="btn btn--ghost" to="/wishlist" onClick={() => setCartOpen(false)}>
                View wishlist
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="cart__shipping">
              {freeShippingGap > 0 ? (
                <p className="micro">
                  {money(freeShippingGap)} away from free shipping
                </p>
              ) : (
                <p className="micro micro--ok">Free shipping unlocked</p>
              )}
            </div>

            <ul className="cart__lines">
              {cartLines.map((line) => (
                <li className="cart-line" key={line.key}>
                  <Link
                    to={`/product/${line.product.slug}`}
                    className="cart-line__media"
                    onClick={() => setCartOpen(false)}
                    aria-label={line.product.name}
                  >
                    <GarmentArt kind={line.product.kind} color={line.color?.hex} />
                  </Link>
                  <div className="cart-line__body">
                    <div className="cart-line__top">
                      <Link
                        to={`/product/${line.product.slug}`}
                        className="cart-line__name"
                        onClick={() => setCartOpen(false)}
                      >
                        {line.product.name}
                      </Link>
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => removeLine(line.key)}
                        aria-label={`Remove ${line.product.name}, ${line.color?.name}, size ${line.size}`}
                      >
                        <Close width={15} height={15} />
                      </button>
                    </div>
                    <p className="cart-line__variant">
                      {line.color?.name} · Size {line.size}
                    </p>
                    <div className="cart-line__foot">
                      <div className="stepper stepper--sm">
                        <button
                          type="button"
                          className="stepper__btn"
                          onClick={() => updateQty(line.key, line.qty - 1)}
                          aria-label={`Decrease quantity of ${line.product.name}`}
                        >
                          <Minus width={14} height={14} />
                        </button>
                        <span className="stepper__value" aria-live="polite">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          className="stepper__btn"
                          onClick={() => updateQty(line.key, line.qty + 1)}
                          aria-label={`Increase quantity of ${line.product.name}`}
                        >
                          <Plus width={14} height={14} />
                        </button>
                      </div>
                      <span className="cart-line__price">{money(line.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart__summary">
              <div className="cart__row">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <p className="micro micro--muted">
                Taxes and shipping are calculated at checkout.
              </p>
              <Link className="btn btn--primary btn--block" to="/checkout" onClick={() => setCartOpen(false)}>
                Checkout
              </Link>
              <p className="cart__notice">
                Demonstration checkout — this repository has no payment provider configured and no
                card details are collected.
              </p>
            </div>

            <ul className="cart__assurances">
              <li>
                <Truck width={16} height={16} />
                Free shipping over $99
              </li>
              <li>
                <Return width={16} height={16} />
                30-day returns
              </li>
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}
