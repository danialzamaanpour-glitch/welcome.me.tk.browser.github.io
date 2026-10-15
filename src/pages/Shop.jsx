import ProductListing from '../components/product/ProductListing.jsx'
import { PRODUCTS } from '../data/products.js'
import { usePageMeta } from '../lib/seo.js'

export function Shop() {
  usePageMeta('Shop All', 'Browse every VELORA piece — hoodies, sweatshirts and heavyweight tees.')
  return (
    <ProductListing
      title="Shop All"
      subtitle="Heavyweight cotton essentials, cut oversized and finished by hand. Filter by category, colour, size or price."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
      products={PRODUCTS}
    />
  )
}

export default Shop
