import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { imagesForColor } from '../data/products.js'
import { CURRENCIES, getCurrency } from './currency.js'

/**
 * Single store for cart, wishlist, display currency, toast messages and the
 * global overlays (cart drawer, search, mobile navigation).
 *
 * Persistence uses localStorage only — never passwords or payment details.
 * Cart line prices are captured in USD at the time the item is added, so the
 * cart, drawer and checkout summary can never disagree about a line total.
 */

const STORAGE = {
  cart: 'velora.cart.v1',
  wishlist: 'velora.wishlist.v1',
  currency: 'velora.currency.v1'
}

const StoreContext = createContext(null)

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked — the session still works in memory */
  }
}

export function variantKey(productId, colorName, sizeLabel) {
  return `${productId}::${colorName}::${sizeLabel}`
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(STORAGE.cart, []))
  const [wishlist, setWishlist] = useState(() => readStorage(STORAGE.wishlist, []))
  const [currencyCode, setCurrencyCode] = useState(() => readStorage(STORAGE.currency, 'USD'))
  const [toasts, setToasts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')
  const toastId = useRef(0)

  const currency = useMemo(() => getCurrency(currencyCode), [currencyCode])

  useEffect(() => writeStorage(STORAGE.cart, cart), [cart])
  useEffect(() => writeStorage(STORAGE.wishlist, wishlist), [wishlist])
  useEffect(() => writeStorage(STORAGE.currency, currencyCode), [currencyCode])

  /** Lock body scroll while any overlay is open. */
  const overlayOpen = cartOpen || searchOpen || navOpen
  useEffect(() => {
    if (!overlayOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [overlayOpen])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast) => {
      toastId.current += 1
      const id = toastId.current
      setToasts((current) => [...current.slice(-2), { id, tone: 'default', ...toast }])
      window.setTimeout(() => dismissToast(id), toast.duration || 4200)
    },
    [dismissToast]
  )

  const addToCart = useCallback(
    (product, { color, size, quantity = 1 }) => {
      const key = variantKey(product.id, color, size)
      const image = imagesForColor(product, color)[0]
      setCart((current) => {
        const existing = current.find((line) => line.key === key)
        if (existing) {
          return current.map((line) =>
            line.key === key ? { ...line, quantity: Math.min(line.quantity + quantity, 99) } : line
          )
        }
        return [
          ...current,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            color,
            size,
            unitPrice: product.price,
            image: image ? { id: image.id, alt: image.alt } : null,
            quantity
          }
        ]
      })
      return key
    },
    []
  )

  const updateQuantity = useCallback((key, quantity) => {
    setCart((current) =>
      current.map((line) => (line.key === key ? { ...line, quantity: Math.max(1, Math.min(quantity, 99)) } : line))
    )
  }, [])

  const removeFromCart = useCallback((key) => {
    setCart((current) => current.filter((line) => line.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((productId) => {
    let added = false
    setWishlist((current) => {
      added = !current.includes(productId)
      return added ? [...current, productId] : current.filter((id) => id !== productId)
    })
    return added
  }, [])

  const setCurrency = useCallback((code) => {
    if (CURRENCIES.some((c) => c.code === code)) setCurrencyCode(code)
  }, [])

  const cartCount = useMemo(() => cart.reduce((total, line) => total + line.quantity, 0), [cart])
  const subtotalUSD = useMemo(
    () => cart.reduce((total, line) => total + line.unitPrice * line.quantity, 0),
    [cart]
  )

  const announce = useCallback((message) => setLiveMessage(message), [])

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      subtotalUSD,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted: (productId) => wishlist.includes(productId),
      currency,
      setCurrency,
      toasts,
      pushToast,
      dismissToast,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      navOpen,
      setNavOpen,
      liveMessage,
      announce
    }),
    [
      cart,
      cartCount,
      subtotalUSD,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      currency,
      setCurrency,
      toasts,
      pushToast,
      dismissToast,
      cartOpen,
      searchOpen,
      navOpen,
      liveMessage,
      announce
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside a StoreProvider')
  return context
}
