import test from 'node:test'
import assert from 'node:assert/strict'
import { compareExchange, stayNights } from './exchangeMatch.ts'

const threeNights = { start: '2026-10-01', end: '2026-10-04' }
const fourNights = { start: '2026-11-01', end: '2026-11-05' }

test('matching uses actual nights, area, bedrooms and condition without converting rent', () => {
  assert.equal(stayNights(threeNights), 3)
  const source = { area: 100, bedrooms: 2, condition: 'standard' as const, price: 3000, city: 'beihai' }
  const target = { area: 110, bedrooms: 2, condition: 'new' as const, price: 100000, city: 'sanya' }
  assert.equal(compareExchange(source, threeNights, target, { start: '2026-11-01', end: '2026-11-04' }), 'close')
  assert.equal(compareExchange(source, threeNights, target, fourNights), 'discuss')
  assert.equal(compareExchange(source, threeNights, { ...target, area: 220 }, fourNights), 'different')
  assert.equal(compareExchange(source, { start: '', end: '' }, target, fourNights), 'unknown')
})
