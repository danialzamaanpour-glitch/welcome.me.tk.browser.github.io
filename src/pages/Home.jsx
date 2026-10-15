import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Media from '../components/ui/Media.jsx'
import Icon from '../components/ui/Icon.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import NewsletterForm from '../components/layout/NewsletterForm.jsx'
import { PRODUCTS } from '../data/products.js'
import { BRAND_BENEFITS, BLOG_POSTS, COLLECTION_META } from '../data/content.js'
import { usePageMeta } from '../lib/seo.js'
import { formatDate } from '../lib/format.js'

const HERO = { id: '1758613654186-6ce234bf94ab', alt: 'Model wearing VELORA essentials in a studio setting' }
const EDITORIAL = { id: '1507553532144-b9df5e38c8d1', alt: 'Two models photographed in VELORA outerwear' }
const CRAFT = { id: '1645859610425-f0f4177df5f0', alt: 'Close-up of dense cotton fabric' }

export function Home() {
  usePageMeta('Everyday Essentials, Elevated', 'VELORA — premium heavyweight hoodies, sweatshirts and tees, made in small runs.')

  const newArrivals = PRODUCTS.filter((product) => product.isNew).slice(0, 4)
  const bestSellers = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-line">
        <div className="grid lg:grid-cols-[1fr_1.15fr]">
          <div className="order-2 flex flex-col justify-center px-5 py-12 sm:px-8 lg:order-1 lg:px-14 lg:py-20">
            <p className="eyebrow">Autumn 2026 Collection</p>
            <h1 className="mt-5 max-w-lg text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[46px] lg:text-display">
              Everyday Essentials. Elevated.
            </h1>
            <p className="mt-6 max-w-md text-body text-muted">
              Heavyweight cotton, cut oversized and garment-dyed. Built to be worn every day and to hold its shape for
              years — not a season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop" size="lg">
                Shop Now
              </Button>
              <Button to="/collections" variant="outline" size="lg">
                Explore Collection
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-label uppercase tracking-[0.1em] text-faint">Fabric weight</dt>
                <dd className="mt-1 text-[15px] font-semibold">480 GSM</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.1em] text-faint">Shipping</dt>
                <dd className="mt-1 text-[15px] font-semibold">Free over $99</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.1em] text-faint">Returns</dt>
                <dd className="mt-1 text-[15px] font-semibold">30 days</dd>
              </div>
            </dl>
          </div>
          <div className="order-1 lg:order-2">
            <Media image={HERO} ratio="4 / 5" sizes="half" priority className="h-full" />
          </div>
        </div>
      </section>

      <div className="shell">
        {/* New arrivals */}
        <section className="pt-16">
          <SectionHeader title="New Arrivals" subtitle="Just landed from the studio." viewAllTo="/new-arrivals" />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </section>

        {/* Collections */}
        <section className="pt-20">
          <SectionHeader title="Featured Collections" subtitle="Three ways to wear the same construction." viewAllTo="/collections" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {COLLECTION_META.map((collection) => (
              <Link
                key={collection.slug}
                to={`/collections/${collection.slug}`}
                className="group relative block overflow-hidden bg-surface"
              >
                <Media
                  image={{ id: collection.imageId, alt: collection.alt }}
                  ratio="4 / 5"
                  sizes="tight"
                  className="transition-transform duration-250 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-16">
                  <p className="text-micro font-semibold uppercase tracking-[0.16em] text-white/80">
                    {collection.tagline}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[18px] font-semibold text-white">
                    {collection.name}
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial split */}
        <section className="pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Media image={EDITORIAL} ratio="4 / 3" sizes="half" />
            <div>
              <p className="eyebrow">The Kinetic Minimalist</p>
              <h2 className="mt-4 text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
                Designed to disappear into your wardrobe
              </h2>
              <p className="mt-5 text-body text-muted">
                We build within four tones — charcoal, off-white, slate and cream — so every piece works with every
                other piece. No seasonal colourway to keep up with, no logo to date the garment.
              </p>
              <p className="mt-4 text-body text-muted">
                Each release is produced in small runs with the same mill, which is why the fleece you buy in October
                feels identical to the one you bought last spring.
              </p>
              <Button to="/pages/about" variant="outline" size="lg" className="mt-8">
                Our Story
              </Button>
            </div>
          </div>
        </section>

        {/* Best sellers */}
        <section className="pt-20">
          <SectionHeader title="Best Sellers" subtitle="The pieces our customers return for." viewAllTo="/shop" />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Craft band */}
        <section className="pt-20">
          <div className="grid items-stretch gap-0 border border-line sm:grid-cols-2">
            <Media image={CRAFT} ratio="1 / 1" sizes="half" />
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="eyebrow">Craft</p>
              <h2 className="mt-4 text-[24px] font-semibold leading-tight tracking-[-0.02em]">
                480 GSM, brushed on the inside only
              </h2>
              <p className="mt-4 text-body text-muted">
                A dense knit holds structure; a brushed interior keeps it soft. We do both, then garment-dye the
                finished piece so the colour sits in the fibre rather than on top of it.
              </p>
              <Link to="/blog/what-480-gsm-actually-means" className="mt-6 inline-flex items-center gap-2 text-meta font-medium">
                <span className="link-underline">Read the fabric guide</span>
                <Icon name="arrowRight" size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="pt-20">
          <div className="grid gap-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_BENEFITS.map((benefit) => (
              <div key={benefit.title}>
                <Icon name="check" size={18} className="text-ink" />
                <h3 className="mt-3 text-[15px] font-semibold">{benefit.title}</h3>
                <p className="mt-1.5 text-meta text-muted">{benefit.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Journal teaser */}
        <section className="pt-20">
          <SectionHeader title="From the Journal" viewAllTo="/blog" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
                <Media
                  image={{ id: post.imageId, alt: post.alt }}
                  ratio="4 / 3"
                  sizes="tight"
                  className="transition-transform duration-250 group-hover:scale-[1.02]"
                />
                <p className="mt-3 text-label uppercase tracking-[0.1em] text-faint">
                  {post.category} · {formatDate(post.date)}
                </p>
                <h3 className="mt-2 text-[16px] font-semibold leading-snug transition-colors group-hover:text-muted">
                  {post.title}
                </h3>
                <p className="mt-2 text-meta text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Newsletter */}
      <section className="mt-20 border-y border-line bg-surface">
        <div className="shell grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
              New releases, first.
            </h2>
            <p className="mt-3 max-w-md text-body text-muted">
              Small runs sell through quickly. Join the list and we will tell you before the restock email goes out.
            </p>
          </div>
          <div className="lg:justify-self-end lg:w-full lg:max-w-md">
            <NewsletterForm variant="home" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
