import { Lock, Return, Truck } from './icons'

/**
 * Trust badges.
 *
 * The third badge is worded for what this build actually does: there is no
 * payment provider configured here, so it promises a demonstration checkout
 * instead of claiming a live secure payment.
 */
const BADGES = [
  { icon: Truck, title: 'Free shipping', copy: 'On orders over $99' },
  { icon: Return, title: 'Easy returns', copy: '30-day return policy' },
  { icon: Lock, title: 'Secure checkout', copy: 'Demonstration only — no card details collected' },
]

export default function TrustBadges({ className = '' }) {
  return (
    <ul className={`trust ${className}`}>
      {BADGES.map(({ icon: Icon, title, copy }) => (
        <li className="trust__item" key={title}>
          <span className="trust__icon" aria-hidden="true">
            <Icon width={20} height={20} />
          </span>
          <span className="trust__text">
            <span className="trust__title">{title}</span>
            <span className="trust__copy">{copy}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
