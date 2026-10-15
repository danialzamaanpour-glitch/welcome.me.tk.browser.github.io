import { Check, Close } from './icons'
import { useShop } from '../store/ShopContext'

/** Polite live region for cart, wishlist and error feedback. */
export default function Toaster() {
  const { toasts, dismissToast } = useShop()

  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div className={`toast toast--${toast.tone}`} key={toast.id}>
          <span className="toast__icon" aria-hidden="true">
            {toast.tone === 'error' ? <Close width={14} height={14} /> : <Check width={14} height={14} />}
          </span>
          <p className="toast__text">{toast.message}</p>
          <button
            type="button"
            className="toast__close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <Close width={13} height={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
