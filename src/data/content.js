/**
 * Editorial + policy content shared by every page: navigation, category-level
 * product details, size chart, shipping/returns policy, collections and journal.
 */

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'Shop',
    to: '/shop',
    children: [
      { label: 'All Products', to: '/shop' },
      { label: 'Hoodies', to: '/shop?category=Hoodies' },
      { label: 'Sweatshirts', to: '/shop?category=Sweatshirts' },
      { label: 'T-Shirts', to: '/shop?category=T-Shirts' }
    ]
  },
  { label: 'New Arrivals', to: '/new-arrivals' },
  {
    label: 'Collections',
    to: '/collections',
    children: [
      { label: 'Essentials', to: '/collections/essentials' },
      { label: 'Street', to: '/collections/street' },
      { label: 'Studio', to: '/collections/studio' }
    ]
  },
  { label: 'Sale', to: '/sale' },
  { label: 'Blog', to: '/blog' }
]

/**
 * Category-level specification content. Kept illustrative: VELORA publishes
 * sample construction data pending supplier-verified garment specifications.
 */
export const DETAIL_LIBRARY = {
  Hoodies: {
    details:
      'Crafted from high-quality heavyweight cotton, this hoodie delivers unmatched comfort and durability. The oversized fit and minimalist design make it a versatile staple for any wardrobe.',
    features: [
      'Oversized fit',
      'Soft and heavyweight fabric',
      'Adjustable drawstring hood',
      'Ribbed cuffs and hem',
      'Unisex style'
    ],
    materials: [
      { label: 'Composition', value: '80% combed cotton, 20% recycled polyester (sample specification)' },
      { label: 'Fabric weight', value: '480 GSM brushed-back fleece (sample specification)' },
      { label: 'Hand feel', value: 'Dense and dry on the surface, softly brushed on the inside' },
      { label: 'Care', value: 'Machine wash cold, inside out, with like colours' },
      { label: 'Washing', value: 'Do not bleach. Do not use fabric softener — it flattens the brushed fleece' },
      { label: 'Drying', value: 'Tumble dry low, or dry flat to preserve the garment-dyed finish' }
    ],
    fit: [
      { label: 'Silhouette', value: 'Oversized — sized to be worn loose, with a dropped shoulder' },
      { label: 'Model', value: 'The model is 6\'1" / 185 cm and wears a size M (illustrative)' },
      { label: 'Between sizes', value: 'Size down for a relaxed fit, stay true for the full oversized shape' },
      { label: 'Sleeve', value: 'Long sleeve with a ribbed cuff; hem sits at mid-hip' }
    ]
  },
  Sweatshirts: {
    details:
      'A midweight loopback crew built for daily rotation. Clean neckline, relaxed body, and a finish that keeps its shape through repeated wear and washing.',
    features: [
      'Relaxed regular fit',
      'Midweight loopback cotton',
      'Structured ribbed collar',
      'Ribbed cuffs and hem',
      'Unisex style'
    ],
    materials: [
      { label: 'Composition', value: '85% combed cotton, 15% recycled polyester (sample specification)' },
      { label: 'Fabric weight', value: '400 GSM loopback (sample specification)' },
      { label: 'Hand feel', value: 'Dry, smooth face with a soft looped interior' },
      { label: 'Care', value: 'Machine wash cold, inside out, with like colours' },
      { label: 'Washing', value: 'Do not bleach. Reshape while damp to keep the collar structured' },
      { label: 'Drying', value: 'Tumble dry low or dry flat in shade' }
    ],
    fit: [
      { label: 'Silhouette', value: 'Relaxed regular — sits close to the body without clinging' },
      { label: 'Model', value: 'The model is 5\'10" / 178 cm and wears a size M (illustrative)' },
      { label: 'Between sizes', value: 'Size up for a roomier layer, size down for a cleaner line' },
      { label: 'Sleeve', value: 'Long sleeve with a ribbed cuff; hem sits at the hip' }
    ]
  },
  'T-Shirts': {
    details:
      'Cut from dense combed cotton with a wide neckline and a boxy body. Substantial enough to hold its shape, simple enough to wear with everything.',
    features: [
      'Boxy oversized fit',
      'Heavyweight combed cotton',
      'Wide ribbed neckline',
      'Double-stitched hem',
      'Unisex style'
    ],
    materials: [
      { label: 'Composition', value: '100% combed cotton (sample specification)' },
      { label: 'Fabric weight', value: '240 GSM jersey (sample specification)' },
      { label: 'Hand feel', value: 'Dry, dense, and smooth with minimal transparency' },
      { label: 'Care', value: 'Machine wash cold, inside out, with like colours' },
      { label: 'Washing', value: 'Do not bleach. Wash with similar colours to limit transfer' },
      { label: 'Drying', value: 'Tumble dry low, or line dry to preserve length' }
    ],
    fit: [
      { label: 'Silhouette', value: 'Boxy and oversized, with a dropped shoulder seam' },
      { label: 'Model', value: 'The model is 6\'0" / 183 cm and wears a size M (illustrative)' },
      { label: 'Between sizes', value: 'Take your usual size; size down for a closer fit' },
      { label: 'Length', value: 'Standard body length that finishes just below the waistband' }
    ]
  }
}

