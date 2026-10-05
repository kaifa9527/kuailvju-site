import test from 'node:test'
import assert from 'node:assert/strict'
import { canExchange, estimateLeaseMoveIn, filterListings, formatPrice, longRentalMonthlyPrice, sortFeaturedListings } from './catalog.ts'

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

test('canExchange accepts authorized leased or operated homes only when open', () => {
  assert.equal(canExchange(sample[0]), true)
  assert.equal(canExchange(sample[1]), false)
  assert.equal(canExchange(sample[2]), false)
  assert.equal(canExchange({ ...sample[1], exchangeAuthorized: true, exchangeOpen: true }), true)
  assert.equal(canExchange({ ...sample[1], management: 'care', exchangeAuthorized: true, exchangeOpen: true }), false)
})

test('six-month rent rises 10 percent while one-year rent stays at the base rate', () => {
  assert.equal(longRentalMonthlyPrice(3900, 'halfYear'), 4290)
  assert.equal(longRentalMonthlyPrice(3900, 'year'), 3900)
  assert.deepEqual(estimateLeaseMoveIn(longRentalMonthlyPrice(3900, 'halfYear'), 6, 'one-two'), { deposit: 4290, prepaidRent: 8580, initialDue: 12870 })
})

test('featured order keeps pinned homes first, then newest, without changing source order', () => {
  const homes = [
    { id: 'older', pinned: false, publishedAt: '2026-09-01' },
    { id: 'newest', pinned: false, publishedAt: '2026-10-03' },
    { id: 'pinned', pinned: true, publishedAt: '2026-08-01' },
  ]
  assert.deepEqual(sortFeaturedListings(homes).map(item => item.id), ['pinned', 'newest', 'older'])
  assert.deepEqual(homes.map(item => item.id), ['older', 'newest', 'pinned'])
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
