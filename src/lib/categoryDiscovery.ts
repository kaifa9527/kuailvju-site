import type { Listing } from '../data.ts'
import { filterListings, sortFeaturedListings } from './catalog.ts'
import { filterExchangeHomes, localDate, parseExchangeSearch } from './exchangeDiscovery.ts'
import { leaseRange, propertyAvailable } from './inventory.ts'
import { readTestRequests, type TestRequest } from './testWorkflow.ts'

export type ListingCategory = 'rentals' | 'stays' | 'exchange'

// Single source of truth: URL query -> eligible listings -> recommendation sort.
// Never substitute a nearby city if the visitor explicitly selected a destination.
export function findCategoryListings(
  mode: ListingCategory,
  query: string,
  inventory: readonly Listing[],
  today = localDate(),
  requests: readonly TestRequest[] = readTestRequests(),
): Listing[] {
  const params = new URLSearchParams(query)
  if (mode !== 'rentals') {
    return sortFeaturedListings(filterExchangeHomes(
      [...inventory], parseExchangeSearch(params), today, mode,
    ))
  }

  const city = params.get('city') || 'all'
  const region = params.get('region') || 'all'
  const term = params.get('term') || 'all'
  const moveIn = params.get('moveIn') || ''
  const eligible = filterListings(
    inventory.filter(home => home.management === 'leased'),
    { city, region, term },
  )
  if (!moveIn) return sortFeaturedListings(eligible)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(moveIn) || moveIn < today) return []

  return sortFeaturedListings(eligible.filter(home => {
    const terms = term === 'all' ? home.terms.filter(value => value === 'halfYear' || value === 'year') : [term]
    return terms.some(choice => {
      const range = leaseRange(moveIn, choice)
      // Long-term tentative dates use explicit confirmed test holds, not the
      // short-stay demo calendar's scattered blocked nights.
      return Boolean(range && propertyAvailable(home.id, range, requests))
    })
  }))
}
