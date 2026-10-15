/**
 * VELORA product catalog.
 *
 * Single source of truth for every storefront surface (listing pages, product
 * detail, cart, search, recommendations). Adding or editing a product here
 * propagates everywhere — no product data is duplicated in components.
 *
 * `price` / `originalPrice` are the authoritative USD base amounts. Any other
 * currency is a display conversion (see src/lib/currency.js).
 */

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL']

function sizes(availability = {}) {
  return STANDARD_SIZES.map((label) => ({
    label,
    available: availability[label] !== false
  }))
}

/** Colors are shared swatch definitions so hex values never drift between pages. */
export const SWATCHES = {
  charcoal: { name: 'Charcoal Gray', hex: '#3B3B3D' },
  lightGray: { name: 'Light Gray', hex: '#CFCFCF' },
  cream: { name: 'Cream', hex: '#EDE4D3' },
  black: { name: 'Black', hex: '#0C0C0C' },
  slate: { name: 'Slate', hex: '#6E7580' },
  sand: { name: 'Sand', hex: '#D9C7A7' },
  offWhite: { name: 'Off White', hex: '#F2F0EB' },
  navy: { name: 'Deep Navy', hex: '#1E2734' }
}

const color = (key, images) => ({ ...SWATCHES[key], images })

export const PRODUCTS = [
  {
    id: 'vlr-hd-001',
    slug: 'essential-oversized-hoodie',
    name: 'Essential Oversized Hoodie',
    category: 'Hoodies',
    collection: 'Essentials',
    price: 59.99,
    originalPrice: 89.99,
    badge: 'New Arrival',
    isNew: true,
    rating: 4.8,
    reviewCount: 128,
    stock: 42,
    shortDescription:
      'Premium heavyweight cotton hoodie with an oversized fit for ultimate comfort and modern style.',
    description:
      'Premium heavyweight cotton hoodie with an oversized fit for ultimate comfort and modern style. Cut with a dropped shoulder and finished with a double-layer hood, it holds its shape season after season.',
    highlights: ['Heavyweight 480 GSM fleece', 'Dropped shoulder, oversized fit', 'Garment-dyed for depth of colour'],
    sizes: sizes(),
    colors: [
      color('charcoal', [
        { id: '1564557287817-3785e38ec1f5', alt: 'Model wearing the charcoal Essential Oversized Hoodie, three-quarter view' },
        { id: '1611817757591-c3f345024273', alt: 'Model wearing the charcoal hoodie standing against a pale studio wall' },
        { id: '1693645325828-62cd35c8da8f', alt: 'Back view of the charcoal hoodie on a neutral studio backdrop' },
        { id: '1643313262988-cdc5f50c6019', alt: 'Close-up of the charcoal heavyweight fleece fabric' }
      ]),
      color('lightGray', [
        { id: '1688111421205-a0a85415b224', alt: 'Model wearing the light gray Essential Oversized Hoodie' },
        { id: '1508216310976-c518daae0cdc', alt: 'Light gray hoodie worn against a white wall' },
        { id: '1620799140408-edc6dcb6d633', alt: 'Light gray hoodie laid flat on a pale surface' },
        { id: '1615799998603-7c6270a45196', alt: 'Close-up of the light gray woven cotton texture' }
      ]),
      color('cream', [
        { id: '1578587018452-892bacefd3f2', alt: 'Model wearing the cream Essential Oversized Hoodie' },
        { id: '1613909671501-f9678ffc1d33', alt: 'Cream hoodie styled in daylight' },
        { id: '1528458909336-e7a0adfed0a5', alt: 'Close-up of the cream garment-dyed fabric' },
        { id: '1643313260651-9c335822ecde', alt: 'Cream knit textile detail' }
      ]),
      color('black', [
        { id: '1698684420707-33f4433f8bd8', alt: 'Model wearing the black Essential Oversized Hoodie' },
        { id: '1680292783974-a9a336c10366', alt: 'Black hoodie photographed flat on a light surface' },
        { id: '1618354691551-44de113f0164', alt: 'Black hoodie folded on a studio table' },
        { id: '1591195854242-8804547cdcab', alt: 'Close-up of the black brushed fleece fabric' }
      ])
    ]
  },
  {
    id: 'vlr-hd-002',
    slug: 'minimal-hoodie',
    name: 'Minimal Hoodie',
    category: 'Hoodies',
    collection: 'Essentials',
    price: 54.99,
    originalPrice: null,
    badge: null,
    isNew: true,
    rating: 4.7,
    reviewCount: 86,
    stock: 31,
    shortDescription: 'A pared-back pullover hoodie with tonal stitching and a soft brushed interior.',
    description:
      'A pared-back pullover hoodie with tonal stitching and a soft brushed interior. Clean lines, no visible branding, built as a wardrobe foundation.',
    highlights: ['Tonal stitching throughout', 'Brushed fleece interior', 'Ribbed hem and cuffs'],
    sizes: sizes(),
    colors: [SWATCHES.black, SWATCHES.slate, SWATCHES.offWhite].map((c) => ({ ...c })),
    images: [
      { id: '1499971856191-1a420a42b498', alt: 'Minimal Hoodie in black hanging on a rail' },
      { id: '1618354691551-44de113f0164', alt: 'Minimal Hoodie folded flat on a studio table' }
    ]
  },
  {
    id: 'vlr-sw-001',
    slug: 'classic-sweatshirt',
    name: 'Classic Sweatshirt',
    category: 'Sweatshirts',
    collection: 'Essentials',
    price: 49.99,
    originalPrice: null,
    badge: null,
    isNew: false,
    rating: 4.6,
    reviewCount: 64,
    stock: 58,
    shortDescription: 'The everyday crew neck in midweight loopback cotton.',
    description:
      'The everyday crew neck in midweight loopback cotton. A relaxed body with a slightly shorter length so it layers cleanly under outerwear.',
    highlights: ['Midweight loopback cotton', 'Relaxed body, clean neckline', 'Pre-shrunk and shape-holding'],
    sizes: sizes(),
    colors: [SWATCHES.navy, SWATCHES.lightGray, SWATCHES.black].map((c) => ({ ...c })),
    images: [
      { id: '1614975059251-992f11792b9f', alt: 'Model wearing the Classic Sweatshirt against a brick wall' },
      { id: '1620799140408-edc6dcb6d633', alt: 'Classic Sweatshirt laid flat' }
    ]
  },
  {
    id: 'vlr-hd-003',
    slug: 'zip-up-hoodie',
    name: 'Zip Up Hoodie',
    category: 'Hoodies',
    collection: 'Essentials',
    price: 64.99,
    originalPrice: null,
    badge: null,
    isNew: false,
    rating: 4.7,
    reviewCount: 92,
    stock: 27,
    shortDescription: 'Full-zip heavyweight hoodie with a metal zip and split kangaroo pockets.',
    description:
      'Full-zip heavyweight hoodie with a metal zip and split kangaroo pockets. Designed to be worn open, with a structured hood that stands on its own.',
    highlights: ['Brushed metal zip', 'Split kangaroo pockets', 'Structured double-layer hood'],
    sizes: sizes({ XXL: false }),
    colors: [SWATCHES.slate, SWATCHES.charcoal].map((c) => ({ ...c })),
    images: [
      { id: '1565693413579-8ff3fdc1b03b', alt: 'Close-up of the Zip Up Hoodie fabric and zip' },
      { id: '1564557287817-3785e38ec1f5', alt: 'Model wearing the Zip Up Hoodie' }
    ]
  },
  {
    id: 'vlr-hd-004',
    slug: 'essential-hoodie',
    name: 'Essential Hoodie',
    category: 'Hoodies',
    collection: 'Essentials',
    price: 59.99,
    originalPrice: 74.99,
    badge: 'Sale',
    isNew: false,
    rating: 4.5,
    reviewCount: 143,
    stock: 19,
    shortDescription: 'The original VELORA hoodie — soft, dense, and endlessly wearable.',
    description:
      'The original VELORA hoodie — soft, dense, and endlessly wearable. Garment-washed for a lived-in hand feel from the first wear.',
    highlights: ['Garment-washed finish', 'Dense 450 GSM fleece', 'Slightly cropped body'],
    sizes: sizes(),
    colors: [SWATCHES.charcoal, SWATCHES.black, SWATCHES.cream].map((c) => ({ ...c })),
    images: [
      { id: '1559697242-a465f2578a95', alt: 'Two models wearing the Essential Hoodie' },
      { id: '1643313262988-cdc5f50c6019', alt: 'Close-up of the Essential Hoodie fabric' }
    ]
  },
  {
    id: 'vlr-sw-002',
    slug: 'heavyweight-crewneck',
    name: 'Heavyweight Crewneck',
    category: 'Sweatshirts',
    collection: 'Essentials',
    price: 52.99,
    originalPrice: null,
    badge: null,
    isNew: true,
    rating: 4.6,
    reviewCount: 41,
    stock: 44,
    shortDescription: 'A dense crewneck with a boxy shoulder and a ribbed, structured collar.',
    description:
      'A dense crewneck with a boxy shoulder and a ribbed, structured collar. Heavy enough to hold its shape, soft enough for daily wear.',
    highlights: ['480 GSM dense fleece', 'Boxy shoulder line', 'Structured ribbed collar'],
    sizes: sizes(),
    colors: [SWATCHES.offWhite, SWATCHES.slate, SWATCHES.sand].map((c) => ({ ...c })),
    images: [
      { id: '1756451182421-d2a1961638c9', alt: 'Model wearing the Heavyweight Crewneck on a gradient backdrop' },
      { id: '1643313260651-9c335822ecde', alt: 'Close-up of the Heavyweight Crewneck knit' }
    ]
  },
  {
    id: 'vlr-ts-001',
    slug: 'oversized-tee',
    name: 'Oversized Tee',
    category: 'T-Shirts',
    collection: 'Essentials',
    price: 29.99,
    originalPrice: 39.99,
    badge: 'Sale',
    isNew: false,
    rating: 4.4,
    reviewCount: 210,
    stock: 120,
    shortDescription: 'Heavy cotton tee with a dropped shoulder and a wide, clean neckline.',
    description:
      'Heavy cotton tee with a dropped shoulder and a wide, clean neckline. Cut long enough to sit over denim without riding up.',
    highlights: ['240 GSM combed cotton', 'Dropped shoulder, boxy body', 'Ribbed collar keeps its shape'],
    sizes: sizes(),
    colors: [SWATCHES.black, SWATCHES.offWhite, SWATCHES.sand].map((c) => ({ ...c })),
    images: [
      { id: '1715541448446-3369e1cc0ee9', alt: 'Model wearing the Oversized Tee in a studio setting' },
      { id: '1642618276983-51985a775142', alt: 'Oversized Tee styled with wide trousers' }
    ]
  },
  {
    id: 'vlr-ts-002',
    slug: 'relaxed-fit-tee',
    name: 'Relaxed Fit Tee',
    category: 'T-Shirts',
    collection: 'Essentials',
    price: 27.99,
    originalPrice: null,
    badge: null,
    isNew: false,
    rating: 4.3,
    reviewCount: 76,
    stock: 88,
    shortDescription: 'A soft everyday tee with a relaxed body and a slightly tapered waist.',
    description:
      'A soft everyday tee with a relaxed body and a slightly tapered waist. Breathable enough for warm days, substantial enough to stand alone.',
    highlights: ['Breathable 200 GSM cotton', 'Slightly tapered waist', 'Reinforced shoulder seams'],
    sizes: sizes({ S: false }),
    colors: [SWATCHES.offWhite, SWATCHES.lightGray].map((c) => ({ ...c })),
    images: [
      { id: '1616030257764-0fe6a2f05138', alt: 'Model wearing the Relaxed Fit Tee by the coast' }
    ]
  },
  {
    id: 'vlr-hd-005',
    slug: 'cropped-zip-hoodie',
    name: 'Cropped Zip Hoodie',
    category: 'Hoodies',
    collection: 'Street',
    price: 69.99,
    originalPrice: null,
    badge: null,
    isNew: true,
    rating: 4.7,
    reviewCount: 55,
    stock: 22,
    shortDescription: 'A cropped, boxy zip hoodie with a high collar and raw-edge hem.',
    description:
      'A cropped, boxy zip hoodie with a high collar and raw-edge hem. Built for layering over longer tees.',
    highlights: ['Cropped boxy silhouette', 'High funnel collar', 'Raw-edge hem finish'],
    sizes: sizes({ XXL: false }),
    colors: [SWATCHES.sand, SWATCHES.charcoal].map((c) => ({ ...c })),
    images: [
      { id: '1582164256364-b0eccb922bff', alt: 'Model wearing a cropped hoodie seated on the floor' }
    ]
  },
  {
    id: 'vlr-hd-006',
    slug: 'vintage-wash-hoodie',
    name: 'Vintage Wash Hoodie',
    category: 'Hoodies',
    collection: 'Street',
    price: 62.99,
    originalPrice: 79.99,
    badge: 'Sale',
    isNew: false,
    rating: 4.6,
    reviewCount: 118,
    stock: 0,
    shortDescription: 'Sun-faded wash with a lived-in feel and softened edges.',
    description:
      'Sun-faded wash with a lived-in feel and softened edges. Each piece is washed individually, so no two are identical.',
    highlights: ['Individual vintage wash', 'Softened raw edges', 'Tonal drawcord tips'],
    sizes: sizes({ S: false, XXL: false }),
    colors: [SWATCHES.slate, SWATCHES.sand].map((c) => ({ ...c })),
    images: [
      { id: '1633292750937-120a94f5c2bb', alt: 'Model wearing the Vintage Wash Hoodie against a painted wall' }
    ]
  },
  {
    id: 'vlr-sw-003',
    slug: 'structured-sweatshirt',
    name: 'Structured Sweatshirt',
    category: 'Sweatshirts',
    collection: 'Studio',
    price: 57.99,
    originalPrice: null,
    badge: null,
    isNew: false,
    rating: 4.5,
    reviewCount: 38,
    stock: 35,
    shortDescription: 'Tailored crew with a defined shoulder and a longer body.',
    description:
      'Tailored crew with a defined shoulder and a longer body. The cleanest silhouette in the collection, made to be worn alone.',
    highlights: ['Defined shoulder line', 'Longer body length', 'Matte, non-brushed finish'],
    sizes: sizes(),
    colors: [SWATCHES.offWhite, SWATCHES.navy].map((c) => ({ ...c })),
    images: [
      { id: '1715559522419-db7face19c1c', alt: 'Two models wearing the Structured Sweatshirt' }
    ]
  },
  {
    id: 'vlr-ts-003',
    slug: 'long-sleeve-essential-tee',
    name: 'Long Sleeve Essential Tee',
    category: 'T-Shirts',
    collection: 'Essentials',
    price: 34.99,
    originalPrice: null,
    badge: null,
    isNew: false,
    rating: 4.4,
    reviewCount: 51,
    stock: 64,
    shortDescription: 'The Essential Tee with a long sleeve and a ribbed cuff.',
    description:
      'The Essential Tee with a long sleeve and a ribbed cuff. A layering staple that works under hoodies and over the top of knitwear.',
    highlights: ['Ribbed cuffs', 'Straight body', 'Soft combed cotton'],
    sizes: sizes({ XXL: false }),
    colors: [SWATCHES.black, SWATCHES.offWhite].map((c) => ({ ...c })),
    images: [
      { id: '1642618277064-73c0bd608111', alt: 'Model wearing the Long Sleeve Essential Tee seated on a chair' }
    ]
  }
]

