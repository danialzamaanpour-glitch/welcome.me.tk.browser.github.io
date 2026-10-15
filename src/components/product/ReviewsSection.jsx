import { useMemo, useState } from 'react'
import Stars from '../ui/Stars.jsx'
import Icon from '../ui/Icon.jsx'
import { formatReviewDate, ratingBreakdown, reviewsForProduct } from '../../data/reviews.js'
import { cn, pluralize } from '../../lib/format.js'

const PAGE_SIZE = 3

/**
 * Reviews. Records come from the sample review data set — the UI states that
 * plainly, and the "verified purchase" badge is driven by the record itself,
 * never assumed.
 */
export function ReviewsSection({ product, sectionRef }) {
  const all = useMemo(() => reviewsForProduct(product.id), [product.id])
  const [starFilter, setStarFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const breakdown = ratingBreakdown(all)

  const filtered = useMemo(() => {
    const list = starFilter === 'all' ? all : all.filter((review) => review.rating === Number(starFilter))
    return [...list].sort((a, b) =>
      sort === 'helpful' ? b.helpful - a.helpful : new Date(b.date) - new Date(a.date)
    )
  }, [all, starFilter, sort])

  const shown = filtered.slice(0, visible)

  return (
    <section ref={sectionRef} aria-labelledby="reviews-heading" className="border-t border-line pt-14 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="text-[20px] font-semibold sm:text-section">
          Reviews
        </h2>
        <p className="text-label text-faint">Sample review data for this demonstration storefront</p>
      </div>

      <div className="mt-6 grid gap-8 border border-line p-6 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <p className="text-[40px] font-bold leading-none tabular-nums">{product.rating.toFixed(1)}</p>
          <Stars value={product.rating} size={16} className="mt-3" label={`Rated ${product.rating} out of 5`} />
          <p className="mt-2 text-meta text-muted">Based on {pluralize(product.reviewCount, 'review')}</p>

          <ul className="mt-6 space-y-2">
            {breakdown.map((row) => (
              <li key={row.star} className="flex items-center gap-3 text-label">
                <span className="w-8 shrink-0 tabular-nums text-muted">{row.star}★</span>
                <span className="h-1.5 flex-1 bg-surface2">
                  <span
                    className="block h-full bg-ink"
                    style={{ width: `${row.percent}%` }}
                    aria-hidden="true"
                  />
                </span>
                <span className="w-8 shrink-0 text-right tabular-nums text-muted">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by rating">
              {['all', '5', '4', '3', '2', '1'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setStarFilter(option)
                    setVisible(PAGE_SIZE)
                  }}
                  aria-pressed={starFilter === option}
                  className={cn(
                    'h-9 border px-3 text-label font-medium transition-colors',
                    starFilter === option
                      ? 'border-cta bg-cta text-white'
                      : 'border-line text-muted hover:border-ink hover:text-ink'
                  )}
                >
                  {option === 'all' ? 'All' : `${option} star`}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="review-sort" className="text-label text-muted">
                Sort
              </label>
              <select
                id="review-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-9 border border-line bg-paper px-3 text-label text-ink focus:border-ink focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="helpful">Most helpful</option>
              </select>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="mt-8 border border-line bg-surface p-6 text-meta text-muted">
              {all.length === 0
                ? 'No reviews have been published for this product yet. Reviews shown elsewhere in the store are sample data.'
                : 'No reviews match this filter.'}
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-line">
              {shown.map((review) => (
                <li key={review.id} className="py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars value={review.rating} size={13} label={`${review.rating} out of 5 stars`} />
                    <h3 className="text-[15px] font-semibold">{review.title}</h3>
                  </div>
                  <p className="mt-2 text-body text-muted">{review.body}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-label text-faint">
                    <span className="font-medium text-muted">{review.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatReviewDate(review.date)}</span>
                    {review.verifiedPurchase ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-success">
                          <Icon name="check" size={13} />
                          Verified purchase
                        </span>
                      </>
                    ) : null}
                    <span aria-hidden="true">·</span>
                    <span>{review.helpful} found this helpful</span>
                  </p>
                </li>
              ))}
            </ul>
          )}

          {visible < filtered.length ? (
            <button
              type="button"
              onClick={() => setVisible((current) => current + PAGE_SIZE)}
              className="mt-6 inline-flex h-11 items-center border border-line px-5 text-meta font-medium transition-colors hover:border-ink"
            >
              Load more reviews
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
