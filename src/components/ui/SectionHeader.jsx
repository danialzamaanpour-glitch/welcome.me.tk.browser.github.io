import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { cn } from '../../lib/format.js'

/** Section heading with an optional "View All →" affordance on the right. */
export function SectionHeader({ title, subtitle, viewAllTo, viewAllLabel = 'View All', className = '' }) {
  return (
    <div className={cn('flex items-end justify-between gap-6 border-b border-line pb-4', className)}>
      <div>
        <h2 className="text-[20px] font-semibold sm:text-section">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-xl text-meta text-muted">{subtitle}</p> : null}
      </div>
      {viewAllTo ? (
        <Link
          to={viewAllTo}
          className="group inline-flex shrink-0 items-center gap-1.5 text-meta font-medium text-muted transition-colors hover:text-ink"
        >
          {viewAllLabel}
          <Icon
            name="arrowRight"
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  )
}

export default SectionHeader
