/**
 * VELORA catalogue.
 *
 * Single source of truth for product data. Prices are USD base values; other
 * currencies are display conversions (see src/lib/format.js).
 *
 * Honesty note: this repository contains no supplier feed, inventory system or
 * verified specification sheet, so the copy stays qualitative and mirrors the
 * supplied VELORA reference rather than inventing fabric weights or composition.
 */

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

const fullRange = { S: true, M: true, L: true, XL: true, XXL: true }
const range = (overrides) => ({ ...fullRange, ...overrides })

export const PRODUCTS = [
  {
    id: 'essential-oversized-hoodie',
    slug: 'essential-oversized-hoodie',
    name: 'Essential Oversized Hoodie',
    tagline: 'Everyday comfort. Elevated form.',
    kind: 'hoodie',
    category: 'Hoodies',
    collections: ['essentials', 'monochrome'],
    price: 59.99,
    compareAt: 89.99,
    rating: 4.8,
    reviewCount: 128,
    badge: 'New Arrival',
    isNew: true,
    has3D: true,
    featured: true,
    shortDescription:
      'Premium heavyweight cotton hoodie with an oversized fit for ultimate comfort and modern style.',
    bullets: [
      'Oversized fit',
      'Soft & heavyweight fabric',
      'Adjustable drawstring hood',
      'Ribbed cuffs and hem',
      'Unisex style',
    ],
    tabs: {
      details:
        'Crafted from high-quality heavyweight cotton, this hoodie delivers unmatched comfort and durability. The oversized fit and minimal design make it a versatile staple for any wardrobe.',
      materials:
        'The hoodie is built around a dense, soft-touch cotton fleece with a brushed inner face. Ribbed knit trims finish the cuffs and hem, while the hood is lined for structure that holds its shape.',
      sizeAndFit:
        'Oversized, boxy silhouette with dropped shoulders. The model in this presentation is a garment render, not a fit model — check the size guide below for measured garment dimensions.',
      shipping:
        'Free shipping on orders over $99. Standard delivery 3–5 business days, express 1–2 business days. 30-day returns on unworn items with original packaging.',
    },
    colors: [
      {
        id: 'charcoal',
        name: 'Charcoal Gray',
        hex: '#292A2D',
        sizes: range(),
      },
      {
        id: 'light-gray',
        name: 'Light Gray',
        hex: '#D5D2CD',
        sizes: range({ XXL: false }),
      },
      {
        id: 'cream',
        name: 'Cream',
        hex: '#E9E1D4',
        sizes: range({ S: false, XL: false, XXL: false }),
      },
      {
        id: 'black',
        name: 'Black',
        hex: '#0D0D0F',
        sizes: range({ S: false }),
      },
    ],
    sizes: SIZES,
  },
  {
    id: 'minimal-hoodie',
    slug: 'minimal-hoodie',
    name: 'Minimal Hoodie',
    tagline: 'Reduced to the essentials.',
    kind: 'hoodie',
    category: 'Hoodies',
    collections: ['essentials'],
    price: 54.99,
    compareAt: null,
    rating: 4.6,
    reviewCount: 74,
    badge: null,
    isNew: false,
    has3D: false,
    shortDescription: 'A pared-back hoodie in a warm tan with the same oversized proportion.',
    bullets: ['Oversized fit', 'Soft brushed inner face', 'Ribbed trims', 'Unisex style'],
    tabs: {
      details:
        'The Minimal Hoodie strips the silhouette back: one colour, one proportion, no extra detailing. A soft brushed fleece body with ribbed trims keeps it wearable every day.',
      materials:
        'Soft-touch cotton fleece with a lightly brushed inner face and ribbed knit trims at the cuffs and hem.',
      sizeAndFit: 'Oversized, boxy fit with dropped shoulders. Size down for a closer silhouette.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [
      { id: 'tan', name: 'Tan', hex: '#C2A283', sizes: range() },
      { id: 'charcoal', name: 'Charcoal Gray', hex: '#292A2D', sizes: range() },
    ],
    sizes: SIZES,
  },
  {
    id: 'classic-sweatshirt',
    slug: 'classic-sweatshirt',
    name: 'Classic Sweatshirt',
    tagline: 'The everyday crew.',
    kind: 'sweatshirt',
    category: 'Sweatshirts',
    collections: ['monochrome'],
    price: 49.99,
    compareAt: 64.99,
    rating: 4.7,
    reviewCount: 96,
    badge: 'Sale',
    isNew: false,
    has3D: false,
    shortDescription: 'A clean crew-neck sweatshirt in deep black with a relaxed shoulder line.',
    bullets: ['Relaxed fit', 'Ribbed crew neck', 'Soft & heavyweight fabric', 'Unisex style'],
    tabs: {
      details:
        'A classic crew silhouette with a relaxed shoulder and a clean ribbed collar. Deep black, minimal detailing, built to sit alongside the rest of the collection.',
      materials: 'Soft-touch cotton fleece with ribbed knit collar, cuffs and hem.',
      sizeAndFit: 'Relaxed regular fit. True to size.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [
      { id: 'black', name: 'Black', hex: '#0D0D0F', sizes: range() },
      { id: 'mid-gray', name: 'Mid Gray', hex: '#A6A6A6', sizes: range({ XXL: false }) },
    ],
    sizes: SIZES,
  },
  {
    id: 'zip-up-hoodie',
    slug: 'zip-up-hoodie',
    name: 'Zip Up Hoodie',
    tagline: 'Layer it your way.',
    kind: 'zipup',
    category: 'Hoodies',
    collections: ['studio-layers'],
    price: 64.99,
    compareAt: null,
    rating: 4.5,
    reviewCount: 41,
    badge: null,
    isNew: false,
    has3D: false,
    shortDescription: 'A beige full-zip hoodie with a clean placket and metal zip.',
    bullets: ['Full-length zip', 'Oversized fit', 'Ribbed cuffs and hem', 'Unisex style'],
    tabs: {
      details:
        'The Zip Up Hoodie adds a full-length placket to the oversized shape, so it works open over a tee or closed on its own.',
      materials: 'Soft-touch cotton fleece with a metal zip and ribbed knit trims.',
      sizeAndFit: 'Oversized, boxy fit with dropped shoulders.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [
      { id: 'beige', name: 'Beige', hex: '#DCC9AE', sizes: range() },
      { id: 'charcoal', name: 'Charcoal Gray', hex: '#292A2D', sizes: range() },
    ],
    sizes: SIZES,
  },
  {
    id: 'essential-hoodie',
    slug: 'essential-hoodie',
    name: 'Essential Hoodie',
    tagline: 'The shorter cut.',
    kind: 'hoodie',
    category: 'Hoodies',
    collections: ['essentials', 'monochrome'],
    price: 59.99,
    compareAt: null,
    rating: 4.8,
    reviewCount: 63,
    badge: null,
    isNew: false,
    has3D: false,
    shortDescription: 'The Essential Hoodie in black with a slightly shorter body length.',
    bullets: ['Oversized fit', 'Structured hood', 'Ribbed cuffs and hem', 'Unisex style'],
    tabs: {
      details:
        'Same fabric, same oversized shoulder, a slightly shorter body that sits higher on the hip.',
      materials: 'Soft-touch cotton fleece with a lined hood and ribbed knit trims.',
      sizeAndFit: 'Oversized fit with a shorter body length.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [{ id: 'black', name: 'Black', hex: '#0D0D0F', sizes: range() }],
    sizes: SIZES,
  },
  {
    id: 'studio-tee',
    slug: 'studio-tee',
    name: 'Studio Tee',
    tagline: 'A clean base layer.',
    kind: 'tee',
    category: 'Tees',
    collections: ['essentials'],
    price: 34.99,
    compareAt: null,
    rating: 4.4,
    reviewCount: 52,
    badge: null,
    isNew: false,
    has3D: false,
    shortDescription: 'A heavyweight cotton tee in soft white with a boxy body.',
    bullets: ['Boxy fit', 'Heavyweight cotton', 'Ribbed neck trim', 'Unisex style'],
    tabs: {
      details: 'A boxy, heavyweight tee that holds its shape and layers cleanly under the hoodies.',
      materials: 'Heavyweight cotton jersey with a ribbed neck trim.',
      sizeAndFit: 'Boxy, relaxed fit. True to size.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [
      { id: 'soft-white', name: 'Soft White', hex: '#F4F3F1', sizes: range() },
      { id: 'charcoal', name: 'Charcoal Gray', hex: '#292A2D', sizes: range() },
    ],
    sizes: SIZES,
  },
  {
    id: 'oversized-crew',
    slug: 'oversized-crew',
    name: 'Oversized Crew',
    tagline: 'Volume, held.',
    kind: 'sweatshirt',
    category: 'Sweatshirts',
    collections: ['studio-layers'],
    price: 69.99,
    compareAt: null,
    rating: 4.6,
    reviewCount: 38,
    badge: 'New Arrival',
    isNew: true,
    has3D: false,
    shortDescription: 'A light gray crew with exaggerated volume through the body.',
    bullets: ['Oversized fit', 'Dropped shoulders', 'Ribbed crew neck', 'Unisex style'],
    tabs: {
      details: 'An oversized crew cut with volume through the body and dropped shoulders.',
      materials: 'Soft-touch cotton fleece with ribbed knit trims.',
      sizeAndFit: 'Oversized fit with dropped shoulders.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [{ id: 'light-gray', name: 'Light Gray', hex: '#D5D2CD', sizes: range() }],
    sizes: SIZES,
  },
  {
    id: 'layered-longsleeve',
    slug: 'layered-longsleeve',
    name: 'Layered Longsleeve',
    tagline: 'The quiet middle layer.',
    kind: 'tee',
    category: 'Tees',
    collections: ['studio-layers'],
    price: 44.99,
    compareAt: null,
    rating: 4.3,
    reviewCount: 27,
    badge: null,
    isNew: false,
    has3D: false,
    shortDescription: 'A mid gray long sleeve cut to layer under the oversized silhouettes.',
    bullets: ['Regular fit', 'Soft jersey hand feel', 'Ribbed cuffs', 'Unisex style'],
    tabs: {
      details: 'A straight-cut long sleeve in mid gray, designed to sit close under the oversized layers.',
      materials: 'Soft cotton jersey with ribbed cuffs.',
      sizeAndFit: 'Regular fit. True to size.',
      shipping: 'Free shipping on orders over $99. 30-day returns on unworn items.',
    },
    colors: [{ id: 'mid-gray', name: 'Mid Gray', hex: '#A6A6A6', sizes: range() }],
    sizes: SIZES,
  },
]

export const COLLECTIONS = [
  {
    id: 'essentials',
    name: 'Essentials',
    description: 'The permanent pieces: one silhouette, refined until nothing is left to remove.',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Deep black, charcoal and gray, held together by proportion alone.',
  },
  {
    id: 'studio-layers',
    name: 'Studio Layers',
    description: 'Open shapes and full zips built to move over everything else in the wardrobe.',
  },
]

export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug) || null
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id) || null

export const FLAGSHIP_SLUG = 'essential-oversized-hoodie'

export const RELATED_PRODUCTS = ['minimal-hoodie', 'classic-sweatshirt', 'zip-up-hoodie', 'essential-hoodie']
  .map(getProductById)
  .filter(Boolean)

export const colorById = (product, colorId) =>
  (product?.colors || []).find((c) => c.id === colorId) || product?.colors?.[0] || null

export const isColorSizeAvailable = (product, colorId, size) => {
  const color = colorById(product, colorId)
  if (!color) return false
  return Boolean(color.sizes?.[size])
}
