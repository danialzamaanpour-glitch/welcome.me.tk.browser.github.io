import { useState } from 'react'
import Icon from '../ui/Icon.jsx'
import { useStore } from '../../lib/store.jsx'
import { cn } from '../../lib/format.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter signup. There is no mailing-list backend in this environment, so
 * the form validates properly, confirms in the UI, and states plainly that the
 * address is not stored anywhere.
 */
export function NewsletterForm({ variant = 'default' }) {
  const { pushToast } = useStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setError('Enter a valid email address, for example name@example.com.')
      return
    }
    setError('')
    setDone(true)
    pushToast({
      title: 'Signup checked — nothing stored',
      description: 'This demo storefront has no mailing-list backend, so no address was saved.'
    })
  }

  if (done) {
    return (
      <p className="flex items-start gap-2 text-meta text-muted">
        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
        Thanks — {email.trim()} is valid. This demo store does not store newsletter signups.
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={cn('w-full', variant === 'hero' && 'max-w-md')}>
      <label htmlFor={`newsletter-${variant}`} className="mb-2 block text-label font-medium uppercase tracking-[0.05em] text-muted">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={`newsletter-${variant}`}
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (error) setError('')
          }}
          placeholder="name@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `newsletter-error-${variant}` : undefined}
          className={cn('field flex-1', error && 'border-danger')}
        />
        <button
          type="submit"
          className="inline-flex h-[46px] shrink-0 items-center justify-center gap-2 bg-cta px-5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#1c1c1c]"
        >
          Subscribe
        </button>
      </div>
      {error ? (
        <p id={`newsletter-error-${variant}`} className="mt-2 text-label text-danger">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-label text-faint">
          Demo store — signups are validated but not stored on a server.
        </p>
      )}
    </form>
  )
}

export default NewsletterForm