export const CATEGORIES = ['Hoodies', 'Sweatshirts', 'T-Shirts']
export const COLLECTIONS = ['Essentials', 'Street', 'Studio']
export const CURRENCY_CODE = 'USD'

export function getProductBySlug(slug) {
  return PRODUCTS.find((product) => product.slug === slug)
}

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id)
}

/** Products that share a collection or category with `product`, newest first. */
export function getRelatedProducts(product, limit = 4) {
  if (!product) return PRODUCTS.slice(0, limit)
  const scored = PRODUCTS.filter((p) => p.id !== product.id).map((p) => ({
    product: p,
    score:
      (p.collection === product.collection ? 2 : 0) + (p.category === product.category ? 1 : 0)
  }))
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product)
}

/** All in-stock size labels for the product's first colour, used by listings. */
export function defaultSize(product) {
  const preferred = product.sizes.find((s) => s.label === 'M' && s.available)
  return preferred || product.sizes.find((s) => s.available) || product.sizes[0]
}

export function defaultColor(product) {
  return product.colors[0]
}

/** Gallery images for a given colour, falling back to the product-level set. */
export function imagesForColor(product, colorName) {
  const swatch = product.colors.find((c) => c.name === colorName)
  if (swatch?.images?.length) return swatch.images
  return product.images || product.colors[0]?.images || []
}

export function isAvailable(product, colorName, sizeLabel) {
  const size = product.sizes.find((s) => s.label === sizeLabel)
  if (!size || !size.available) return false
  return product.stock > 0
}
