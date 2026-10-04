import test from 'node:test'
import assert from 'node:assert/strict'
import { advanceService, changeExchange, validRange, type ExchangeRequest, type RentalRequest } from './testWorkflow.ts'

const exchange: ExchangeRequest = { id: 'T-1', createdAt: '2026-10-04', kind: 'exchange', sourceId: 'a', targetId: 'b', aStay: { start: '2026-11-01', end: '2026-11-04' }, bStay: { start: '2026-12-01', end: '2026-12-04' }, status: 'pending-owner' }

test('exchange date ranges require a checkout after check-in', () => {
  assert.equal(validRange(exchange.aStay), true)
  assert.equal(validRange({ start: '2026-11-04', end: '2026-11-01' }), false)
})

test('exchange can be accepted, countered or declined by the target owner', () => {
  assert.equal(changeExchange(exchange, 'accept')?.status, 'owner-accepted')
  assert.equal(changeExchange(exchange, 'decline')?.status, 'owner-declined')
  const counter = changeExchange(exchange, 'counter', { start: '2026-12-10', end: '2026-12-13' })
  assert.equal(counter?.status, 'counter-proposed')
  assert.equal(changeExchange(counter!, 'accept')?.bStay.start, '2026-12-10')
  assert.equal(changeExchange(counter!, 'decline')?.status, 'applicant-declined')
})

test('platform can confirm only after owner acceptance', () => {
  assert.equal(changeExchange(exchange, 'confirm'), null)
  assert.equal(changeExchange(changeExchange(exchange, 'accept')!, 'confirm')?.status, 'platform-confirmed')
})

test('service enquiries progress from submitted through review to response', () => {
  const rental: RentalRequest = { id: 'T-2', createdAt: '2026-10-04', kind: 'rental', listingId: 'a', term: 'month', payment: 'one-two', start: '2026-11-01', guests: 2, status: 'submitted' }
  assert.equal(advanceService(rental)?.status, 'reviewing')
  assert.equal(advanceService(advanceService(rental)!)?.status, 'replied')
  assert.equal(advanceService({ ...rental, status: 'replied' }), null)
})
