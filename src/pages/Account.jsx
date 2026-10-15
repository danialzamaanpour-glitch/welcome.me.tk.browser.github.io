import { Link } from 'react-router-dom'
import { formatMoney, formatDate } from '../lib/format'
import { useShop } from '../store/ShopContext'

/**
 * Guest account page.
 *
 * There is no authentication, user table or server in this repository — the page
 * says so plainly rather than showing a sign-in form that cannot work.
 */
export default function Account() {
  const { orders, wishlist } = useShop()

  return (
    <div className="page account">
      <header className="container page-head">
        <p className="micro micro--muted">Account</p>
        <h1 className="page-title">Guest session</h1>
        <p className="section-copy">
          No sign-in is configured in this build: there is no user database, so no account form is
          offered here. Your bag, wishlist and orders are kept in this browser only.
        </p>
      </header>

      <div className="container account__grid">
        <section className="account__panel" aria-label="Stored orders">
          <h2 className="account__heading">Stored orders</h2>
          {orders.length === 0 ? (
            <p className="account__empty">
              No orders yet. Anything you place in the demonstration checkout will appear here.
            </p>
          ) : (
            <ul className="account__orders">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link className="account__order" to={`/order/${order.id}`}>
                    <span className="account__order-id">{order.id}</span>
                    <span className="micro micro--muted">{formatDate(order.createdAt)}</span>
                    <span className="account__order-items">
                      {order.items.reduce((n, i) => n + i.qty, 0)} item
                      {order.items.reduce((n, i) => n + i.qty, 0) === 1 ? '' : 's'}
                    </span>
                    <span className="account__order-total">
                      {formatMoney(order.total, order.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="account__panel" aria-label="Wishlist">
          <h2 className="account__heading">Wishlist</h2>
          <p className="account__empty">
            {wishlist.length === 0
              ? 'Nothing saved yet.'
              : `${wishlist.length} piece${wishlist.length === 1 ? '' : 's'} saved in this browser.`}
          </p>
          <Link className="btn btn--ghost" to="/wishlist">
            Open wishlist
          </Link>
        </section>
      </div>
    </div>
  )
}
