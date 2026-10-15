import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { useStore } from '../lib/store.jsx'
import { usePageMeta } from '../lib/seo.js'
import { cn } from '../lib/format.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ACCOUNT_KEY = 'velora.account.v1'

/**
 * Account area.
 *
 * There is no authentication backend in this environment, so sign-in is a
 * clearly labelled local demo: the email you enter is remembered on this
 * device, and the password field is validated but never stored or transmitted.
 */
export function Account() {
  const { wishlistCount, pushToast } = useStore()
  const [mode, setMode] = useState('signin')
  const [profile, setProfile] = useState(null)
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  usePageMeta('Account', 'Sign in to your VELORA account, view your wishlist and orders.')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCOUNT_KEY)
      if (raw) setProfile(JSON.parse(raw))
    } catch {
      /* ignore unreadable storage */
    }
  }, [])

  const set = (field) => (event) => {
    setFields((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const persist = (nextProfile) => {
    setProfile(nextProfile)
    try {
      window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextProfile))
    } catch {
      /* storage blocked — session-only account */
    }
  }

  const validate = () => {
    const next = {}
    if (!EMAIL.test(fields.email.trim())) next.email = 'Enter a valid email address.'
    if (mode === 'signup') {
      if (!fields.name.trim()) next.name = 'Enter your name.'
      if (fields.password.length < 8) next.password = 'Use at least 8 characters.'
      if (fields.password !== fields.confirm) next.confirm = 'Passwords do not match.'
    }
    if (mode === 'signin' && fields.password.length < 1) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    if (mode === 'reset') {
      pushToast({
        title: 'Reset link not sent',
        description: 'This demo has no email service, so no reset message was dispatched.'
      })
      setMode('signin')
      return
    }
    persist({
      name: fields.name.trim() || fields.email.split('@')[0],
      email: fields.email.trim()
    })
    setFields({ name: '', email: '', password: '', confirm: '' })
    pushToast({ title: mode === 'signup' ? 'Demo account created' : 'Signed in', description: 'Stored on this device only.' })
  }

  const signOut = () => {
    setProfile(null)
    try {
      window.localStorage.removeItem(ACCOUNT_KEY)
    } catch {
      /* nothing to clear */
    }
    pushToast({ title: 'Signed out' })
  }

  const input = (name, label, type = 'text', autoComplete) => (
    <div>
      <label htmlFor={`account-${name}`} className="field-label">
        {label}
      </label>
      <input
        id={`account-${name}`}
        name={name}
        type={type}
        value={fields[name]}
        onChange={set(name)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `account-${name}-error` : undefined}
        className={cn('field', errors[name] && 'border-danger')}
      />
      {errors[name] ? (
        <p id={`account-${name}-error`} className="mt-1.5 text-label text-danger">
          {errors[name]}
        </p>
      ) : null}
    </div>
  )

  if (profile) {
    return (
      <div className="shell py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-label text-muted">
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span className="px-2 text-line">/</span>
          <span className="text-ink">Account</span>
        </nav>

        <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">
          Hello, {profile.name}
        </h1>
        <p className="mt-2 text-meta text-muted">
          Signed in on this device as {profile.email}. This demo account exists only in your browser.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
          <section aria-labelledby="details-heading" className="border border-line p-6">
            <h2 id="details-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
              Account details
            </h2>
            <dl className="mt-5 space-y-3 text-meta">
              <div>
                <dt className="text-label uppercase tracking-[0.08em] text-faint">Name</dt>
                <dd className="mt-0.5 font-medium">{profile.name}</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.08em] text-faint">Email</dt>
                <dd className="mt-0.5 font-medium">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.08em] text-faint">Password</dt>
                <dd className="mt-0.5 text-muted">Never stored — not kept on this device or sent anywhere.</dd>
              </div>
            </dl>
            <Button variant="outline" size="lg" fullWidth className="mt-6" onClick={signOut}>
              Sign out
            </Button>
          </section>

          <div className="space-y-8">
            <section aria-labelledby="orders-heading" className="border border-line p-6">
              <h2 id="orders-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
                Order history
              </h2>
              <p className="mt-5 border border-line bg-surface p-5 text-meta text-muted">
                No orders are stored here. This storefront has no order backend, and the demo checkout deliberately
                transmits nothing — so there is no order history to display.{' '}
                <Link to="/shop" className="link-underline text-ink">
                  Browse the collection
                </Link>{' '}
                and checkout will show a demo confirmation instead.
              </p>
            </section>

            <section aria-labelledby="wishlist-heading" className="border border-line p-6">
              <h2 id="wishlist-heading" className="text-label font-semibold uppercase tracking-[0.12em]">
                Wishlist
              </h2>
              <p className="mt-4 text-meta text-muted">
                {wishlistCount === 0
                  ? 'You have not saved anything yet. Use the heart on any product to save it.'
                  : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved on this device.`}
              </p>
              <Button to="/wishlist" variant="outline" size="lg" className="mt-5 gap-2">
                <Icon name="heart" size={16} />
                View wishlist
              </Button>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shell py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="text-label text-muted">
        <Link to="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <span className="px-2 text-line">/</span>
        <span className="text-ink">Account</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="max-w-md">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">
            {mode === 'signup' ? 'Create an account' : mode === 'reset' ? 'Reset your password' : 'Sign in'}
          </h1>
          <p className="mt-3 text-meta text-muted">
            {mode === 'reset'
              ? 'Enter the email on your account and we would send a reset link — this demo has no email service, so nothing is dispatched.'
              : 'Save your wishlist and keep your details in one place.'}
          </p>

          <div className="mt-6 flex items-center gap-3 border border-line bg-surface p-4 text-label text-muted">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            <p>
              Demonstration sign-in. The account is kept in this browser only, and the password field is validated but
              never stored or transmitted.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {mode === 'signup' ? input('name', 'Full name', 'text', 'name') : null}
            {input('email', 'Email address', 'email', 'email')}
            {mode !== 'reset' ? input('password', 'Password', 'password', mode === 'signup' ? 'new-password' : 'current-password') : null}
            {mode === 'signup' ? input('confirm', 'Confirm password', 'password', 'new-password') : null}

            <Button type="submit" size="lg" fullWidth>
              {mode === 'signup' ? 'Create demo account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta">
            {mode !== 'signin' ? (
              <button type="button" onClick={() => setMode('signin')} className="link-underline text-muted">
                Back to sign in
              </button>
            ) : null}
            {mode !== 'signup' ? (
              <button type="button" onClick={() => setMode('signup')} className="link-underline text-muted">
                Create an account
              </button>
            ) : null}
            {mode !== 'reset' ? (
              <button type="button" onClick={() => setMode('reset')} className="link-underline text-muted">
                Forgot password?
              </button>
            ) : null}
          </div>
        </div>

        <aside className="border border-line bg-surface p-8">
          <h2 className="text-label font-semibold uppercase tracking-[0.12em]">Why create an account?</h2>
          <ul className="mt-5 space-y-4 text-meta text-muted">
            {[
              'Keep a wishlist that survives a page refresh on this device.',
              'Reach a faster checkout with your details remembered.',
              'See order history as soon as a store backend is connected.'
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ink" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default Account
