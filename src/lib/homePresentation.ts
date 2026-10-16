export const PREVIEW_LIMIT = 8

export function previewListings<T>(listings: readonly T[], limit = PREVIEW_LIMIT): T[] {
  return listings.slice(0, Math.max(0, limit))
}

export function groupListingsByCity<T extends { city: string }>(
  listings: readonly T[],
  cities: readonly { id: string }[],
): { city: string; listings: T[] }[] {
  return cities.map(city => ({
    city: city.id,
    listings: listings.filter(listing => listing.city === city.id),
  })).filter(group => group.listings.length > 0)
}
