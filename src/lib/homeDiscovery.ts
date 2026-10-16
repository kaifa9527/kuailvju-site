export type HomeMode = 'rentals' | 'stays' | 'exchange' | 'roam'
export type RoamCategory = 'all' | 'attractions' | 'tickets' | 'experiences'

export type HomeSearch = {
  city: string
  region: string
  start: string
  end: string
  term: 'all' | 'halfYear' | 'year'
  guests: number
  category: RoamCategory
}

export const initialHomeSearch: HomeSearch = {
  city: 'all', region: 'all', start: '', end: '', term: 'all', guests: 1, category: 'all',
}

export function makeHomeSearchHash(mode: HomeMode, search: HomeSearch, today: string): string {
  const params = new URLSearchParams()
  if (search.city !== 'all') params.set('city', search.city)
  if (mode !== 'roam' && search.region !== 'all' && search.city !== 'all') params.set('region', search.region)

  const validDay = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const parsed = Date.parse(`${value}T00:00:00Z`)
    return !Number.isNaN(parsed) && new Date(parsed).toISOString().slice(0, 10) === value
  }
  if (mode === 'rentals') {
    if (search.start) {
      if (!validDay(search.start) || search.start < today) throw new Error('invalid-date')
      params.set('moveIn', search.start)
    }
    if (search.term !== 'all') params.set('term', search.term)
  } else if (mode === 'roam') {
    if (search.category !== 'all') params.set('category', search.category)
    if (search.start) {
      if (!validDay(search.start) || search.start < today) throw new Error('invalid-date')
      params.set('date', search.start)
    }
  } else {
    if (search.start || search.end) {
      if (!validDay(search.start) || !validDay(search.end) || search.start < today || search.end <= search.start) {
        throw new Error('invalid-date-range')
      }
      params.set('start', search.start)
      params.set('end', search.end)
    }
    if (!Number.isInteger(search.guests) || search.guests < 1 || search.guests > 20) throw new Error('invalid-guests')
    if (search.guests > 1) params.set('guests', String(search.guests))
  }
  return `#/${mode}${params.size ? `?${params}` : ''}`
}
