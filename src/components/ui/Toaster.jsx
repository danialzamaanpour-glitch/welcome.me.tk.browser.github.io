import { useStore } from '../../lib/store.jsx'
import Icon from './Icon.jsx'
import { cn } from '../../lib/format.js'

/**
 * Toast stack. The container is an aria-live region so cart and wishlist
 * confirmations are announced to screen readers as well as shown visually.
 */
export function Toaster() {
  const { toasts, dismissToast, liveMessage } = useStore()

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 border bg-paper px-4 py-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] animate-toast-in',
              toast.tone === 'error' ? 'border-danger/40' : 'border-line'
            )}
          >
            <Icon
              name={toast.tone === 'error' ? 'alert' : 'check'}
              size={16}
              className={cn('mt-0.5 shrink-0', toast.tone === 'error' ? 'text-danger' : 'text-success')}
            />
            <div className="min-w-0 flex-1">
              <p className="text-meta font-semibold">{toast.title}</p>
              {toast.description ? <p className="mt-0.5 text-label text-muted">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-faint transition-colors hover:bg-hover hover:text-ink"
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
      {/* Off-screen announcements for cart/wishlist changes. */}
      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>
    </>
  )
}

export default Toaster
