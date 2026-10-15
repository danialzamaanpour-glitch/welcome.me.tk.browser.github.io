import { useId } from 'react'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import MobileBuyBar from './MobileBuyBar'
import { useReveal } from '../lib/useReveal'
import { useShop } from '../store/ShopContext'

/**
 * CHAPTER 06 — THE PRODUCT BECOMES SHOPPABLE
 * The immersive presentation resolves into the familiar product layout: large
 * media on the left, purchase panel on the right, sticky bar on phones.
 */
export default function ProductSection({ product, onOpenSizeGuide, sectionId = 'product' }) {
  const ref = useReveal({ stagger: 0.06 })
  const ctaId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { getSelection } = useShop()
  const { colorId } = getSelection(product)

  return (
    <section className="product-section" id={sectionId} ref={ref} aria-labelledby={`${sectionId}-heading`}>
      <div className="container section-head">
        <p className="micro micro--muted reveal">06 — The product</p>
        <h2 className="section-title reveal" id={`${sectionId}-heading`}>
          Now make it yours.
        </h2>
        <p className="section-copy reveal">
          Every choice you make here — the finish, the size, the quantity — is the same state the
          live model and the purchase panel share.
        </p>
      </div>

      <div className="container product-section__grid">
        <div className="product-section__media reveal">
          <ProductGallery product={product} colorId={colorId} />
        </div>
        <div className="product-section__panel reveal">
          <ProductInfo product={product} onOpenSizeGuide={onOpenSizeGuide} ctaId={ctaId} />
        </div>
      </div>

      <MobileBuyBar product={product} ctaId={ctaId} />
    </section>
  )
}
