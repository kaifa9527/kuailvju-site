// Lightweight deterministic discovery. Filter eligibility before calling these functions.
// No IP geolocation, inferred location, fake engagement signals or exchange-rate guesses.
export type SortMode = 'recommended' | 'newest' | 'price-asc' | 'price-desc'

export type RankedListing = {
  id: string
  city: string
  pinned: boolean
  publishedAt: string
  price: number
  currency: string
  priceUnit: string
  gallery: readonly { image: string }[]
  amenities: readonly unknown[]
  features: readonly unknown[]
}

export function parseSortMode(input: string | null): SortMode {
  if (input === 'newest' || input === 'price-asc' || input === 'price-desc') return input
  return 'recommended'
}

export function supportsPriceSort<T extends RankedListing>(items: readonly T[]): boolean {
  // Comparing unconverted THB against CNY, or monthly against nightly rates, is misleading.
  return items.length > 0 && items.every(item =>
    item.currency === items[0].currency && item.priceUnit === items[0].priceUnit
    && Number.isFinite(item.price) && item.price >= 0,
  )
}

function score(item: RankedListing): number {
  // Deliberately simple V1 editorial score. These are completeness signals, NOT reviews or verification.
  return (item.pinned ? 100 : 0)
    + Math.min(item.gallery.length, 4) * 5
    + Math.min(item.amenities.length, 8)
    + Math.min(item.features.length, 5)
}

function compareFeatured(a: RankedListing, b: RankedListing): number {
  return score(b) - score(a) || b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id)
}

export function recommendedListings<T extends RankedListing>(items: readonly T[]): T[] {
  // Balanced city rotation. Pick the strongest eligible listing from the least exposed city.
  // Once one city runs out, fill remaining positions with available listings from other cities.
  const queues = new Map<string, T[]>()
  for (const item of items) {
    const list = queues.get(item.city) || []
    list.push(item)
    queues.set(item.city, list)
  }
  for (const queue of queues.values()) queue.sort(compareFeatured)
  const shown = new Map<string, number>()
  const output: T[] = []
  while (output.length < items.length) {
    const active = [...queues].filter(([, queue]) => queue.length)
    if (!active.length) break
    const minShown = Math.min(...active.map(([city]) => shown.get(city) || 0))
    active.sort(([cityA, queueA], [cityB, queueB]) =>
      (shown.get(cityA) || 0) - (shown.get(cityB) || 0)
      || compareFeatured(queueA[0], queueB[0])
      || cityA.localeCompare(cityB),
    )
    const [city, queue] = active.find(([name]) => (shown.get(name) || 0) === minShown)!
    output.push(queue.shift()!)
    shown.set(city, (shown.get(city) || 0) + 1)
  }
  return output
}

export function sortDiscoveryListings<T extends RankedListing>(
  items: readonly T[], mode: SortMode,
): T[] {
  if (mode === 'recommended') return recommendedListings(items)
  if (mode === 'newest') {
    return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id))
  }
  if (!supportsPriceSort(items)) return recommendedListings(items)
  const ascending = mode === 'price-asc'
  return [...items].sort((a, b) =>
    (ascending ? a.price - b.price : b.price - a.price)
    || b.publishedAt.localeCompare(a.publishedAt)
    || a.id.localeCompare(b.id),
  )
}
