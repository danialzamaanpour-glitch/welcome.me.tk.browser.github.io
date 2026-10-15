import { useState } from 'react'
import Icon from './Icon.jsx'
import { cn } from '../../lib/format.js'

/**
 * Disclosure list. `allowMultiple={false}` (default) behaves like a radio set:
 * one panel open at a time. Keyboard support comes free from real <button>s.
 */
export function Accordion({ items, defaultOpenId = null, className = '' }) {
  const [openId, setOpenId] = useState(defaultOpenId)

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const expanded = openId === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : item.id)}
                aria-expanded={expanded}
                aria-controls={`panel-${item.id}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-muted"
              >
                <span className="text-[15px] font-semibold">{item.title}</span>
                <Icon name={expanded ? 'minus' : 'plus'} size={16} className="shrink-0 text-muted" />
              </button>
            </h3>
            <div
              id={`panel-${item.id}`}
              hidden={!expanded}
              className="pb-5 text-body text-muted animate-fade-in"
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
