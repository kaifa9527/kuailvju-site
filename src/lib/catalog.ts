export type Language = 'zh' | 'en'

export type SearchFilters = {
  city?: string
  region?: string
  term?: string
}

type SearchableListing = {
  city: string
  region: string
  terms: readonly string[]
}

type ExchangeListing = {
  management: string
  exchangeAuthorized: boolean
  exchangeOpen: boolean
}

type PricedListing = {
  price: number
  currency: string
  priceUnit: string
}

export function filterListings<T extends SearchableListing>(items: readonly T[], filters: SearchFilters): T[] {
  return items.filter((item) =>
    (!filters.city || filters.city === 'all' || item.city === filters.city) &&
    (!filters.region || filters.region === 'all' || item.region === filters.region) &&
    (!filters.term || filters.term === 'all' || item.terms.includes(filters.term)),
  )
}

export function canExchange(listing: ExchangeListing): boolean {
  return listing.management === 'operated' && listing.exchangeAuthorized && listing.exchangeOpen
}

export function sortFeaturedListings<T extends { id: string; pinned: boolean; publishedAt: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) =>
    Number(b.pinned) - Number(a.pinned) ||
    b.publishedAt.localeCompare(a.publishedAt) ||
    a.id.localeCompare(b.id),
  )
}

export function formatPrice(listing: PricedListing, language: Language): string {
  const money = new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: listing.currency,
    maximumFractionDigits: 0,
  }).format(listing.price)
  const unit = language === 'zh'
    ? { day: '天', month: '月', quarter: '季', year: '年' }[listing.priceUnit] || listing.priceUnit
    : listing.priceUnit
  return `${money} / ${unit}`
}

export type LeasePaymentOption = 'one-two' | 'two-one'

export function estimateLeaseMoveIn(monthlyRent: number, leaseMonths: number, option: LeasePaymentOption) {
  if (!Number.isFinite(monthlyRent) || monthlyRent <= 0 || !Number.isInteger(leaseMonths) || leaseMonths < 2) return null
  const deposit = monthlyRent * (option === 'one-two' ? 1 : 2)
  const prepaidRent = monthlyRent * (option === 'one-two' ? 2 : 1)
  return { deposit, prepaidRent, initialDue: deposit + prepaidRent }
}
