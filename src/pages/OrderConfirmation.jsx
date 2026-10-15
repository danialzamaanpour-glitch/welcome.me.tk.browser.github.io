import { Link, useParams } from 'react-router-dom'
import { Check } from '../components/icons'
import { formatMoney, formatDate } from '../lib/format'
import { useShop } from '../store/ShopContext'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders } = useShop()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page container empty-state">
        <p className="empty-state__title">We can’t find that order reference.</p>
        <p className="empty-state__copy">
          Orders are stored in the browser that placed them, so a different device or a cleared
          storage will not have it. This repository has no order database.
        </p>
        <Link className="btn btn--primary" to="/account">
          See stored orders
        </Link>
      </div>
    )
  }

  return (
    <div className="page order">
      <div className="container order__inner">
        <span className="order__mark" aria-hidden="true">
          <Check width={20} height={20} />
        </span>
        <p className="micro micro--muted">Order recorded</p>
        <h1 className="page-title">Thank you, {order.customer.name.split(' ')[0] || 'friend'}.</h1>
        <p className="section-copy">
          Order <strong>{order.id}</strong> was saved in this browser on {formatDate(order.createdAt)}.
          Nothing was charged and nothing will ship: this is a demonstration checkout with no payment
          provider configured.
        </p>

        <div className="order__grid">
          <section className="order__panel" aria-label="Items">
            <h2 className="order__heading">Items</h2>
            <ul className="order__items">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.colorId}-${item.size}`}>
                  <span>
                    {item.name} — {item.colorName} · {item.size} · ×{item.qty}
                  </span>
                  <span>{formatMoney(item.unitPrice * item.qty, order.currency)}</span>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatMoney(order.subtotal, order.currency)}</dd>
              </div>
              <div>
                <dt>Shipping ({order.shippingMethod})</dt>
                <dd>{order.shipping === 0 ? 'Free' : formatMoney(order.shipping, order.currency)}</dd>
              </div>
              <div className="totals__grand">
                <dt>Total</dt>
                <dd>{formatMoney(order.total, order.currency)}</dd>
              </div>
            </dl>
          </section>

          <section className="order__panel" aria-label="Delivery details">
            <h2 className="order__heading">Delivery details</h2>
            <address className="order__address">
              {order.customer.name}
              <br />
              {order.customer.address}
              <br />
              {order.customer.city} {order.customer.postal}
              <br />
              {order.customer.country}
              <br />
              {order.customer.email}
            </address>
          </section>
        </div>

        <div className="order__actions">
          <Link className="btn btn--primary" to="/shop">
            Continue shopping
          </Link>
          <Link className="btn btn--ghost" to="/account">
            All stored orders
          </Link>
        </div>
      </div>
    </div>
  )
}
