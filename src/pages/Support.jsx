import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { prefersReducedScroll } from '../lib/scroll'
import { useReveal } from '../lib/useReveal'

const SECTIONS = [
  {
    id: 'shipping',
    title: 'Shipping',
    body: [
      'Free standard shipping on orders over $99, otherwise $8. Express shipping is $18.',
      'Delivery estimates shown at checkout are illustrative — this build has no carrier integration and no warehouse, so nothing is actually dispatched.',
    ],
  },
  {
    id: 'returns',
    title: 'Returns',
    body: [
      'Unworn pieces can be returned within 30 days in their original packaging.',
      'Because this is a demonstration storefront, there is no returns portal and no address to send anything to. The policy is shown to complete the reference layout.',
    ],
  },
  {
    id: 'size',
    title: 'Size & fit',
    body: [
      'The hoodie is cut oversized with dropped shoulders. The size guide on any product page lists approximate garment measurements and states that they are derived from the rendered silhouette rather than a supplier sheet.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    body: [
      'This repository contains no support inbox, live chat or contact database, so no contact form is provided — one that could not deliver a message would be worse than none.',
      'Questions about this build belong with whoever maintains the repository.',
    ],
  },
]

export default function Support() {
  const { hash } = useLocation()
  const ref = useReveal({ stagger: 0.05 })

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (!el) return
    el.scrollIntoView({ behavior: prefersReducedScroll() ? 'auto' : 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="page support" ref={ref}>
      <header className="container page-head">
        <p className="micro micro--muted reveal">Help</p>
        <h1 className="page-title reveal">Shipping, returns, sizing and contact.</h1>
        <p className="section-copy reveal">
          Written for a demonstration storefront, so each section says exactly what this build does
          and does not do.
        </p>
      </header>

      <div className="container support__grid">
        {SECTIONS.map((section) => (
          <section className="support__block reveal" id={section.id} key={section.id}>
            <h2 className="section-title section-title--sm">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p className="section-copy" key={paragraph.slice(0, 20)}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="container support__actions">
        <Link className="btn btn--primary" to="/shop">
          Shop all pieces
        </Link>
        <Link className="btn btn--ghost" to="/">
          Back to the presentation
        </Link>
      </div>
    </div>
  )
}
