import test from 'node:test'
import assert from 'node:assert/strict'
import { addMonths, handoverReady, inventoryBlocks, leaseRange, pairedExchangeAvailable, propertyAvailable } from './inventory.ts'
import type { ExchangeRequest, RentalRequest } from './testWorkflow.ts'
import { markExchangeInspection } from './testWorkflow.ts'

const lease: RentalRequest = { id: 'lease-1', createdAt: '2026-10-01', kind: 'rental', listingId: 'home-a', term: 'halfYear', payment: 'one-two', start: '2026-10-07', guests: 2, status: 'confirmed' }
const exchange: ExchangeRequest = { id: 'exchange-1', createdAt: '2026-10-01', kind: 'exchange', rulesVersion: 24, sourceId: 'home-a', targetId: 'home-b', aStay: { start: '2026-11-01', end: '2026-11-05' }, bStay: { start: '2026-10-01', end: '2026-10-05' }, status: 'platform-confirmed' }

test('a six-month lease occupies a continuous interval and month-end dates remain valid', () => {
  assert.deepEqual(leaseRange('2026-10-07', 'halfYear'), { start: '2026-10-07', end: '2027-04-07' })
  assert.equal(addMonths('2026-08-31', 6), '2027-02-28')
  assert.equal(propertyAvailable('home-a', { start: '2027-04-07', end: '2027-04-10' }, [lease]), true)
  assert.equal(propertyAvailable('home-a', { start: '2026-10-06', end: '2026-10-08' }, [lease]), false)
})

test('each exchange stay blocks its actual dates and one full inspection day after checkout', () => {
  const blocks = inventoryBlocks([exchange])
  assert.deepEqual(blocks.map(block => [block.propertyId, block.start, block.end]), [
    ['home-b', '2026-11-01', '2026-11-07'],
    ['home-a', '2026-10-01', '2026-10-07'],
  ])
  assert.equal(propertyAvailable('home-a', { start: '2026-10-06', end: '2027-04-06' }, [exchange]), false)
  assert.equal(propertyAvailable('home-a', { start: '2026-10-07', end: '2027-04-07' }, [exchange]), true)
})

test('both legs must be available; a competing lease invalidates the pair', () => {
  assert.equal(pairedExchangeAvailable('home-a', exchange.bStay, 'home-b', exchange.aStay, [], 'exchange-1'), true)
  assert.equal(pairedExchangeAvailable('home-a', exchange.bStay, 'home-b', exchange.aStay, [lease], 'exchange-1'), true)
  assert.equal(pairedExchangeAvailable('home-a', { start: '2026-10-08', end: '2026-10-10' }, 'home-b', exchange.aStay, [lease]), false)
  assert.equal(pairedExchangeAvailable('home-a', exchange.bStay, 'home-a', exchange.aStay, []), false)
})

test('a temporary pair hold expires and cannot block inventory forever', () => {
  const held: ExchangeRequest = { ...exchange, status: 'owner-accepted', holdExpiresAt: '2026-10-05T12:00:00.000Z' }
  assert.equal(propertyAvailable('home-a', { start: '2026-10-02', end: '2026-10-03' }, [held], undefined, Date.parse('2026-10-05T11:00:00Z')), false)
  assert.equal(propertyAvailable('home-a', { start: '2026-10-02', end: '2026-10-03' }, [held], undefined, Date.parse('2026-10-05T12:00:00Z')), true)
})

test('old browser-only exchange records never occupy the current calendar', () => {
  assert.deepEqual(inventoryBlocks([{ ...exchange, rulesVersion: undefined }]), [])
})

test('the buffer alone is not enough for a new handover; each leg needs its own human inspection', () => {
  assert.equal(propertyAvailable('home-a', { start: '2026-10-07', end: '2027-04-07' }, [exchange]), true)
  assert.equal(handoverReady('home-a', '2026-10-07', [exchange]), false)
  assert.equal(handoverReady('home-b', '2026-11-07', [exchange]), false)
  assert.equal(markExchangeInspection(exchange, 'source', '2026-10-04'), null)
  const inspected = markExchangeInspection(exchange, 'source', '2026-10-05')!
  assert.equal(handoverReady('home-a', '2026-10-07', [inspected]), true)
  assert.equal(handoverReady('home-b', '2026-11-07', [inspected]), false)
  assert.equal(handoverReady('home-b', '2026-11-07', [markExchangeInspection(inspected, 'target', '2026-11-05')!]), true)
})
