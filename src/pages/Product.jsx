import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductSection from '../components/ProductSection'
import ProductDetails from '../components/ProductDetails'
import ProductReviews from '../components/ProductReviews'
import RelatedProducts from '../components/RelatedProducts'
import FinalSignature from '../components/FinalSignature'
import SizeGuideModal from '../components/SizeGuideModal'
import { PRODUCTS, getProductBySlug } from '../data/products'

/** Product detail route: the same purchase panel, tabs and reviews as the flagship. */
export default function Product() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  if (!product) {
    return (
      <div className="page container empty-state">
        <p className="empty-state__title">We couldn’t find that piece.</p>
        <p className="empty-state__copy">
          The product may have moved. Browse the full collection instead.
        </p>
        <Link className="btn btn--primary" to="/shop">
          Shop all pieces
        </Link>
      </div>
    )
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <>
      <div className="page container page-head page-head--product">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <ProductSection
        product={product}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        sectionId="product"
      />
      <ProductDetails product={product} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
      <ProductReviews product={product} />
      <RelatedProducts products={related} />
      <FinalSignature />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
