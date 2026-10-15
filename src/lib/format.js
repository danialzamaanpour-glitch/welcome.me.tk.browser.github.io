import { convertFromUSD } from './currency.js'

/** Join class names, dropping falsy values. */
export function cn(...values) {
  return values.filter(Boolean).join(' ')
}

/** Format a USD base amount into the active display currency. */
export function formatMoney(amountUSD, currency) {
  const amount = convertFromUSD(amountUSD, currency)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency.code === 'JPY' ? 0 : 2
  }).format(amount)
}

/** Discount percentage from real prices, or null when there is no saving. */
export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

/** 2026-09-28 -> Sep 28, 2026 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
