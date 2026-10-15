import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import Button from '../components/ui/Button.jsx'
import Accordion from '../components/ui/Accordion.jsx'
import NotFound from './NotFound.jsx'
import { FAQS, POLICY, SIZE_CHART } from '../data/content.js'
import { usePageMeta } from '../lib/seo.js'

const PAGES = {
  about: {
    title: 'Our Story',
    intro:
      'VELORA started with one problem: heavyweight cotton basics were either expensive or disposable. We set out to make the first category unnecessary.',
    sections: [
      {
        heading: 'What we make',
        paragraphs: [
          'Hoodies, sweatshirts and tees — nothing else. Every piece starts at 400 GSM or above, is pre-shrunk before cutting, and is garment-dyed so the colour sits in the fibre rather than on top of it.',
          'We build within four tones: charcoal, off-white, slate and cream. That constraint is deliberate. It means every piece works with every other piece, and it means we only ever produce colours we would wear for years.'
        ]
      },
      {
        heading: 'How we make it',
        paragraphs: [
          'Pieces are produced in small runs with a single mill, which is why the fleece from this season feels identical to the one before it. Small runs cost more per unit and waste far less.',
          'We publish construction details — composition, weight, care — on every product page. Where a specification is still sample data pending supplier confirmation, the page says so.'
        ]
      },
      {
        heading: 'This storefront',
        paragraphs: [
          'This site is a demonstration environment. Products, prices, reviews and orders are sample data, and checkout does not process payments. It exists to show the shopping experience end to end before a production backend is attached.'
        ]
      }
    ]
  },
  contact: {
    title: 'Contact Us',
    intro: 'Customer care answers within one business day. This demonstration storefront has no live mailbox attached.',
    sections: [
      {
        heading: 'Customer care',
        paragraphs: [
          'Email: care@velora.example (demonstration address — not monitored).',
          'Hours: Monday to Friday, 9:00–17:00 PT.',
          'Returns and exchanges are handled through the original order reference.'
        ]
      },
      {
        heading: 'Press and partnerships',
        paragraphs: ['press@velora.example (demonstration address — not monitored).']
      },
      {
        heading: 'Studio',
        paragraphs: ['VELORA Studio, 14 Foundry Row, Los Angeles, CA — visits by appointment only.']
      }
    ],
    footnote:
      'Because this is a demo storefront with no order backend, order-specific questions cannot be resolved here.'
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'What this storefront stores, and where it stays.',
    sections: [
      {
        heading: 'What we store',
        paragraphs: [
          'Your bag, wishlist, display currency and demo account name/email are stored in your browser’s local storage so the storefront remembers them between visits. Nothing is sent to a server.',
          'Passwords are never stored. The password field in the demo account form is validated for length and match, then discarded — it is not written to storage or transmitted.'
        ]
      },
      {
        heading: 'What we do not collect',
        paragraphs: [
          'No payment details are collected, because this demonstration checkout does not process payments.',
          'No analytics, advertising or third-party tracking scripts run on this storefront.'
        ]
      },
      {
        heading: 'Cookies and clearing data',
        paragraphs: [
          'This storefront does not set tracking cookies. Clearing your browser storage for this site removes the saved bag, wishlist, currency and demo account.'
        ]
      }
    ],
    footnote:
      'A production deployment would publish a full privacy policy covering order processing, payments and data retention.'
  },
  terms: {
    title: 'Terms of Service',
    intro: 'The terms that would govern purchases from VELORA.',
    sections: [
      {
        heading: 'Demonstration environment',
        paragraphs: [
          'This storefront is provided for demonstration purposes. Products, prices, availability, reviews and ratings are sample data and are not offers for sale.',
          'Checkout does not process payments and does not create a binding order.'
        ]
      },
      {
        heading: 'Pricing and availability',
        paragraphs: [
          'Prices are shown in your selected display currency. Conversions from the USD base price are illustrative and are not live exchange rates.',
          'A production store would validate price, stock and order totals server-side before accepting an order.'
        ]
      },
      {
        heading: 'Returns',
        paragraphs: [`${POLICY.returnEligibility} Return period: ${POLICY.returnPeriod}.`]
      }
    ],
    footnote: 'No warranty or liability terms apply to this demonstration storefront.'
  }
}

function Prose({ page }) {
  return (
    <div className="max-w-2xl space-y-10">
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{section.heading}</h2>
          <div className="mt-3 space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
      {page.footnote ? (
        <p className="border border-line bg-surface p-5 text-meta text-muted">{page.footnote}</p>
      ) : null}
    </div>
  )
}

