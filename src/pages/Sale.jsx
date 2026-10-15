import ProductListing from '../components/product/ProductListing.jsx'
import { PRODUCTS } from '../data/products.js'
import { usePageMeta } from '../lib/seo.js'

export function Sale() {
  usePageMeta('Sale', 'Reduced VELORA essentials — while stock lasts.')
  return (
    <ProductListing
      title="Sale"
      subtitle="Reduced pieces from previous runs. Discounts are calculated from the original price and shown on every card."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Sale' }]}
      products={PRODUCTS.filter((product) => Boolean(product.originalPrice))}
      emptyMessage="Nothing is on sale right now."
    />
  )
}

export default Sale
