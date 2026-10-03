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
