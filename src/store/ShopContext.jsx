import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getProductById, colorById, isColorSizeAvailable } from '../data/products'
import { SEED_REVIEWS } from '../data/reviews'
import { DEFAULT_CURRENCY, formatMoney } from '../lib/format'

/**
 * Single source of truth for shopping state: selected variants, cart, wishlist,
 * currency, orders and reviews.
 *
 * Persistence note: this repository ships no backend or database service, so all
 * of it is persisted in the visitor's own browser (localStorage). Nothing is sent
 * to a server.
 */
const KEYS = {
  cart: 'velora.cart.v1',
  wishlist: 'velora.wishlist.v1',
  variants: 'velora.variants.v1',
  orders: 'velora.orders.v1',
  currency: 'velora.currency.v1',
  reviews: 'velora.reviews.v1',
}

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — the session still works in memory */
  }
}

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => readStore(KEYS.currency, DEFAULT_CURRENCY))
  const [cart, setCart] = useState(() => readStore(KEYS.cart, []))
  const [wishlist, setWishlist] = useState(() => readStore(KEYS.wishlist, []))
  const [selections, setSelections] = useState(() => readStore(KEYS.variants, {}))
  const [orders, setOrders] = useState(() => readStore(KEYS.orders, []))
  const [localReviews, setLocalReviews] = useState(() => readStore(KEYS.reviews, []))
  const [toasts, setToasts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const timers = useRef(new Map())

  useEffect(() => writeStore(KEYS.cart, cart), [cart])
  useEffect(() => writeStore(KEYS.wishlist, wishlist), [wishlist])
  useEffect(() => writeStore(KEYS.variants, selections), [selections])
  useEffect(() => writeStore(KEYS.orders, orders), [orders])
  useEffect(() => writeStore(KEYS.reviews, localReviews), [localReviews])
  useEffect(() => writeStore(KEYS.currency, currency), [currency])

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((t) => clearTimeout(t))
      map.clear()
    }
  }, [])

  const dismissToast = useCallback((id) => {
    const t = timers.current.get(id)
    if (t) {
      clearTimeout(t)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (message, tone = 'default') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
      const timer = setTimeout(() => dismissToast(id), 4200)
      timers.current.set(id, timer)
    },
    [dismissToast],
  )

  const money = useCallback((value) => formatMoney(value, currency), [currency])

  const setCurrency = useCallback((next) => setCurrencyState(next), [])

  /* ---------------------------------------------------------------- variants */

  const getSelection = useCallback(
    (product) => {
      if (!product) return { colorId: null, size: null }
      const saved = selections[product.id] || {}
      const color = colorById(product, saved.colorId)
      const colorId = color?.id || product.colors[0]?.id || null
      let size = saved.size
      if (!size || !isColorSizeAvailable(product, colorId, size)) {
        size = product.sizes.find((s) => isColorSizeAvailable(product, colorId, s)) || product.sizes[0]
      }
      return { colorId, size }
    },
    [selections],
  )

  const setColor = useCallback(
    (product, colorId) => {
      if (!product) return
      setSelections((prev) => {
        const current = prev[product.id] || {}
        const keepSize = isColorSizeAvailable(product, colorId, current.size)
        const nextSize = keepSize
          ? current.size
          : product.sizes.find((s) => isColorSizeAvailable(product, colorId, s)) || current.size
        return { ...prev, [product.id]: { ...current, colorId, size: nextSize } }
      })
    },
    [],
  )

  const setSize = useCallback((product, size) => {
    if (!product) return
    setSelections((prev) => ({ ...prev, [product.id]: { ...(prev[product.id] || {}), size } }))
  }, [])

  /* -------------------------------------------------------------------- cart */

  const cartLines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = getProductById(line.productId)
          if (!product) return null
          const color = colorById(product, line.colorId)
          return {
            ...line,
            product,
            color,
            lineTotal: product.price * line.qty,
          }
        })
        .filter(Boolean),
    [cart],
  )

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart])
  const subtotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [cartLines],
  )

  const addToCart = useCallback(
    (product, colorId, size, qty = 1) => {
      if (!product) return false
      if (!isColorSizeAvailable(product, colorId, size)) {
        notify(`${size} is not available in ${colorById(product, colorId)?.name || 'this colour'}`, 'error')
        return false
      }
      const key = `${product.id}:${colorId}:${size}`
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
        }
        return [...prev, { key, productId: product.id, colorId, size, qty: Math.min(9, qty) }]
      })
      notify(`${product.name} · ${colorById(product, colorId)?.name} · ${size} added to bag`)
      return true
    },
    [notify],
  )

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l)),
    )
  }, [])

  const removeLine = useCallback((key) => {
    setCart((prev) => prev.filter((l) => l.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  /* ---------------------------------------------------------------- wishlist */

  const isWished = useCallback((productId) => wishlist.includes(productId), [wishlist])

  const toggleWishlist = useCallback(
    (product) => {
      if (!product) return
      setWishlist((prev) => {
        const has = prev.includes(product.id)
        notify(has ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`)
        return has ? prev.filter((id) => id !== product.id) : [...prev, product.id]
      })
    },
    [notify],
  )

  /* ------------------------------------------------------------------ orders */

  const placeOrder = useCallback(
    ({ customer, shippingMethod = 'standard' }) => {
      if (!cartLines.length) return null
      const shippingCost = subtotal >= 99 ? 0 : shippingMethod === 'express' ? 18 : 8
      const order = {
        id: `VLR-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        customer,
        shippingMethod,
        currency,
        items: cartLines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          colorId: l.colorId,
          colorName: l.color?.name,
          size: l.size,
          qty: l.qty,
          unitPrice: l.product.price,
        })),
        subtotal,
        shipping: shippingCost,
        total: subtotal + shippingCost,
      }
      setOrders((prev) => [order, ...prev])
      setCart([])
      return order
    },
    [cartLines, subtotal, currency],
  )

  /* ----------------------------------------------------------------- reviews */

  const addReview = useCallback((review) => {
    setLocalReviews((prev) => [
      { ...review, id: `local-${Date.now()}`, demo: false, local: true },
      ...prev,
    ])
  }, [])

  const reviewsFor = useCallback(
    (productId) => [...SEED_REVIEWS, ...localReviews].filter((r) => r.productId === productId),
    [localReviews],
  )

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      money,
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      isWished,
      toggleWishlist,
      getSelection,
      setColor,
      setSize,
      orders,
      placeOrder,
      reviewsFor,
      addReview,
      toasts,
      notify,
      dismissToast,
    }),
    [
      currency,
      setCurrency,
      money,
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      cartOpen,
      wishlist,
      isWished,
      toggleWishlist,
      getSelection,
      setColor,
      setSize,
      orders,
      placeOrder,
      reviewsFor,
      addReview,
      toasts,
      notify,
      dismissToast,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}
