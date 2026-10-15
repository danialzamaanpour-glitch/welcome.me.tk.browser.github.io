import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

/** Breadcrumb trail. The final crumb is the current page and is not a link. */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-label text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !last ? (
                <Link to={item.to} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-ink' : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? <Icon name="chevronRight" size={12} className="text-line" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
