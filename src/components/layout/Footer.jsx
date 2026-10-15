import { Link } from 'react-router-dom'
import NewsletterForm from './NewsletterForm.jsx'

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Hoodies', to: '/shop?category=Hoodies' },
      { label: 'Sweatshirts', to: '/shop?category=Sweatshirts' },
      { label: 'T-Shirts', to: '/shop?category=T-Shirts' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Sale', to: '/sale' }
    ]
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Shipping & Returns', to: '/pages/shipping-returns' },
      { label: 'Size Guide', to: '/pages/size-guide' },
      { label: 'Track Your Order', to: '/account' },
      { label: 'Contact Us', to: '/pages/contact' },
      { label: 'FAQ', to: '/pages/faq' }
    ]
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/pages/about' },
      { label: 'Collections', to: '/collections' },
      { label: 'Journal', to: '/blog' },
      { label: 'Privacy Policy', to: '/pages/privacy' },
      { label: 'Terms of Service', to: '/pages/terms' }
    ]
  }
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="shell">
        <div className="grid gap-10 border-b border-line py-14 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <p className="text-[21px] font-extrabold uppercase leading-none tracking-[0.15em]">Velora</p>
            <p className="mt-4 max-w-sm text-meta text-muted">
              A contemporary essentials label. Heavyweight cotton, cut oversized, built for everyday wear and made in
              small runs.
            </p>
            <div className="mt-8 max-w-sm">
              <p className="text-label font-semibold uppercase tracking-[0.14em]">Join the list</p>
              <p className="mt-1 mb-4 text-meta text-muted">New releases and restocks. No noise.</p>
              <NewsletterForm variant="footer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-label font-semibold uppercase tracking-[0.12em]">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-meta text-muted transition-colors hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-label text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} VELORA. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Demonstration storefront — products, reviews and orders are sample data, and no payments are processed.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
