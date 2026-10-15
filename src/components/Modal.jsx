import { useEffect, useRef } from 'react'
import { Close } from './icons'

/**
 * Accessible dialog: Escape to dismiss, focus moved into the panel and restored
 * on close, background scroll locked while open, and a real tab trap.
 */
export default function Modal({ open, onClose, title, children, footer, className = '' }) {
  const panelRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const t = setTimeout(() => {
      panelRef.current?.querySelector('button, a, input')?.focus()
    }, 40)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      lastFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={`modal ${className}`}>
      <button type="button" className="overlay__scrim" aria-label="Close dialog" onClick={onClose} />
      <div className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={panelRef}>
        <div className="modal__head">
          <h2 className="modal__title" id="modal-title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Close />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  )
}
