export type Language = 'zh' | 'en'

export type SearchFilters = {
  city?: string
  region?: string
  type?: string
  term?: string
  guestsMin?: string
  bedroomsMin?: string
  areaMin?: string
}

type SearchableListing = {
  city: string
  region: string
  type?: { zh: string; en: string }
  terms: readonly string[]
  guests?: number
  bedrooms?: number
  area?: number
}

function propertyCategory(type?: { zh: string; en: string }): string {
  const text = `${type?.zh || ''} ${type?.en || ''}`.toLowerCase()
  if (/别墅|villa/.test(text)) return 'villa'
  if (/公寓|apartment|flat/.test(text)) return 'apartment'
  return 'residential'
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
    (!filters.type || filters.type === 'all' || propertyCategory(item.type) === filters.type) &&
    (!filters.term || filters.term === 'all' || item.terms.includes(filters.term)) &&
    (!filters.guestsMin || filters.guestsMin === 'all' || (item.guests || 0) >= Number(filters.guestsMin)) &&
    (!filters.bedroomsMin || filters.bedroomsMin === 'all' || (item.bedrooms || 0) >= Number(filters.bedroomsMin)) &&
    (!filters.areaMin || filters.areaMin === 'all' || (item.area || 0) >= Number(filters.areaMin)),
  )
}

export function canExchange(listing: ExchangeListing): boolean {
  return ['operated', 'leased'].includes(listing.management) && listing.exchangeAuthorized && listing.exchangeOpen
}

export function longRentalMonthlyPrice(baseMonthlyRent: number, term: 'halfYear' | 'year'): number {
  return Math.round(baseMonthlyRent * (term === 'halfYear' ? 1.1 : 1))
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
    ? { day: '天', month: '月', quarter: '季', halfYear: '半年', year: '年' }[listing.priceUnit] || listing.priceUnit
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
