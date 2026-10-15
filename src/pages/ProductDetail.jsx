import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import ProductGallery from '../components/product/ProductGallery.jsx'
import PurchasePanel from '../components/product/PurchasePanel.jsx'
import ProductTabs from '../components/product/ProductTabs.jsx'
import ReviewsSection from '../components/product/ReviewsSection.jsx'
import RecommendedProducts from '../components/product/RecommendedProducts.jsx'
import NotFound from './NotFound.jsx'
import {
  getProductBySlug,
  getRelatedProducts,
  imagesForColor,
  isAvailable
} from '../data/products.js'
import { useScrollToRef } from '../lib/hooks.js'
import { usePageMeta } from '../lib/seo.js'

/**
 * Product detail page — the primary reference experience: vertically stacked
 * gallery with a large portrait image on the left, the purchase column on the
 * right, then details, reviews and recommendations.
 */
export function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  const [colorName, setColorName] = useState(product?.colors[0]?.name || '')
  const firstAvailable =
    product?.sizes.find((size) => size.label === 'M' && size.available) ||
    product?.sizes.find((size) => size.available)
  const [sizeLabel, setSizeLabel] = useState(firstAvailable?.label || null)
  const [reviewsRef, scrollToReviews] = useScrollToRef()

  usePageMeta(
    product ? product.name : 'Product not found',
    product ? `${product.name} — ${product.shortDescription}` : undefined
  )

  if (!product) return <NotFound />

  const galleryImages = imagesForColor(product, colorName)
  const detailImage = galleryImages[galleryImages.length - 1] || galleryImages[0]
  const related = getRelatedProducts(product, 4)

  const handleColorChange = (nextColor) => {
    setColorName(nextColor)
    // Keep the size valid for the newly selected colour where possible.
    if (sizeLabel && !isAvailable(product, nextColor, sizeLabel)) {
      const fallback = product.sizes.find((size) => size.available && isAvailable(product, nextColor, size.label))
      setSizeLabel(fallback ? fallback.label : null)
    }
  }

  return (
    <div className="pb-20">
      <div className="shell pt-6 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name }
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
          <ProductGallery images={galleryImages} productName={product.name} priority />
          <PurchasePanel
            product={product}
            colorName={colorName}
            onColorChange={handleColorChange}
            sizeLabel={sizeLabel}
            onSizeChange={setSizeLabel}
            onReviewsClick={scrollToReviews}
          />
        </div>

        <div className="mt-20">
          <ProductTabs product={product} detailImage={detailImage} />
        </div>

        <div className="mt-16">
          <ReviewsSection product={product} sectionRef={reviewsRef} />
        </div>

        <p className="mt-10 text-label text-faint">
          Looking for the full policy?{' '}
          <Link to="/pages/shipping-returns" className="link-underline text-muted">
            Shipping &amp; Returns
          </Link>{' '}
          ·{' '}
          <Link to="/pages/size-guide" className="link-underline text-muted">
            Size Guide
          </Link>
        </p>
      </div>

      {/* Background shifts to the light surface as the recommendations arrive. */}
      <section className="mt-20 border-y border-line bg-surface">
        <div className="shell pb-16">
          <RecommendedProducts products={related} />
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
