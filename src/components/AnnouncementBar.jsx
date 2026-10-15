import { useShop } from '../store/ShopContext'
import { CURRENCIES } from '../lib/format'

export default function AnnouncementBar() {
  const { currency, setCurrency } = useShop()

  return (
    <div className="announcement">
      <div className="announcement__inner container">
        <span className="micro announcement__left">New collection / 01</span>
        <p className="micro announcement__center">Free shipping on orders over $99</p>
        <label className="announcement__currency">
          <span className="visually-hidden">Display currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="select select--bare">
            {Object.entries(CURRENCIES).map(([code, c]) => (
              <option key={code} value={code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