function SizeGuide() {
  return (
    <div className="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">VELORA garment measurements in centimetres and inches</caption>
          <thead>
            <tr className="border-b border-ink">
              {SIZE_CHART.columns.map((column) => (
                <th key={column} scope="col" className="py-3 pr-4 text-label font-semibold uppercase tracking-[0.06em]">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line">
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={index === 0 ? 'py-3 pr-4 text-meta font-semibold' : 'py-3 pr-4 text-meta text-muted tabular-nums'}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-[19px] font-semibold">How to measure</h2>
      <ul className="mt-3 space-y-3">
        {SIZE_CHART.howToMeasure.map((tip) => (
          <li key={tip} className="text-body text-muted">
            {tip}
          </li>
        ))}
      </ul>

      <p className="mt-8 border border-line bg-surface p-5 text-meta text-muted">{SIZE_CHART.disclaimer}</p>
    </div>
  )
}

function ShippingReturns() {
  return (
    <div className="max-w-3xl space-y-10">
      <section>
        <h2 className="text-[19px] font-semibold">Shipping</h2>
        <p className="mt-3 text-body text-muted">{POLICY.shippingSummary}</p>
        <table className="mt-6 w-full border-collapse text-left">
          <caption className="sr-only">Shipping services, delivery estimates and costs</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="py-2.5 pr-4 text-label font-semibold uppercase tracking-[0.06em]">Service</th>
              <th scope="col" className="py-2.5 pr-4 text-label font-semibold uppercase tracking-[0.06em]">Delivery estimate</th>
              <th scope="col" className="py-2.5 text-label font-semibold uppercase tracking-[0.06em]">Cost</th>
            </tr>
          </thead>
          <tbody>
            {POLICY.shippingOptions.map((option) => (
              <tr key={option.name} className="border-b border-line">
                <td className="py-3 pr-4 text-meta font-medium">{option.name}</td>
                <td className="py-3 pr-4 text-meta text-muted">{option.eta}</td>
                <td className="py-3 text-meta text-muted">{option.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-[19px] font-semibold">Returns</h2>
        <p className="mt-3 text-body text-muted">{POLICY.returnEligibility}</p>
        <p className="mt-3 text-body text-muted">
          <span className="font-semibold text-ink">Return period:</span> {POLICY.returnPeriod}.
        </p>
        <p className="mt-6 border border-line bg-surface p-5 text-meta text-muted">{POLICY.returnsNote}</p>
      </section>
    </div>
  )
}

/** Shared static page handler for policy, service and editorial routes. */
export function InfoPage() {
  const { slug } = useParams()
  const page = PAGES[slug]
  const isSizeGuide = slug === 'size-guide'
  const isShipping = slug === 'shipping-returns'
  const isFaq = slug === 'faq'

  const titles = {
    'size-guide': 'Size Guide',
    'shipping-returns': 'Shipping & Returns',
    faq: 'Frequently Asked Questions'
  }

  const title = page?.title || titles[slug]
  usePageMeta(title || 'Page', page?.intro)

  if (!page && !isSizeGuide && !isShipping && !isFaq) return <NotFound />

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />

      <header className="mt-5 max-w-2xl">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">{title}</h1>
        {page?.intro ? <p className="mt-3 text-body text-muted">{page.intro}</p> : null}
        {isShipping ? (
          <p className="mt-3 text-body text-muted">
            Complimentary shipping over $99, express options, and a 30-day return window.
          </p>
        ) : null}
        {isSizeGuide ? (
          <p className="mt-3 text-body text-muted">
            Garment measurements taken flat, in centimetres and inches, with guidance on how to measure yourself.
          </p>
        ) : null}
        {isFaq ? <p className="mt-3 text-body text-muted">The questions we are asked most often.</p> : null}
      </header>

      <div className="mt-10">
        {page ? <Prose page={page} /> : null}
        {isSizeGuide ? <SizeGuide /> : null}
        {isShipping ? <ShippingReturns /> : null}
        {isFaq ? (
          <div className="max-w-3xl">
            <Accordion defaultOpenId="faq-0" items={FAQS.map((faq, index) => ({ id: `faq-${index}`, title: faq.q, content: faq.a }))} />
          </div>
        ) : null}
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Button to="/shop" size="lg">
          Shop the collection
        </Button>
        <Button to="/pages/contact" variant="outline" size="lg">
          Contact us
        </Button>
      </div>
    </div>
  )
}

export default InfoPage
