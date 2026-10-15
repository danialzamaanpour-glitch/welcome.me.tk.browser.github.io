export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD $' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR €' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP £' },
}

export const DEFAULT_CURRENCY = 'USD'

/**
 * Prices are held in USD; other currencies are a display conversion using the
 * static rates above (no live FX feed exists in this repository).
 */
export function formatMoney(value, currency = DEFAULT_CURRENCY) {
  const c = CURRENCIES[currency] || CURRENCIES.USD
  const amount = value * c.rate
  return `${c.symbol}${amount.toFixed(2)}`
}

export function discountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return null
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}
