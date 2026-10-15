import { useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'
import { useEscapeKey, useFocusTrap } from '../../lib/hooks.js'
import { cn } from '../../lib/format.js'

/**
 * Slide-over panel used for the cart, the mobile navigation and the filter
 * drawer. Traps focus, closes on Escape and on backdrop click.
 */
export function Drawer({ open, onClose, side = 'right', title, children, footer, width = 'w-full max-w-[420px]' }) {
  const panelRef = useRef(null)
  useFocusTrap(panelRef, open)
  useEscapeKey(open, onClose)

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'absolute top-0 flex h-full flex-col bg-paper shadow-[0_0_60px_-20px_rgba(0,0,0,0.35)]',
          width,
          side === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left'
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-label font-semibold uppercase tracking-[0.14em]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-hover hover:text-ink"
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-line px-5 py-5">{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}

export default Drawer
