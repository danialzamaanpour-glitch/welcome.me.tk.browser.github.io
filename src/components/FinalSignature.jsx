import { Link } from 'react-router-dom'
import { useReveal } from '../lib/useReveal'
import { scrollToId } from '../lib/scroll'

/**
 * CHAPTER 09 — THE FINAL SIGNATURE
 * A deliberate charcoal break from the white studio, then straight into the
 * footer. No long outro animation.
 */
export default function FinalSignature() {
  const ref = useReveal({ stagger: 0.08 })

  return (
    <section className="signature" ref={ref} aria-labelledby="signature-heading">
      <div className="container signature__inner">
        <p className="micro micro--on-dark reveal">09 — Signature</p>
        <h2 className="display display--signature reveal" id="signature-heading">
          Less, but better.
        </h2>
        <p className="signature__copy reveal">Discover the essentials that define your everyday.</p>
        <div className="signature__actions reveal">
          <Link className="btn btn--light" to="/collections">
            Explore the collection
          </Link>
          <button type="button" className="btn btn--outline-light" onClick={() => scrollToId('product')}>
            Back to the hoodie
          </button>
        </div>
      </div>
    </section>
  )
}
