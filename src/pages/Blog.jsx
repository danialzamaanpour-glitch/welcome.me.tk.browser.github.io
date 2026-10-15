import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import Media from '../components/ui/Media.jsx'
import Button from '../components/ui/Button.jsx'
import NotFound from './NotFound.jsx'
import { BLOG_POSTS } from '../data/content.js'
import { usePageMeta } from '../lib/seo.js'
import { formatDate } from '../lib/format.js'

/** Journal index. */
export function Blog() {
  usePageMeta('Journal', 'Styling notes, fabric guides and studio updates from VELORA.')

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Journal' }]} />
      <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">Journal</h1>
      <p className="mt-2 max-w-2xl text-body text-muted">
        Notes from the studio — how to wear the pieces, and why they are made the way they are.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {BLOG_POSTS.map((post, index) => (
          <article key={post.slug} className="group">
            <Link to={`/blog/${post.slug}`} className="block">
              <Media
                image={{ id: post.imageId, alt: post.alt }}
                ratio="4 / 3"
                sizes="tight"
                priority={index === 0}
                className="transition-transform duration-250 group-hover:scale-[1.02]"
              />
              <p className="mt-3 text-label uppercase tracking-[0.1em] text-faint">
                {post.category} · {formatDate(post.date)} · {post.readingTime}
              </p>
              <h2 className="mt-2 text-[17px] font-semibold leading-snug transition-colors group-hover:text-muted">
                {post.title}
              </h2>
              <p className="mt-2 text-meta text-muted">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

/** Single journal article. */
export function BlogPost() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)
  usePageMeta(post ? post.title : 'Article', post?.excerpt)

  if (!post) return <NotFound />

  const more = BLOG_POSTS.filter((entry) => entry.slug !== post.slug)

  return (
    <article className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Journal', to: '/blog' },
          { label: post.title }
        ]}
      />

      <header className="mx-auto mt-8 max-w-3xl">
        <p className="text-label uppercase tracking-[0.12em] text-faint">
          {post.category} · {formatDate(post.date)} · {post.readingTime}
        </p>
        <h1 className="mt-4 text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[40px]">
          {post.title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted">{post.excerpt}</p>
      </header>

      <div className="mx-auto mt-10 max-w-4xl">
        <Media image={{ id: post.imageId, alt: post.alt }} ratio="16 / 9" sizes="full" priority />
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-6">
        {post.body.map((paragraph) => (
          <p key={paragraph} className="text-[16px] leading-[1.75] text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl border-t border-line pt-8">
        <h2 className="text-label font-semibold uppercase tracking-[0.12em]">Keep reading</h2>
        <ul className="mt-5 space-y-4">
          {more.map((entry) => (
            <li key={entry.slug}>
              <Link to={`/blog/${entry.slug}`} className="group flex items-center gap-4">
                <span className="w-20 shrink-0">
                  <Media image={{ id: entry.imageId, alt: entry.alt }} ratio="1 / 1" sizes="thumb" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold transition-colors group-hover:text-muted">
                    {entry.title}
                  </span>
                  <span className="mt-0.5 block text-label text-faint">{entry.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Button to="/shop" variant="outline" size="lg" className="mt-8">
          Shop the collection
        </Button>
      </div>
    </article>
  )
}

export default Blog
