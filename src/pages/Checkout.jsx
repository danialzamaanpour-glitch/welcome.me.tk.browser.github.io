import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GarmentArt from '../components/GarmentArt'
import { Lock } from '../components/icons'
import { useShop } from '../store/ShopContext'

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan']

/**
 * Demonstration checkout.
 *
 * No payment provider is configured in this repository, so this page collects a
 * delivery address only — never card details — and records the order locally in
 * the browser. It never claims a payment succeeded.
 */
export default function Checkout() {
  const { cartLines, subtotal, money, placeOrder, setCartOpen } = useShop()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postal: '',
    country: COUNTRIES[0],
  })
  const [method, setMethod] = useState('standard')
  const [errors, setErrors] = useState({})

  const shipping = subtotal >= 99 ? 0 : method === 'express' ? 18 : 8
  const total = subtotal + shipping

  if (cartLines.length === 0) {
    return (
      <div className="page container empty-state">
        <p className="empty-state__title">Your bag is empty.</p>
        <p className="empty-state__copy">Add a piece and the demonstration checkout will open here.</p>
        <Link className="btn btn--primary" to="/shop">
          Shop all pieces
        </Link>
      </div>
    )
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter a name for the delivery.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.address.trim()) next.address = 'Enter a street address.'
    if (!form.city.trim()) next.city = 'Enter a city.'
    if (!form.postal.trim()) next.postal = 'Enter a postal code.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const order = placeOrder({ customer: { ...form }, shippingMethod: method })
    if (!order) return
    setCartOpen(false)
    navigate(`/order/${order.id}`)
  }

  return (
    <div className="page checkout">
      <div className="container checkout__grid">
        <form className="checkout__form" onSubmit={submit} noValidate>
          <header className="page-head page-head--tight">
            <p className="micro micro--muted">Checkout</p>
            <h1 className="page-title">Delivery details</h1>
          </header>

          <p className="banner banner--notice">
            <Lock width={15} height={15} />
            Demonstration checkout: no payment provider is configured in this repository, no card
            details are requested, and nothing is charged or shipped.
          </p>

          <div className="form-grid">
            <label className="field field--full">
              <span className="field__label">Full name</span>
              <input
                className="input"
                value={form.name}
                autoComplete="name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>
            <label className="field field--full">
              <span className="field__label">Email</span>
              <input
                className="input"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </label>
            <label className="field field--full">
              <span className="field__label">Street address</span>
              <input
                className="input"
                value={form.address}
                autoComplete="street-address"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                aria-invalid={Boolean(errors.address)}
              />
              {errors.address && <span className="field__error">{errors.address}</span>}
            </label>
            <label className="field">
              <span className="field__label">City</span>
              <input
                className="input"
                value={form.city}
                autoComplete="address-level2"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city && <span className="field__error">{errors.city}</span>}
            </label>
            <label className="field">
              <span className="field__label">Postal code</span>
              <input
                className="input"
                value={form.postal}
                autoComplete="postal-code"
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
                aria-invalid={Boolean(errors.postal)}
              />
              {errors.postal && <span className="field__error">{errors.postal}</span>}
            </label>
            <label className="field field--full">
              <span className="field__label">Country</span>
              <select
                className="select"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="fieldset">
            <legend className="field__label">Shipping method</legend>
            <label className="radio">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={method === 'standard'}
                onChange={() => setMethod('standard')}
              />
              <span>Standard — 3–5 business days</span>
              <span className="radio__price">{subtotal >= 99 ? 'Free' : money(8)}</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={method === 'express'}
                onChange={() => setMethod('express')}
              />
              <span>Express — 1–2 business days</span>
              <span className="radio__price">{money(18)}</span>
            </label>
            <p className="micro micro--muted">
              Delivery times are illustrative: this build has no carrier integration.
            </p>
          </fieldset>

          <button type="submit" className="btn btn--primary btn--block">
            Place demonstration order
          </button>
        </form>

        <aside className="checkout__summary" aria-label="Order summary">
          <h2 className="checkout__summary-title">Order summary</h2>
          <ul className="checkout__lines">
            {cartLines.map((line) => (
              <li className="checkout-line" key={line.key}>
                <span className="checkout-line__media">
                  <GarmentArt kind={line.product.kind} color={line.color?.hex} />
                </span>
                <span className="checkout-line__body">
                  <span className="checkout-line__name">{line.product.name}</span>
                  <span className="checkout-line__variant">
                    {line.color?.name} · {line.size} · ×{line.qty}
                  </span>
                </span>
                <span className="checkout-line__price">{money(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? 'Free' : money(shipping)}</dd>
            </div>
            <div className="totals__grand">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
          </dl>
          <p className="micro micro--muted">
            Prices are shown in your selected display currency; the order is recorded in USD values.
          </p>
        </aside>
      </div>
    </div>
  )
}