export const SIZE_CHART = {
  columns: ['Size', 'Chest (cm)', 'Body length (cm)', 'Sleeve (cm)', 'Chest (in)', 'Body length (in)', 'Sleeve (in)'],
  rows: [
    ['S', '104', '66', '60', '41', '26', '23.6'],
    ['M', '110', '68', '61', '43.3', '26.8', '24'],
    ['L', '116', '70', '62', '45.7', '27.6', '24.4'],
    ['XL', '122', '72', '63', '48', '28.3', '24.8'],
    ['XXL', '128', '74', '64', '50.4', '29.1', '25.2']
  ],
  howToMeasure: [
    'Chest — measure around the fullest part of your chest, keeping the tape level under your arms.',
    'Body length — measure from the highest point of the shoulder down to the hem.',
    'Sleeve — measure from the centre back of the neck, across the shoulder, down to the cuff.'
  ],
  disclaimer:
    'Garment measurements are illustrative sample data, measured flat with a tolerance of ±1.5 cm. Actual production measurements may vary.'
}

export const POLICY = {
  shippingSummary:
    'Complimentary standard shipping on all orders over $99. Orders below that ship at a flat rate calculated at checkout.',
  shippingOptions: [
    { name: 'Standard', eta: '3–5 business days', cost: 'Free over $99, otherwise $8' },
    { name: 'Express', eta: '1–2 business days', cost: '$18' },
    { name: 'International', eta: '6–10 business days', cost: 'From $24' }
  ],
  returnEligibility:
    'Unworn items with original tags attached are eligible for return within 30 days of delivery. Final sale items and gift cards are not eligible.',
  returnPeriod: '30 days from delivery',
  returnsNote:
    'This storefront runs as a demonstration environment, so order placement and returns are not processed by a live fulfilment system.'
}

export const COLLECTION_META = [
  {
    slug: 'essentials',
    name: 'Essentials',
    tagline: 'The permanent collection',
    description:
      'Heavyweight cotton basics cut to last more than a season. Every piece in Essentials is built around the same dense fleece and combed jersey, so the collection layers with itself.',
    imageId: '1693645325828-62cd35c8da8f',
    alt: 'Model standing against a neutral studio backdrop'
  },
  {
    slug: 'street',
    name: 'Street',
    tagline: 'Washed, worn, cropped',
    description:
      'Cropped bodies, faded washes and relaxed proportions. Street takes the Essentials construction and cuts it for movement.',
    imageId: '1721637635502-b0abaaa75edb',
    alt: 'Model on a city street wearing a hoodie'
  },
  {
    slug: 'studio',
    name: 'Studio',
    tagline: 'Tailored fleece',
    description:
      'Where fleece meets tailoring. Studio pieces have defined shoulders, longer bodies and a matte finish designed to be worn alone.',
    imageId: '1532332248682-206cc786359f',
    alt: 'Model standing beside a glass-fronted building'
  }
]

