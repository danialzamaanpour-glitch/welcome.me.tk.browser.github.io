import ProductCard from './ProductCard.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { cn } from '../../lib/format.js'

/** "You May Also Like" — four cards on wide desktop, two on tablet, two on mobile. */
export function RecommendedProducts({ products, title = 'You May Also Like', className = '' }) {
  if (!products?.length) return null

  return (
    <section aria-label={title} className={cn('pt-16', className)}>
      <SectionHeader title={title} viewAllTo="/shop" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </section>
  )
}

export default RecommendedProducts
