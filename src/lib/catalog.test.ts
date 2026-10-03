import test from 'node:test'
import assert from 'node:assert/strict'
import { canExchange, filterListings, formatPrice } from './catalog.ts'

const sample = [
  { id: 'a', city: 'pattaya', region: 'jomtien', terms: ['day', 'month'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true, price: 2800, currency: 'THB', priceUnit: 'day' },
  { id: 'b', city: 'sanya', region: 'haitang', terms: ['month'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false, price: 6800, currency: 'CNY', priceUnit: 'month' },
  { id: 'c', city: 'beihai', region: 'yintan', terms: ['month', 'year'], management: 'operated', exchangeAuthorized: true, exchangeOpen: false, price: 3900, currency: 'CNY', priceUnit: 'month' },
] as const

test('filterListings matches city, region and rental term without mutating data', () => {
  const result = filterListings(sample, { city: 'pattaya', region: 'jomtien', term: 'day' })
  assert.deepEqual(result.map((item) => item.id), ['a'])
  assert.equal(sample.length, 3)
})

test('filterListings returns empty results for an unavailable combination', () => {
  assert.deepEqual(filterListings(sample, { city: 'beihai', region: 'yintan', term: 'day' }), [])
})

test('canExchange requires operated management, owner authorization and open status', () => {
  assert.equal(canExchange(sample[0]), true)
  assert.equal(canExchange(sample[1]), false)
  assert.equal(canExchange(sample[2]), false)
})

test('formatPrice shows the listing currency and price unit', () => {
  assert.match(formatPrice(sample[0], 'zh'), /THB|฿/)
  assert.match(formatPrice(sample[0], 'zh'), /天/)
  assert.match(formatPrice(sample[1], 'en'), /CNY|CN¥|¥/)
  assert.match(formatPrice(sample[1], 'en'), /month/)
})
