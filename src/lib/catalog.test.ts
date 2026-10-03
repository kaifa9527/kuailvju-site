import test from 'node:test'
import assert from 'node:assert/strict'
import { canExchange, estimateLeaseMoveIn, filterListings, formatPrice } from './catalog.ts'

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

test('monthly lease preview separates refundable deposit from prepaid rent', () => {
  assert.deepEqual(estimateLeaseMoveIn(3900, 3, 'one-two'), { deposit: 3900, prepaidRent: 7800, initialDue: 11700 })
  assert.deepEqual(estimateLeaseMoveIn(3900, 3, 'two-one'), { deposit: 7800, prepaidRent: 3900, initialDue: 11700 })
})

test('lease payment choices are not offered for a one-month term or invalid rent', () => {
  assert.equal(estimateLeaseMoveIn(3900, 1, 'one-two'), null)
  assert.equal(estimateLeaseMoveIn(3900, 1, 'two-one'), null)
  assert.equal(estimateLeaseMoveIn(-10, 3, 'one-two'), null)
})
