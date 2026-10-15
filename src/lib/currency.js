/**
 * Display currencies.
 *
 * Base prices in the catalog are USD. The rates below are illustrative
 * conversion factors for the storefront demo — they are not live FX rates and
 * are never used to charge anyone.
 */
export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1 },
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 0.92 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 0.79 },
  { code: 'CAD', symbol: '$', label: 'CAD $', rate: 1.36 },
  { code: 'AUD', symbol: '$', label: 'AUD $', rate: 1.52 },
  { code: 'JPY', symbol: '¥', label: 'JPY ¥', rate: 152 }
]

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]
}

export function convertFromUSD(amountUSD, currency) {
  const converted = amountUSD * currency.rate
  // Yen is conventionally shown without decimals.
  return currency.code === 'JPY' ? Math.round(converted) : converted
}
