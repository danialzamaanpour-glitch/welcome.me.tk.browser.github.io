import ProductListing from '../components/product/ProductListing.jsx'
import { PRODUCTS } from '../data/products.js'
import { usePageMeta } from '../lib/seo.js'

export function NewArrivals() {
  usePageMeta('New Arrivals', 'The latest VELORA releases, produced in small runs.')
  return (
    <ProductListing
      title="New Arrivals"
      subtitle="The newest additions to the collection, produced in small runs."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'New Arrivals' }]}
      products={PRODUCTS.filter((product) => product.isNew)}
      emptyMessage="No new arrivals match these filters."
    />
  )
}

export default NewArrivals
