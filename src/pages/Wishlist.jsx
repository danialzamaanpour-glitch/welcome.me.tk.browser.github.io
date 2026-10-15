import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { PRODUCTS } from '../data/products.js'
import { useStore } from '../lib/store.jsx'
import { usePageMeta } from '../lib/seo.js'
import { pluralize } from '../lib/format.js'

/** Saved products, kept on this device via the store's wishlist state. */
export function Wishlist() {
  const { wishlist } = useStore()
  usePageMeta('Wishlist', 'Products you have saved on this device.')

  const saved = PRODUCTS.filter((product) => wishlist.includes(product.id))

  return (
    <div className="shell py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="text-label text-muted">
        <Link to="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <span className="px-2 text-line">/</span>
        <span className="text-ink">Wishlist</span>
      </nav>

      <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Wishlist</h1>
        <p className="text-meta text-muted">{pluralize(saved.length, 'item')} saved</p>
      </header>

      {saved.length === 0 ? (
        <div className="mt-8 max-w-xl border border-line bg-surface px-6 py-14 text-center">
          <Icon name="heart" size={28} className="mx-auto text-faint" />
          <p className="mt-4 text-[16px] font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-meta text-muted">
            Tap the heart on any product to keep it here. Your wishlist is stored in this browser.
          </p>
          <Button to="/shop" size="lg" className="mt-6">
            Browse the collection
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {saved.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
          <p className="mt-10 text-label text-faint">
            Removing an item here updates the heart on every page. Wishlists are kept on this device only.
          </p>
        </>
      )}
    </div>
  )
}

export default Wishlist
