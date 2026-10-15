import { useCallback, useRef, useState } from 'react'
import FabricArt from './FabricArt'
import { useReveal } from '../lib/useReveal'
import { colorById } from '../data/products'
import { useShop } from '../store/ShopContext'

const TABS = [
  { id: 'details', label: 'Details', key: 'details' },
  { id: 'materials', label: 'Materials', key: 'materials' },
  { id: 'size', label: 'Size & fit', key: 'sizeAndFit' },
  { id: 'shipping', label: 'Shipping & returns', key: 'shipping' },
]

/**
 * CHAPTER 07 — THE DETAILS REVEAL
 * Editorial fabric macro beside a real tabbed panel. The tabs are plain,
 * keyboard-accessible React state: they work independently of every scroll
 * animation on the page.
 */
export default function ProductDetails({ product, onOpenSizeGuide, sectionId = 'details' }) {
  const [active, setActive] = useState(TABS[0].id)
  const tabRefs = useRef([])
  const ref = useReveal({ stagger: 0.05 })
  const { getSelection } = useShop()
  const { colorId } = getSelection(product)
  const color = colorById(product, colorId)

  const onKeyDown = useCallback((e) => {
    const index = TABS.findIndex((t) => t.id === active)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
      setActive(TABS[next].id)
      tabRefs.current[next]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(TABS[0].id)
      tabRefs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(TABS[TABS.length - 1].id)
      tabRefs.current[TABS.length - 1]?.focus()
    }
  }, [active])

  const panel = TABS.find((t) => t.id === active)

  return (
    <section className="details-section" id={sectionId} ref={ref} aria-label="Product details">
      <div className="container details-section__grid">
        <div className="details-section__media reveal">
          <FabricArt
            kind="twill"
            tone={color?.hex || '#2A2B2F'}
            overlay="seam"
            exposure={1.05}
            caption="Editorial macro of the same weave used on the model — a rendered surface, not a photograph."
            className="fabric-art--editorial"
          />
          <ul className="feature-list">
            {product.bullets.map((b) => (
              <li key={b} className="feature-list__item">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="details-section__panel reveal">
          <div className="tabs" role="tablist" aria-label="Product information" onKeyDown={onKeyDown}>
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active === tab.id ? 0 : -1}
                className={`tab${active === tab.id ? ' is-active' : ''}`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="tab-panel"
            role="tabpanel"
            id={`panel-${panel.id}`}
            aria-labelledby={`tab-${panel.id}`}
            key={panel.id}
          >
            <p>{product.tabs[panel.key]}</p>
            {panel.id === 'details' && (
              <ul className="feature-list feature-list--inline">
                {product.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {panel.id === 'size' && (
              <button type="button" className="btn btn--ghost" onClick={onOpenSizeGuide}>
                Open the size &amp; fit guide
              </button>
            )}
          </div>

          <p className="details-section__note">
            Product copy follows the supplied VELORA reference. This repository has no supplier
            specification sheet, so no fabric weight, composition percentage or certification is
            claimed here.
          </p>
        </div>
      </div>
    </section>
  )
}
