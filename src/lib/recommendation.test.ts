import test from 'node:test'
import assert from 'node:assert/strict'
import { recommendedListings, sortDiscoveryListings, supportsPriceSort, parseSortMode } from './recommendation.ts'

function item(id: string, city: string, price: number, currency: string = 'CNY', publishedAt = '2026-09-30', pinned = false) {
  return {
    id, city, price, currency, priceUnit: 'month', publishedAt, pinned,
    gallery: [{ image: '/demo.jpg' }], amenities: ['wifi'], features: ['description'],
  }
}
const mixed = [
  item('p1', 'pattaya', 18000, 'THB', '2026-10-01'),
  item('p2', 'pattaya', 12000, 'THB', '2026-10-02'),
  item('p3', 'pattaya', 22000, 'THB', '2026-10-03'),
  item('s1', 'sanya', 6000, 'CNY', '2026-09-10', true),
  item('b1', 'beihai', 3400, 'CNY', '2026-09-30'),
]

test('recommended feed rotates cities before refilling scarce-city gaps', () => {
  const result = recommendedListings(mixed)
  assert.equal(result.length, 5)
  assert.equal(new Set(result.map(x => x.id)).size, 5)
  assert.equal(new Set(result.slice(0, 3).map(x => x.city)).size, 3)
  assert.equal(result[0].id, 's1')
  assert.deepEqual(result.slice(3).map(x => x.city), ['pattaya', 'pattaya'])
})

test('same-city results preserve editorial ordering with stable fallbacks', () => {
  const result = recommendedListings([item('a', 'sanya', 50), item('b', 'sanya', 80, 'CNY', '2026-10-06')])
  assert.deepEqual(result.map(x => x.id), ['b', 'a'])
})

test('newest ignores city rotation, and prices sort only comparable amounts', () => {
  assert.deepEqual(sortDiscoveryListings(mixed, 'newest').map(x => x.id), ['p3', 'p2', 'p1', 'b1', 's1'])
  assert.equal(supportsPriceSort(mixed), false)
  assert.deepEqual(sortDiscoveryListings(mixed, 'price-asc').map(x => x.id), recommendedListings(mixed).map(x => x.id))
  const comparable = mixed.filter(x => x.city === 'pattaya')
  assert.equal(supportsPriceSort(comparable), true)
  assert.deepEqual(sortDiscoveryListings(comparable, 'price-asc').map(x => x.id), ['p2', 'p1', 'p3'])
  assert.deepEqual(sortDiscoveryListings(comparable, 'price-desc').map(x => x.id), ['p3', 'p1', 'p2'])
})

test('sort mode parser does not trust unexpected URL parameters', () => {
  assert.equal(parseSortMode('newest'), 'newest')
  assert.equal(parseSortMode('price-asc'), 'price-asc')
  assert.equal(parseSortMode('???'), 'recommended')
  assert.equal(parseSortMode(null), 'recommended')
})

test('a single currency but mixed price units cannot be compared', () => {
  const pair = [item('a', 'sanya', 100), { ...item('b', 'beihai', 200), priceUnit: 'day' }]
  assert.equal(supportsPriceSort(pair), false)
  assert.equal(supportsPriceSort([]), false)
})
