import { Link } from 'react-router-dom'
import Drawer from '../ui/Drawer.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import QuantityStepper from '../ui/QuantityStepper.jsx'
import Media from '../ui/Media.jsx'
import { useStore } from '../../lib/store.jsx'
import { formatMoney } from '../../lib/format.js'

const FREE_SHIPPING_THRESHOLD = 99

/** Slide-out bag: every cart mutation happens here without leaving the page. */
export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, subtotalUSD, currency } = useStore()

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalUSD)

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title="Shopping Bag"
      width="w-full max-w-[440px]"
      footer={
        cart.length ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-body">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold tabular-nums">{formatMoney(subtotalUSD, currency)}</span>
            </div>
            <p className="text-label text-muted">
              {remaining > 0
                ? `Add ${formatMoney(remaining, currency)} more for free shipping.`
                : 'Free standard shipping applied.'}
            </p>
            <div className="grid gap-2">
              <Button to="/checkout" size="lg" fullWidth onClick={() => setCartOpen(false)}>
                Proceed to Checkout
              </Button>
              <Button to="/cart" variant="outline" size="lg" fullWidth onClick={() => setCartOpen(false)}>
                View Bag
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-label text-muted transition-colors hover:text-ink"
            >
              Continue shopping
            </button>
          </div>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <Icon name="bag" size={30} className="text-line" />
          <div>
            <p className="text-[15px] font-semibold">Your bag is empty</p>
            <p className="mt-1 text-meta text-muted">Add a piece from the collection to get started.</p>
          </div>
          <Button to="/shop" onClick={() => setCartOpen(false)}>
            Shop the collection
          </Button>
        </div>
      ) : (
        <ul className="space-y-5">
          {cart.map((line) => (
            <li key={line.key} className="flex gap-4 border-b border-line pb-5 last:border-0 last:pb-0">
              <Link to={`/product/${line.slug}`} onClick={() => setCartOpen(false)} className="w-[84px] shrink-0">
                <Media image={line.image} ratio="3 / 4" sizes="thumb" className="bg-surface" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/product/${line.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="text-[14px] font-semibold leading-snug transition-colors hover:text-muted"
                  >
                    {line.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.key)}
                    className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-faint transition-colors hover:bg-hover hover:text-danger"
                    aria-label={`Remove ${line.name} from bag`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
                <p className="mt-1 text-label text-muted">
                  {line.color} · Size {line.size}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <QuantityStepper
                    size="sm"
                    value={line.quantity}
                    onChange={(quantity) => updateQuantity(line.key, quantity)}
                    label={`Quantity for ${line.name}`}
                  />
                  <span className="text-meta font-semibold tabular-nums">
                    {formatMoney(line.unitPrice * line.quantity, currency)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}

export default CartDrawer
