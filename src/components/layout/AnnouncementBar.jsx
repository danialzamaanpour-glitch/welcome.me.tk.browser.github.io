import { useRef, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { useClickOutside } from '../../lib/hooks.js'
import { useStore } from '../../lib/store.jsx'
import { CURRENCIES } from '../../lib/currency.js'
import { cn } from '../../lib/format.js'

/**
 * Slim announcement bar. It slides out of view once the page is scrolled
 * (header morph) — while collapsed the currency control is removed from the
 * tab order and hidden from assistive tech rather than being left focusable.
 */
export function AnnouncementBar({ collapsed }) {
  const { currency, setCurrency, pushToast } = useStore()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useClickOutside(menuRef, open, () => setOpen(false))

  const choose = (code) => {
    setCurrency(code)
    setOpen(false)
    pushToast({ title: `Currency set to ${code}`, description: 'Prices are shown as an illustrative display conversion.' })
  }

  return (
    <div
      aria-hidden={collapsed || undefined}
      className={cn(
        'overflow-hidden border-b border-line bg-surface transition-[max-height,opacity] duration-250',
        collapsed ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
      )}
    >
      <div className="shell flex h-10 items-center justify-between gap-4">
        <span className="hidden w-24 sm:block" aria-hidden="true" />
        <p className="flex items-center gap-2 text-label font-medium tracking-[0.02em] text-ink">
          <Icon name="truck" size={15} className="shrink-0 text-muted" />
          Free Shipping on orders over $99
        </p>
        <div className="relative flex w-24 justify-end" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-1 text-label font-medium text-ink transition-colors hover:text-muted"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Currency: ${currency.label}. Change currency`}
            tabIndex={collapsed ? -1 : 0}
          >
            {currency.label}
            <Icon name="chevronDown" size={13} className={cn('transition-transform duration-200', open && 'rotate-180')} />
          </button>
          {open ? (
            <ul
              role="listbox"
              aria-label="Display currency"
              className="absolute right-0 top-8 z-50 w-40 border border-line bg-paper py-1 shadow-[0_16px_36px_-22px_rgba(0,0,0,0.5)] animate-fade-in"
            >
              {CURRENCIES.map((option) => (
                <li key={option.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.code === currency.code}
                    onClick={() => choose(option.code)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-meta transition-colors hover:bg-hover',
                      option.code === currency.code ? 'font-semibold text-ink' : 'text-muted'
                    )}
                  >
                    {option.label}
                    {option.code === currency.code ? <Icon name="check" size={13} /> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar
