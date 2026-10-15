import ProductListing from '../components/product/ProductListing.jsx'
import { PRODUCTS } from '../data/products.js'
import { usePageMeta } from '../lib/seo.js'

export function SearchPage({ query }) {
  const term = (query || '').trim()
  usePageMeta(term ? `Search: ${term}` : 'Search', 'Search the VELORA collection.')

  return (
    <ProductListing
      title={term ? `Results for “${term}”` : 'Search'}
      subtitle={
        term
          ? 'Matching products from across the collection. Refine with the filters or try another term.'
          : 'Use the search field to find a product, or browse the full collection.'
      }
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]}
      products={PRODUCTS}
      emptyMessage={term ? `No products match “${term}”.` : 'No products match these filters.'}
    />
  )
}

export default SearchPage
