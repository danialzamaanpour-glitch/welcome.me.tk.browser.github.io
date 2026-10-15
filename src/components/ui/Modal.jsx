import { useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'
import { useEscapeKey, useFocusTrap } from '../../lib/hooks.js'
import { cn } from '../../lib/format.js'

/**
 * Accessible dialog: focus is trapped while open, Escape closes it, the
 * backdrop is clickable, and the panel scrolls internally on short viewports.
 */
export function Modal({ open, onClose, title, description, children, size = 'md' }) {
  const panelRef = useRef(null)
  useFocusTrap(panelRef, open)
  useEscapeKey(open, onClose)

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[92vh] w-full overflow-y-auto bg-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)] animate-fade-up sm:rounded-sm',
          widths[size]
        )}
      >
        <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-meta text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-hover hover:text-ink"
            aria-label="Close dialog"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
