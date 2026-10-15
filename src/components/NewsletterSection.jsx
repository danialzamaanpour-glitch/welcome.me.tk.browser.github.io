import { useState } from 'react'
import { Check } from './icons'
import { useReveal } from '../lib/useReveal'

const STORAGE_KEY = 'velora.newsletter.v1'

/**
 * Newsletter band. The form validates for real and remembers the signup locally,
 * and it states plainly that no mail service is wired up in this repository —
 * it never claims an email was sent.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const ref = useReveal({ stagger: 0.06 })

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.trim(), at: Date.now() }))
    } catch {
      /* storage unavailable — the confirmation still stands for this session */
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <section className="newsletter" ref={ref} aria-labelledby="newsletter-heading">
      <div className="container newsletter__inner">
        <div className="newsletter__text">
          <p className="micro micro--muted reveal">The list</p>
          <h2 className="newsletter__title reveal" id="newsletter-heading">
            Early access to every drop.
          </h2>
          <p className="newsletter__copy reveal">
            One message when a piece lands. Nothing else. (Demonstration form: no mail service is
            connected in this build, so nothing is sent.)
          </p>
        </div>

        <form className="newsletter__form reveal" onSubmit={submit} noValidate>
          <label className="field field--inline">
            <span className="visually-hidden">Email address</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Join the list
          </button>
          {error && (
            <p className="field__error" id="newsletter-error" role="alert">
              {error}
            </p>
          )}
          {status === 'done' && (
            <p className="newsletter__done" role="status">
              <Check width={15} height={15} /> Saved in this browser — no email has been sent.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
