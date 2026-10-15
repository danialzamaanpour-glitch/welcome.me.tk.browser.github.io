import { useRef, useState } from 'react'
import Media from '../ui/Media.jsx'
import Accordion from '../ui/Accordion.jsx'
import Icon from '../ui/Icon.jsx'
import { DETAIL_LIBRARY, POLICY } from '../../data/content.js'
import { cn } from '../../lib/format.js'

const FEATURE_ICONS = ['expand', 'layers', 'hood', 'cuff', 'sparkle']

function SpecList({ items }) {
  return (
    <dl className="divide-y divide-line">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-6">
          <dt className="text-label font-semibold uppercase tracking-[0.08em] text-ink">{item.label}</dt>
          <dd className="text-meta text-muted">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Product information: tabbed on desktop (proper tablist with arrow-key
 * navigation), accordion on mobile, beside a macro fabric image on both.
 */
export function ProductTabs({ product, detailImage }) {
  const library = DETAIL_LIBRARY[product.category] || DETAIL_LIBRARY.Hoodies
  const [active, setActive] = useState('details')
  const tabRefs = useRef([])

  const panels = {
    details: (
      <div className="space-y-6">
        <p className="text-body text-muted">{library.details}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {library.features.map((feature, index) => (
            <li key={feature} className="flex items-center gap-3 border border-line px-4 py-3">
              <Icon name={FEATURE_ICONS[index] || 'sparkle'} size={18} className="shrink-0 text-ink" />
              <span className="text-meta">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    materials: <SpecList items={library.materials} />,
    fit: (
      <div className="space-y-6">
        <SpecList items={library.fit} />
        <p className="border border-line bg-surface p-4 text-meta text-muted">
          Model photography and garment measurements are illustrative sample data. Production specifications are
          confirmed by the supplier before each release.
        </p>
      </div>
    ),
    shipping: (
      <div className="space-y-6">
        <p className="text-body text-muted">{POLICY.shippingSummary}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <caption className="sr-only">Shipping options and estimated delivery</caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="py-2 pr-4 text-label font-semibold uppercase tracking-[0.06em]">Service</th>
                <th scope="col" className="py-2 pr-4 text-label font-semibold uppercase tracking-[0.06em]">Delivery estimate</th>
                <th scope="col" className="py-2 text-label font-semibold uppercase tracking-[0.06em]">Cost</th>
              </tr>
            </thead>
            <tbody>
              {POLICY.shippingOptions.map((option) => (
                <tr key={option.name} className="border-b border-line">
                  <td className="py-2.5 pr-4 text-meta font-medium">{option.name}</td>
                  <td className="py-2.5 pr-4 text-meta text-muted">{option.eta}</td>
                  <td className="py-2.5 text-meta text-muted">{option.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 text-meta text-muted">
          <p>
            <span className="font-semibold text-ink">Returns.</span> {POLICY.returnEligibility}
          </p>
          <p>{POLICY.returnsNote}</p>
        </div>
      </div>
    )
  }

  const TABS = [
    { id: 'details', label: 'Details' },
    { id: 'materials', label: 'Materials' },
    { id: 'fit', label: 'Size & Fit' },
    { id: 'shipping', label: 'Shipping & Returns' }
  ]

  const onKeyDown = (event) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === active)
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const delta = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (currentIndex + delta + TABS.length) % TABS.length
      setActive(TABS[nextIndex].id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <section aria-label="Product information" className="border-t border-line pt-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          {/* Desktop tabs */}
          <div className="hidden lg:block">
            <div role="tablist" aria-label="Product information" className="flex gap-8 border-b border-line" onKeyDown={onKeyDown}>
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={active === tab.id ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    '-mb-px border-b-2 pb-3 text-meta font-semibold transition-colors',
                    active === tab.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`tabpanel-${active}`}
              aria-labelledby={`tab-${active}`}
              className="pt-7 animate-fade-in"
            >
              {panels[active]}
            </div>
          </div>

          {/* Mobile accordion */}
          <div className="lg:hidden">
            <Accordion
              defaultOpenId="details"
              items={TABS.map((tab) => ({ id: tab.id, title: tab.label, content: panels[tab.id] }))}
            />
          </div>
        </div>

        <div className="lg:pt-1">
          <Media image={detailImage} ratio="4 / 5" sizes="half" className="bg-surface" />
          <p className="mt-3 text-label text-faint">
            Macro detail — heavyweight brushed-back fleece, garment-dyed for depth of colour.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductTabs
