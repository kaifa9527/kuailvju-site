import test from 'node:test'
import assert from 'node:assert/strict'
import { initialHomeSearch, makeHomeSearchHash } from './homeDiscovery.ts'

const date = '2026-10-16'

test('long rent search navigates with valid city, area, move-in and term', () => {
  const href = makeHomeSearchHash('rentals', { ...initialHomeSearch, city: 'pattaya', region: 'jomtien', start: '2026-11-01', term: 'halfYear' }, date)
  assert.equal(href, '#/rentals?city=pattaya&region=jomtien&moveIn=2026-11-01&term=halfYear')
})

test('short stay and exchange keep both dates and guest counts', () => {
  const selection = { ...initialHomeSearch, city: 'sanya', start: '2026-11-01', end: '2026-11-04', guests: 3 }
  assert.equal(makeHomeSearchHash('stays', selection, date), '#/stays?city=sanya&start=2026-11-01&end=2026-11-04&guests=3')
  assert.equal(makeHomeSearchHash('exchange', selection, date), '#/exchange?city=sanya&start=2026-11-01&end=2026-11-04&guests=3')
})

test('Roam searches by city and product category without rental-only filters', () => {
  const href = makeHomeSearchHash('roam', { ...initialHomeSearch, city: 'pattaya', region: 'jomtien', category: 'tickets', start: '2026-10-20' }, date)
  assert.equal(href, '#/roam?city=pattaya&category=tickets')
})

test('no dates remain optional for browsing but partial, expired or impossible dates fail', () => {
  assert.equal(makeHomeSearchHash('stays', initialHomeSearch, date), '#/stays')
  assert.throws(() => makeHomeSearchHash('exchange', { ...initialHomeSearch, start: '2026-10-20' }, date), /invalid-date-range/)
  assert.throws(() => makeHomeSearchHash('stays', { ...initialHomeSearch, start: '2026-10-15', end: '2026-10-20' }, date), /invalid-date-range/)
  assert.throws(() => makeHomeSearchHash('stays', { ...initialHomeSearch, start: '2026-02-30', end: '2026-03-04' }, date), /invalid-date-range/)
  assert.throws(() => makeHomeSearchHash('rentals', { ...initialHomeSearch, start: '2026-10-15' }, date), /invalid-date/)
})