export const BLOG_POSTS = [
  {
    slug: 'how-to-wear-an-oversized-hoodie',
    title: 'How to wear an oversized hoodie without losing the line',
    excerpt:
      'Proportion is everything. Three ways to style an oversized hoodie so the silhouette stays intentional.',
    category: 'Styling',
    date: '2026-09-28',
    readingTime: '4 min read',
    imageId: '1564557287817-3785e38ec1f5',
    alt: 'Model wearing an oversized hoodie against a plaster wall',
    body: [
      'An oversized hoodie only reads as a considered choice when the rest of the outfit agrees with it. The mistake is balancing volume with more volume.',
      'Start with the hem line. A dropped shoulder needs a clean bottom half — a straight trouser or a narrow denim, not another wide leg. The eye reads the gap between shoulder and hem as intent.',
      'Second, choose one point of structure. A stiff jacket over a soft hoodie, or a structured bag, gives the silhouette something to lean against.',
      'Finally, keep the palette quiet. Charcoal over off-white, or cream over slate. The garment does the talking.'
    ]
  },
  {
    slug: 'what-480-gsm-actually-means',
    title: 'What 480 GSM actually means for a hoodie',
    excerpt: 'A short guide to fabric weight, and why the number matters more than the label.',
    category: 'Craft',
    date: '2026-09-12',
    readingTime: '5 min read',
    imageId: '1643313262988-cdc5f50c6019',
    alt: 'Close-up of heavyweight gray fleece fabric',
    body: [
      'GSM stands for grams per square metre — the weight of one square metre of the fabric before it is cut. It is the fastest way to compare two garments that look identical on a hanger.',
      'Below 300 GSM, a hoodie drapes and eventually collapses at the shoulder. Between 400 and 500 GSM, the fabric holds its own shape while still softening with wear.',
      'Weight is only half of it. A dense knit and a brushed interior make a heavier fabric feel softer, which is why two 480 GSM hoodies can feel completely different in the hand.',
      'Our Essentials fleece is knitted at 480 GSM and brushed on the inside only, so the face stays matte and dry.'
    ]
  },
  {
    slug: 'the-case-for-a-monochrome-wardrobe',
    title: 'The case for a monochrome wardrobe',
    excerpt: 'Fewer decisions, longer wear. Why we build in black, white and everything between.',
    category: 'Journal',
    date: '2026-08-30',
    readingTime: '3 min read',
    imageId: '1721637686340-de9f8cebda5a',
    alt: 'Model photographed in a monochrome setting',
    body: [
      'A monochrome wardrobe is not a restriction. It is a way of making every piece interchangeable, so getting dressed stops being a decision.',
      'We work within charcoal, off-white, slate and cream because those four hold their depth through washing, and because they layer without competing.',
      'Start with the darkest piece you own and build outward. The rest follows.'
    ]
  }
]

export const BRAND_BENEFITS = [
  { title: 'Heavyweight by default', body: 'Every garment starts at 400 GSM or above. No lightweight compromises.' },
  { title: 'Built to be washed', body: 'Pre-shrunk and garment-dyed, so the fit you buy is the fit you keep.' },
  { title: 'Made in small runs', body: 'Limited production keeps quality high and waste low.' },
  { title: 'Free returns for 30 days', body: 'Unworn with tags. If the fit is not right, we will take it back.' }
]

export const FAQS = [
  {
    q: 'How does VELORA sizing run?',
    a: 'Our hoodies and sweatshirts are cut oversized, so most people take their usual size. Tees are boxy with a dropped shoulder — size down for a closer fit.'
  },
  {
    q: 'When will my order arrive?',
    a: 'Standard shipping takes 3–5 business days, express 1–2. Orders over $99 ship free.'
  },
  {
    q: 'What is the return window?',
    a: 'Thirty days from delivery on unworn items with tags attached. Final sale items are excluded.'
  },
  {
    q: 'How should I wash heavyweight fleece?',
    a: 'Machine wash cold, inside out, without fabric softener, then tumble dry low or dry flat.'
  }
]
