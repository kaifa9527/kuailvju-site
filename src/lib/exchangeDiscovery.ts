import type { Listing } from '../data.ts'
import { canExchange } from './catalog.ts'
import { validRange, type DateRange } from './testWorkflow.ts'

export type ExchangeSearch = {
  city: string; region: string; start: string; end: string; guests: number;
  type: 'all' | 'apartment' | 'villa'; bedrooms: number; beds: number; baths: number;
  amenities: AmenityFilter[]
}

export type AmenityFilter = 'pool' | 'parking' | 'wifi' | 'climate' | 'view'
const amenityFilters: AmenityFilter[] = ['pool', 'parking', 'wifi', 'climate', 'view']
const amenityPatterns: Record<AmenityFilter, RegExp> = {
  pool: /泳池|pool/i, parking: /停车|parking/i, wifi: /网络|wi-fi/i,
  climate: /空调|air conditioning/i, view: /海景|sea.view|sea-facing/i,
}

export const emptyExchangeSearch: ExchangeSearch = { city: 'all', region: 'all', start: '', end: '', guests: 1, type: 'all', bedrooms: 0, beds: 0, baths: 0, amenities: [] }

const dayMs = 86_400_000
const dayNumber = (date: string) => Date.parse(`${date}T00:00:00Z`) / dayMs
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Concept inventory only: stable, rotating example blocks let visitors exercise date filtering.
export function demoBlockedDates(listingId: string, today = localDate()): string[] {
  const offsets: Record<string, number[]> = {
    'pattaya-sea-view': [6, 7, 8, 20, 21],
    'sanya-garden-villa': [12, 13, 14, 15, 30, 31],
    'pattaya-north-two-bedroom': [3, 4, 18, 19],
    'pattaya-jomtien-pool-villa': [10, 11, 24, 25],
    'sanya-yalong-apartment': [5, 6, 17, 18],
    'beihai-qiaogang-stay': [8, 9, 22, 23],
  }
  const base = dayNumber(today)
  return (offsets[listingId] || []).map(offset => new Date((base + offset) * dayMs).toISOString().slice(0, 10))
}

export function demoAvailable(listingId: string, range: DateRange, today = localDate()): boolean {
  if (!validRange(range) || range.start < today) return false
  return demoBlockedDates(listingId, today).every(day => day < range.start || day >= range.end)
}

export function parseExchangeSearch(params: URLSearchParams): ExchangeSearch {
  const positive = (key: string, fallback: number) => { const value = Number(params.get(key)); return Number.isInteger(value) && value >= fallback && value <= 20 ? value : fallback }
  return {
    city: params.get('city') || 'all', region: params.get('region') || 'all',
    start: params.get('start') || '', end: params.get('end') || '', guests: positive('guests', 1),
    type: params.get('type') === 'villa' ? 'villa' : params.get('type') === 'apartment' ? 'apartment' : 'all',
    bedrooms: positive('bedrooms', 0), beds: positive('beds', 0), baths: positive('baths', 0),
    amenities: [...new Set([...params.getAll('amenity'), ...params.getAll('amenities')])].filter((value): value is AmenityFilter => amenityFilters.includes(value as AmenityFilter)),
  }
}

export function exchangeQuery(search: ExchangeSearch): string {
  const params = new URLSearchParams()
  if (search.city !== 'all') params.set('city', search.city)
  if (search.region !== 'all') params.set('region', search.region)
  if (search.start) params.set('start', search.start)
  if (search.end) params.set('end', search.end)
  if (search.guests > 1) params.set('guests', String(search.guests))
  if (search.type !== 'all') params.set('type', search.type)
  if (search.bedrooms) params.set('bedrooms', String(search.bedrooms))
  if (search.beds) params.set('beds', String(search.beds))
  if (search.baths) params.set('baths', String(search.baths))
  search.amenities.forEach(amenity => params.append('amenity', amenity))
  return params.size ? `?${params}` : ''
}

export function filterExchangeHomes(homes: Listing[], search: ExchangeSearch, today = localDate(), kind: 'exchange' | 'stays' = 'exchange'): Listing[] {
  const range = { start: search.start, end: search.end }
  return homes.filter(home => (kind === 'stays' ? home.management === 'operated' : canExchange(home))
    && (search.city === 'all' || home.city === search.city)
    && (search.region === 'all' || home.region === search.region)
    && home.guests >= search.guests
    && (search.type === 'all' || (search.type === 'villa' ? /别墅|villa/i : /公寓|flat|apartment/i).test(home.type.zh + home.type.en))
    && home.bedrooms >= search.bedrooms && home.beds >= search.beds && home.bathrooms >= search.baths
    && search.amenities.every(amenity => home.amenities.some(item => amenityPatterns[amenity].test(item.zh + item.en)))
    && (!search.start || demoAvailable(home.id, range, today)))
}
