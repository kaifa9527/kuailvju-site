import test from 'node:test'
import assert from 'node:assert/strict'
import { groupListingsByCity, previewListings } from './homePresentation.ts'

const cities = [{ id: 'pattaya' }, { id: 'sanya' }, { id: 'beihai' }]
const listings = [
  { id: 'a', city: 'sanya' },
  { id: 'b', city: 'pattaya' },
  { id: 'c', city: 'sanya' },
  { id: 'd', city: 'unknown' },
]

test('city rows follow destination order and do not mix inventory', () => {
  assert.deepEqual(groupListingsByCity(listings, cities), [
    { city: 'pattaya', listings: [listings[1]] },
    { city: 'sanya', listings: [listings[0], listings[2]] },
  ])
})

test('homepage shows at most 8 actual items without filler or duplication', () => {
  const items = Array.from({ length: 11 }, (_, id) => ({ id }))
  assert.deepEqual(previewListings(items), items.slice(0, 8))
  assert.deepEqual(previewListings(items.slice(0, 3)), items.slice(0, 3))
  assert.deepEqual(previewListings([]), [])
})
