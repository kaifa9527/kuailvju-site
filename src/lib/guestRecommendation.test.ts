import test from 'node:test'
import assert from 'node:assert/strict'
import { listings } from '../data.ts'
import { guestRecommendation } from './guestRecommendation.ts'

test('concept homes cannot show a guest recommendation without verified stays', () => {
  assert.deepEqual(guestRecommendation(listings[0]), { count: 0, rating: null, recommended: false })
})

test('badge requires five completed reviews averaging at least 4.8', () => {
  const home = listings[0]
  assert.equal(guestRecommendation({ ...home, verifiedReviews: Array.from({ length: 4 }, () => ({ rating: 5, stayCompleted: true as const })) }).recommended, false)
  assert.equal(guestRecommendation({ ...home, verifiedReviews: Array.from({ length: 5 }, () => ({ rating: 5, stayCompleted: true as const })) }).recommended, true)
  assert.equal(guestRecommendation({ ...home, verifiedReviews: Array.from({ length: 5 }, () => ({ rating: 4, stayCompleted: true as const })) }).recommended, false)
})
