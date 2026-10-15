import { useState } from 'react'
import { Link } from 'react-router-dom'
import Media from '../components/ui/Media.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import { POLICY } from '../data/content.js'
import { useStore } from '../lib/store.jsx'
import { formatMoney } from '../lib/format.js'
import { usePageMeta } from '../lib/seo.js'
import { cn } from '../lib/format.js'

const FREE_SHIPPING_THRESHOLD = 99
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ZIP = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard', eta: '3–5 business days', price: 8 },
  { id: 'express', name: 'Express', eta: '1–2 business days', price: 18 }
]

const EMPTY = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  region: '',
  postcode: '',
  country: 'United States'
}

/**
 * Demonstration checkout.
 *
 * It validates like a real checkout, but it collects no card details and
 * processes no payment: the payment area says so, and the confirmation screen
 * states plainly that nothing was charged and no order was transmitted.
 */
export function Checkout() {
  const { cart, subtotalUSD, currency, clearCart, pushToast } = useStore()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [delivery, setDelivery] = useState('standard')
  const [reference, setReference] = useState(null)

  usePageMeta('Checkout', 'Complete your VELORA order.')

  const option = DELIVERY_OPTIONS.find((entry) => entry.id === delivery)
  const shipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD && delivery === 'standard' ? 0 : option.price
  const total = subtotalUSD + shipping

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!EMAIL.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.'
    if (!form.address.trim()) next.address = 'Enter your street address.'
    if (!form.city.trim()) next.city = 'Enter your city.'
    if (!form.region.trim()) next.region = 'Enter your state or region.'
    if (!ZIP.test(form.postcode.trim())) next.postcode = 'Enter a valid postal code.'
    if (!form.country.trim()) next.country = 'Enter your country.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) {
      const firstError = document.querySelector('[aria-invalid="true"]')
      firstError?.focus()
      pushToast({ tone: 'error', title: 'Check the highlighted fields', description: 'Some details are missing or invalid.' })
      return
    }
    // A demo reference only — no order is sent anywhere.
    const stamp = Date.now().toString(36).toUpperCase().slice(-6)
    setReference(`VLR-DEMO-${stamp}`)
    clearCart()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (reference) {
    return (
      <div className="shell py-16 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-1.5 text-label font-medium uppercase tracking-[0.1em]">
            <Icon name="info" size={14} />
            Demo confirmation
          </span>
          <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">
            Thank you — your demo order is complete
          </h1>
          <p className="mt-4 text-body text-muted">
            This storefront is a demonstration environment. <strong className="font-semibold text-ink">No payment was
            taken, nothing was charged, and no order was transmitted to a fulfilment system.</strong> The reference
            below exists only on this screen.
          </p>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            <div className="flex items-center justify-between py-3 text-meta">
              <dt className="text-muted">Reference</dt>
              <dd className="font-semibold">{reference}</dd>
            </div>
            <div className="flex items-center justify-between py-3 text-meta">
              <dt className="text-muted">Contact</dt>
              <dd className="font-medium">{form.email}</dd>
            </div>
            <div className="flex items-center justify-between py-3 text-meta">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-medium">
                {option.name} · {option.eta}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/shop" size="lg">
              Continue shopping
            </Button>
            <Button to="/" variant="outline" size="lg">
              Back to home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="shell py-16 lg:py-24">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Checkout</h1>
        <div className="mt-8 max-w-xl border border-line bg-surface px-6 py-14 text-center">
          <Icon name="bag" size={28} className="mx-auto text-faint" />
          <p className="mt-4 text-[16px] font-semibold">Your bag is empty</p>
          <p className="mt-2 text-meta text-muted">Add a piece to your bag before checking out.</p>
          <Button to="/shop" size="lg" className="mt-6">
            Shop the collection
          </Button>
        </div>
      </div>
    )
  }

  const field = (name, label, options = {}) => {
    const { type = 'text', autoComplete, className = '', span = 1 } = options
    return (
      <div className={cn(span === 2 && 'sm:col-span-2', className)}>
        <label htmlFor={name} className="field-label">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={update(name)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className={cn('field', errors[name] && 'border-danger')}
        />
        {errors[name] ? (
          <p id={`${name}-error`} className="mt-1.5 text-label text-danger">
            {errors[name]}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="shell py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="text-label text-muted">
        <Link to="/cart" className="transition-colors hover:text-ink">
          Shopping Bag
        </Link>
        <span className="px-2 text-line">/</span>
        <span className="text-ink">Checkout</span>
      </nav>

      <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Checkout</h1>
      <p className="mt-2 max-w-2xl text-meta text-muted">
        Demonstration checkout — the form validates like a real one, but no payment details are collected and no charge
        is made.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="space-y-10">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
              1. Contact information
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field('email', 'Email address', { type: 'email', autoComplete: 'email', span: 2 })}
            </div>
          </section>

          <section aria-labelledby="shipping-heading">
            <h2 id="shipping-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
              2. Shipping address
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field('firstName', 'First name', { autoComplete: 'given-name' })}
              {field('lastName', 'Last name', { autoComplete: 'family-name' })}
              {field('address', 'Street address', { autoComplete: 'street-address', span: 2 })}
              {field('city', 'City', { autoComplete: 'address-level2' })}
              {field('region', 'State / Region', { autoComplete: 'address-level1' })}
              {field('postcode', 'Postal code', { autoComplete: 'postal-code' })}
              {field('country', 'Country', { autoComplete: 'country-name' })}
            </div>
          </section>

          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
              3. Delivery options
            </h2>
            <div className="mt-5 space-y-3">
              {DELIVERY_OPTIONS.map((entry) => {
                const free = entry.id === 'standard' && subtotalUSD >= FREE_SHIPPING_THRESHOLD
                return (
                  <label
                    key={entry.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 border px-4 py-4 transition-colors',
                      delivery === entry.id ? 'border-ink' : 'border-line hover:border-faint'
                    )}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={entry.id}
                      checked={delivery === entry.id}
                      onChange={() => setDelivery(entry.id)}
                      className="h-4 w-4 accent-[#050505]"
                    />
                    <span className="flex-1">
                      <span className="block text-meta font-semibold">{entry.name}</span>
                      <span className="block text-label text-muted">{entry.eta}</span>
                    </span>
                    <span className="text-meta font-semibold tabular-nums">
                      {free ? 'Free' : formatMoney(entry.price, currency)}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
              4. Payment
            </h2>
            <div className="mt-5 flex items-start gap-3 border border-line bg-surface p-5">
              <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-muted" />
              <div className="text-meta text-muted">
                <p className="font-semibold text-ink">No payment is processed here</p>
                <p className="mt-1">
                  This demonstration storefront is not connected to a payment provider, so no card details are requested
                  or transmitted. A live deployment would attach a supported payment provider at this step.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside aria-label="Order summary">
          <div className="border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-label font-semibold uppercase tracking-[0.12em]">Order Summary</h2>
            <ul className="mt-5 divide-y divide-line">
              {cart.map((line) => (
                <li key={line.key} className="flex gap-4 py-4">
                  <span className="w-[64px] shrink-0">
                    <Media image={line.image} ratio="3 / 4" sizes="thumb" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-meta font-semibold leading-snug">{line.name}</span>
                    <span className="mt-0.5 block text-label text-muted">
                      {line.color} · {line.size} · Qty {line.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 text-meta font-semibold tabular-nums">
                    {formatMoney(line.unitPrice * line.quantity, currency)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-3 border-t border-line pt-4 text-meta">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium tabular-nums">{formatMoney(subtotalUSD, currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium tabular-nums">{shipping === 0 ? 'Free' : formatMoney(shipping, currency)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-[16px]">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold tabular-nums">{formatMoney(total, currency)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" fullWidth className="mt-6">
              Place Demo Order
            </Button>
            <p className="mt-3 text-label text-faint">
              {POLICY.returnsNote} Returns accepted within {POLICY.returnPeriod}.
            </p>
          </div>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
