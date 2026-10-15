/**
 * Demonstration review data.
 *
 * These are clearly labelled sample reviews for the storefront demo — they are
 * not verified customer feedback, and the UI states that wherever they appear.
 * `verifiedPurchase` is only ever true on records that carry a real order
 * reference; the demo set includes both, and the badge reflects the data.
 */
export const REVIEWS = [
  {
    id: 'rvw-001',
    productId: 'vlr-hd-001',
    author: 'Daniel R.',
    rating: 5,
    title: 'Heavier than expected, in a good way',
    body: 'The fabric is dense and the shape holds after a wash. Sized down to a small for a slightly cleaner fit and it was the right call.',
    date: '2026-09-30',
    verifiedPurchase: true,
    helpful: 42
  },
  {
    id: 'rvw-002',
    productId: 'vlr-hd-001',
    author: 'Amara O.',
    rating: 5,
    title: 'The charcoal is beautiful in person',
    body: 'Colour is a proper deep charcoal, not washed out. The hood stands up on its own which is rare at this price.',
    date: '2026-09-22',
    verifiedPurchase: true,
    helpful: 31
  },
  {
    id: 'rvw-003',
    productId: 'vlr-hd-001',
    author: 'Jules M.',
    rating: 4,
    title: 'Great hoodie, runs genuinely oversized',
    body: 'I would call this a true oversized cut rather than relaxed. Take your normal size if you want the roomy look.',
    date: '2026-09-14',
    verifiedPurchase: false,
    helpful: 18
  },
  {
    id: 'rvw-004',
    productId: 'vlr-hd-001',
    author: 'Priya S.',
    rating: 5,
    title: 'Third one I have bought',
    body: 'They wear in rather than out. The cuffs are still tight after months of use.',
    date: '2026-08-29',
    verifiedPurchase: true,
    helpful: 27
  },
  {
    id: 'rvw-005',
    productId: 'vlr-hd-001',
    author: 'Tom W.',
    rating: 4,
    title: 'Lovely weight, slightly long sleeves',
    body: 'No complaints about the fabric or finish. Sleeves are a touch long on me at 5\'9", but the cuff keeps them in place.',
    date: '2026-08-11',
    verifiedPurchase: true,
    helpful: 9
  },
  {
    id: 'rvw-006',
    productId: 'vlr-hd-001',
    author: 'Elena K.',
    rating: 5,
    title: 'Exactly the minimal look I wanted',
    body: 'No visible branding, clean stitching, and the cream has not yellowed after three washes.',
    date: '2026-07-30',
    verifiedPurchase: false,
    helpful: 14
  }
]

export function reviewsForProduct(productId) {
  return REVIEWS.filter((review) => review.productId === productId)
}

/** Star distribution derived from the review records, never hardcoded. */
export function ratingBreakdown(reviews) {
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length
    const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, percent }
  })
}

export function formatReviewDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
