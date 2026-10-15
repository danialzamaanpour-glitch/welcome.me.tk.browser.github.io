import { Link, useParams } from 'react-router-dom'
import Media from '../components/ui/Media.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import ProductListing from '../components/product/ProductListing.jsx'
import NotFound from './NotFound.jsx'
import { PRODUCTS } from '../data/products.js'
import { COLLECTION_META } from '../data/content.js'
import { usePageMeta } from '../lib/seo.js'

/** Collections index — three editorial entry points. */
export function Collections() {
  usePageMeta('Collections', 'Velora collections: Essentials, Street and Studio.')

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
      <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Collections</h1>
      <p className="mt-2 max-w-2xl text-body text-muted">
        Three collections built on the same dense fleece and combed jersey, cut for different ways of wearing it.
      </p>

      <div className="mt-10 space-y-8">
        {COLLECTION_META.map((collection, index) => (
          <article
            key={collection.slug}
            className="grid items-center gap-6 border border-line sm:grid-cols-2 sm:gap-10"
          >
            <Media
              image={{ id: collection.imageId, alt: collection.alt }}
              ratio="4 / 3"
              sizes="half"
              priority={index === 0}
              className={index % 2 === 1 ? 'sm:order-2' : ''}
            />
            <div className="p-6 sm:p-10">
              <p className="eyebrow">{collection.tagline}</p>
              <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">{collection.name}</h2>
              <p className="mt-4 text-body text-muted">{collection.description}</p>
              <p className="mt-4 text-label text-faint">
                {PRODUCTS.filter((product) => product.collection === collection.name).length} products
              </p>
              <Button to={`/collections/${collection.slug}`} size="lg" className="mt-6 gap-2">
                Shop {collection.name}
                <Icon name="arrowRight" size={16} />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-meta text-muted">
        Looking for everything?{' '}
        <Link to="/shop" className="link-underline text-ink">
          Browse all products
        </Link>
        .
      </p>
    </div>
  )
}

/** Single collection listing. */
export function CollectionDetail() {
  const { slug } = useParams()
  const collection = COLLECTION_META.find((entry) => entry.slug === slug)
  usePageMeta(collection ? `${collection.name} Collection` : 'Collection', collection?.description)

  if (!collection) return <NotFound />

  return (
    <ProductListing
      title={`${collection.name} Collection`}
      subtitle={collection.description}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Collections', to: '/collections' },
        { label: collection.name }
      ]}
      products={PRODUCTS}
      lockedCollection={collection.name}
      emptyMessage={`Nothing in ${collection.name} matches these filters.`}
    />
  )
}

export default Collections
