/**
 * Demonstration reviews.
 *
 * This repository has no review backend and no verified purchase data, so the
 * seeded entries below are clearly labelled as demonstration content in the UI.
 * Reviews written in the site itself are stored in the visitor's browser only.
 */
export const SEED_REVIEWS = [
  {
    id: 'seed-1',
    productId: 'essential-oversized-hoodie',
    author: 'A. Mercer',
    rating: 5,
    date: '2026-08-14',
    title: 'The fit is exactly right',
    body: 'Boxy without being shapeless. The weight of the fabric is what makes it feel considered.',
    demo: true,
  },
  {
    id: 'seed-2',
    productId: 'essential-oversized-hoodie',
    author: 'J. Okonkwo',
    rating: 5,
    date: '2026-08-02',
    title: 'Quietly premium',
    body: 'No branding shouting at you, just a clean silhouette. The charcoal reads almost matte in daylight.',
    demo: true,
  },
  {
    id: 'seed-3',
    productId: 'essential-oversized-hoodie',
    author: 'R. Lindqvist',
    rating: 4,
    date: '2026-07-21',
    title: 'Great, sized generously',
    body: 'Generous through the shoulder — I would take your usual size unless you want it very loose.',
    demo: true,
  },
  {
    id: 'seed-4',
    productId: 'essential-oversized-hoodie',
    author: 'M. Aoki',
    rating: 5,
    date: '2026-07-09',
    title: 'Holds its shape',
    body: 'Wears well through the week without going shapeless at the cuffs.',
    demo: true,
  },
  {
    id: 'seed-5',
    productId: 'essential-oversized-hoodie',
    author: 'D. Ferreira',
    rating: 4,
    date: '2026-06-28',
    title: 'Hood sits well',
    body: 'The hood stands up on its own instead of collapsing. Small thing, big difference.',
    demo: true,
  },
  {
    id: 'seed-6',
    productId: 'essential-oversized-hoodie',
    author: 'S. Bright',
    rating: 3,
    date: '2026-06-11',
    title: 'Lovely, runs oversized',
    body: 'Beautifully made but the oversized fit is genuinely oversized. Order a size down for a regular look.',
    demo: true,
  },
  {
    id: 'seed-7',
    productId: 'minimal-hoodie',
    author: 'L. Haddad',
    rating: 5,
    date: '2026-08-06',
    title: 'The tan is perfect',
    body: 'Warm without being loud. Pairs with everything in the collection.',
    demo: true,
  },
  {
    id: 'seed-8',
    productId: 'classic-sweatshirt',
    author: 'T. Novak',
    rating: 5,
    date: '2026-07-30',
    title: 'Daily driver',
    body: 'The collar keeps its shape after washing, which is rare for a crew.',
    demo: true,
  },
]

export const reviewsForProduct = (reviews, productId) =>
  reviews.filter((r) => r.productId === productId)
