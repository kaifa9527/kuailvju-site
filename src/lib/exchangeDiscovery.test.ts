import test from 'node:test'
import assert from 'node:assert/strict'
import { listings } from '../data.ts'
import { demoAvailable, demoBlockedDates, emptyExchangeSearch, exchangeQuery, filterExchangeHomes, parseExchangeSearch } from './exchangeDiscovery.ts'

const today = '2026-10-04'
const dateAfter = (offset: number) => new Date(Date.parse(`${today}T00:00:00Z`) + offset * 86_400_000).toISOString().slice(0, 10)

test('exchange discovery applies capacity, type, amenities and destination together', () => {
  const found = filterExchangeHomes(listings, { ...emptyExchangeSearch, city: 'sanya', guests: 5, type: 'villa', bedrooms: 3, amenities: ['pool'] }, today)
  assert.deepEqual(found.map(item => item.id), ['sanya-garden-villa'])
})

test('demo date filtering excludes a home only when an occupied night intersects its blocks', () => {
  assert.ok(demoBlockedDates('pattaya-sea-view', today).includes(dateAfter(6)))
  assert.equal(demoAvailable('pattaya-sea-view', { start: dateAfter(5), end: dateAfter(6) }, today), true)
  assert.equal(demoAvailable('pattaya-sea-view', { start: dateAfter(5), end: dateAfter(7) }, today), false)
  assert.equal(demoAvailable('pattaya-sea-view', { start: dateAfter(-1), end: dateAfter(1) }, today), false)
})

test('exchange search survives its URL query round trip', () => {
  const desired = { ...emptyExchangeSearch, city: 'pattaya', region: 'jomtien', start: dateAfter(2), end: dateAfter(4), guests: 4, type: 'villa' as const, bedrooms: 2, beds: 2, baths: 2, amenities: ['pool'] as const }
  assert.deepEqual(parseExchangeSearch(new URLSearchParams(exchangeQuery(desired).slice(1))), desired)
})
