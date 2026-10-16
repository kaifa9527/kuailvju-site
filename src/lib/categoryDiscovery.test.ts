import test from 'node:test'
import assert from 'node:assert/strict'
import { listings } from '../data.ts'
import { findCategoryListings } from './categoryDiscovery.ts'
import type { TestRequest } from './testWorkflow.ts'

const day = '2026-10-16'
const match = (mode: 'rentals' | 'stays' | 'exchange', query: string, requests: TestRequest[] = []) =>
  findCategoryListings(mode, query, listings, day, requests)

test('regression: URL city + district are passed through to eligible long rentals', () => {
  const result = match('rentals', 'city=sanya&region=haitang&term=all&moveIn=2026-10-16')
  assert.deepEqual(result.map(h => h.id), ['sanya-haitang-monthly'])
  assert.ok(result.every(h => h.city === 'sanya' && h.region === 'haitang'))
  assert.equal(match('rentals', 'city=pattaya&region=haitang').length, 0)
  assert.equal(match('rentals', 'city=beihai&region=qiaogang').length, 1)
})

test('specific city, region and lease terms do not bleed across recommendations', () => {
  assert.deepEqual(match('rentals', 'city=pattaya&region=north&term=year').map(h => h.id), ['pattaya-north-monthly'])
  assert.equal(match('rentals', 'city=sanya&region=haitang&term=invalid').length, 0)
  assert.equal(match('rentals', 'city=nonexistent').length, 0)
})

test('short stays and exchanges obey the same destination and district filters', () => {
  assert.deepEqual(match('stays', 'city=sanya&region=haitang').map(h => h.id), ['sanya-garden-villa'])
  assert.deepEqual(match('exchange', 'city=sanya&region=haitang').map(h => h.id), ['sanya-haitang-monthly'])
  assert.equal(match('exchange', 'city=pattaya&region=jomtien').length, 0)
  assert.ok(match('stays', 'city=pattaya').every(h => h.city === 'pattaya'))
})

test('move-in filters check confirmed long-stay holds without misusing nightly demo blocks', () => {
  const hold: TestRequest = {
    id: 'hold-one', createdAt: '2026-10-15', kind: 'rental', listingId: 'sanya-haitang-monthly',
    status: 'confirmed', start: '2026-10-16', term: 'year', payment: 'one-two', guests: 2,
  }
  assert.deepEqual(match('rentals', 'city=sanya&region=haitang&term=year&moveIn=2026-10-16', [hold]), [])
  assert.equal(match('rentals', 'city=sanya&region=haitang&moveIn=2026-10-15').length, 0)
  assert.equal(match('rentals', 'city=sanya&region=haitang&moveIn=2026-02-30').length, 0)
})
