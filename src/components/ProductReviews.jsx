import { useMemo, useState } from 'react'
import RatingStars from './RatingStars'
import { useReveal } from '../lib/useReveal'
import { formatDate } from '../lib/format'
import { useShop } from '../store/ShopContext'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: '5', label: '5★' },
  { id: '4', label: '4★' },
  { id: '3', label: '3★' },
  { id: '2', label: '2★' },
  { id: '1', label: '1★' },
]

/**
 * Reviews.
 *
 * The seeded reviews are sample content and are labelled "Sample" in the list;
 * reviews written here are stored in the visitor's browser. No verification,
 * purchase history or moderation backend exists in this repository, and the UI
 * says so instead of implying otherwise.
 */
export default function ProductReviews({ product, sectionId = 'reviews' }) {
  const { reviewsFor, addReview, notify } = useShop()
  const all = reviewsFor(product.id)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [form, setForm] = useState({ author: '', rating: '5', title: '', body: '' })
  const [error, setError] = useState('')
  const ref = useReveal({ stagger: 0.05 })

  const distribution = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: all.filter((r) => Math.round(r.rating) === star).length,
    }))
    return buckets
  }, [all])

  const average = all.length ? all.reduce((sum, r) => sum + r.rating, 0) / all.length : 0

  const visible = useMemo(() => {
    let list = all
    if (filter !== 'all') list = list.filter((r) => Math.round(r.rating) === Number(filter))
    if (sort === 'highest') list = [...list].sort((a, b) => b.rating - a.rating)
    else list = [...list].sort((a, b) => (a.date < b.date ? 1 : -1))
    return list
  }, [all, filter, sort])

  const submit = (e) => {
    e.preventDefault()
    if (!form.author.trim() || !form.title.trim() || form.body.trim().length < 10) {
      setError('Add a name, a title, and at least a sentence of detail.')
      return
    }
    setError('')
    addReview({
      productId: product.id,
      author: form.author.trim(),
      rating: Number(form.rating),
      title: form.title.trim(),
      body: form.body.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setForm({ author: '', rating: '5', title: '', body: '' })
    notify('Thanks — your review is saved in this browser.')
  }

  return (
    <section className="reviews" id={sectionId} ref={ref} aria-label="Reviews">
      <div className="container reviews__grid">
        <div className="reviews__summary reveal">
          <p className="micro micro--muted">Customer reviews</p>
          <p className="reviews__average">{average.toFixed(1)}</p>
          <RatingStars value={average} count={all.length} showValue={false} />
          <ul className="reviews__bars">
            {distribution.map((d) => (
              <li key={d.star} className="reviews__bar-row">
                <span className="reviews__bar-label">{d.star}★</span>
                <span className="reviews__bar">
                  <span
                    className="reviews__bar-fill"
                    style={{ width: all.length ? `${(d.count / all.length) * 100}%` : '0%' }}
                  />
                </span>
                <span className="reviews__bar-count">{d.count}</span>
              </li>
            ))}
          </ul>
          <p className="reviews__note">
            Sample review content for layout demonstration. This repository has no review backend,
            no verified-purchase data and no moderation.
          </p>
        </div>

        <div className="reviews__body reveal">
          <div className="reviews__controls">
            <div className="reviews__filters" role="group" aria-label="Filter reviews by rating">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`chip${filter === f.id ? ' is-active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="reviews__sort">
              <span className="visually-hidden">Sort reviews</span>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recent">Most recent</option>
                <option value="highest">Highest rated</option>
              </select>
            </label>
          </div>

          {visible.length === 0 ? (
            <p className="reviews__empty">No reviews match this filter yet.</p>
          ) : (
            <ul className="reviews__list">
              {visible.map((review) => (
                <li className="review" key={review.id}>
                  <div className="review__head">
                    <span className="review__author">{review.author}</span>
                    {review.demo && <span className="tag">Sample</span>}
                    {review.local && <span className="tag tag--ok">Saved in this browser</span>}
                    <span className="review__date">{formatDate(review.date)}</span>
                  </div>
                  <RatingStars value={review.rating} showValue={false} size={13} />
                  <p className="review__title">{review.title}</p>
                  <p className="review__body">{review.body}</p>
                </li>
              ))}
            </ul>
          )}

          <form className="review-form" onSubmit={submit} noValidate>
            <h3 className="review-form__title">Write a review</h3>
            <p className="micro micro--muted">
              Stored locally in your browser for this demonstration — nothing is uploaded.
            </p>
            <div className="review-form__row">
              <label className="field">
                <span className="field__label">Name</span>
                <input
                  className="input"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  autoComplete="name"
                />
              </label>
              <label className="field">
                <span className="field__label">Rating</span>
                <select
                  className="select"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field">
              <span className="field__label">Title</span>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="field__label">Review</span>
              <textarea
                className="input input--area"
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </label>
            {error && (
              <p className="field__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--primary">
              Submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
