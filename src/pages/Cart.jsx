import { Link } from 'react-router-dom'
import Media from '../components/ui/Media.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import QuantityStepper from '../components/ui/QuantityStepper.jsx'
import RecommendedProducts from '../components/product/RecommendedProducts.jsx'
import { PRODUCTS, getProductById, getRelatedProducts } from '../data/products.js'
import { useStore } from '../lib/store.jsx'
import { formatMoney, pluralize } from '../lib/format.js'
import { usePageMeta } from '../lib/seo.js'

const FREE_SHIPPING_THRESHOLD = 99
const STANDARD_SHIPPING = 8

/** Full cart: quantity edits, removal, totals — all in one place. */
export function Cart() {
  const { cart, cartCount, subtotalUSD, updateQuantity, removeFromCart, currency } = useStore()
  usePageMeta('Shopping Bag', 'Review the items in your VELORA bag.')

  const shipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD || subtotalUSD === 0 ? 0 : STANDARD_SHIPPING
  const total = subtotalUSD + shipping

  if (cart.length === 0) {
    return (
      <div className="shell py-16 lg:py-24">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Shopping Bag</h1>
        <div className="mt-8 max-w-xl border border-line bg-surface px-6 py-14 text-center">
          <Icon name="bag" size={30} className="mx-auto text-faint" />
          <p className="mt-4 text-[16px] font-semibold">Your bag is empty</p>
          <p className="mt-2 text-meta text-muted">
            Add a hoodie, sweatshirt or tee and it will appear here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/shop" size="lg">
              Shop the collection
            </Button>
            <Button to="/new-arrivals" variant="outline" size="lg">
              See new arrivals
            </Button>
          </div>
        </div>
        <RecommendedProducts products={PRODUCTS.filter((product) => product.isNew).slice(0, 4)} title="Start with these" />
      </div>
    )
  }

  const related = getRelatedProducts(getProductById(cart[0].productId), 4)

  return (
    <div className="shell py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="text-label text-muted">
        <Link to="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <span className="px-2 text-line">/</span>
        <span className="text-ink">Shopping Bag</span>
      </nav>

      <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">
        Shopping Bag <span className="text-muted">({pluralize(cartCount, 'item')})</span>
      </h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <section aria-label="Bag items">
          <ul className="divide-y divide-line border-y border-line">
            {cart.map((line) => (
              <li key={line.key} className="flex gap-5 py-6">
                <Link to={`/product/${line.slug}`} className="w-[110px] shrink-0 sm:w-[128px]">
                  <Media image={line.image} ratio="3 / 4" sizes="thumb" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-[15px] font-semibold leading-snug">
                        <Link to={`/product/${line.slug}`} className="transition-colors hover:text-muted">
                          {line.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-meta text-muted">
                        {line.color} · Size {line.size}
                      </p>
                      <p className="mt-1 text-meta text-faint tabular-nums">
                        {formatMoney(line.unitPrice, currency)} each
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-semibold tabular-nums">
                      {formatMoney(line.unitPrice * line.quantity, currency)}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(quantity) => updateQuantity(line.key, quantity)}
                      label={`Quantity for ${line.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.key)}
                      className="inline-flex items-center gap-1.5 text-label text-muted transition-colors hover:text-danger"
                    >
                      <Icon name="trash" size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 text-meta font-medium text-muted transition-colors hover:text-ink">
              <Icon name="chevronLeft" size={15} />
              Continue shopping
            </Link>
            <p className="text-label text-faint">
              Discount codes are not available in this demonstration storefront.
            </p>
          </div>
        </section>

        <aside aria-label="Order summary">
          <div className="border border-line p-6 lg:sticky lg:top-24">
            <h2 className="text-label font-semibold uppercase tracking-[0.12em]">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-meta">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium tabular-nums">{formatMoney(subtotalUSD, currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping estimate</dt>
                <dd className="font-medium tabular-nums">{shipping === 0 ? 'Free' : formatMoney(shipping, currency)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-[16px]">
                <dt className="font-semibold">Estimated total</dt>
                <dd className="font-semibold tabular-nums">{formatMoney(total, currency)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-label text-muted">
              {subtotalUSD >= FREE_SHIPPING_THRESHOLD
                ? 'Standard shipping is free on this order.'
                : `Add ${formatMoney(FREE_SHIPPING_THRESHOLD - subtotalUSD, currency)} more to qualify for free standard shipping.`}
            </p>

            <Button to="/checkout" size="lg" fullWidth className="mt-6">
              Proceed to Checkout
            </Button>
            <p className="mt-3 text-label text-faint">
              Taxes are not calculated in this demonstration environment. No payment is processed.
            </p>
          </div>
        </aside>
      </div>

      <RecommendedProducts products={related} title="You May Also Like" />
    </div>
  )
}

export default Cart
