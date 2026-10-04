import test from 'node:test'
import assert from 'node:assert/strict'
import { advanceService, changeExchange, proposeExchangeTopUp, respondExchangeTopUp, validRange, type ExchangeRequest, type RentalRequest } from './testWorkflow.ts'

const exchange: ExchangeRequest = { id: 'T-1', createdAt: '2026-10-04', kind: 'exchange', sourceId: 'a', targetId: 'b', aStay: { start: '2026-11-01', end: '2026-11-04' }, bStay: { start: '2026-12-01', end: '2026-12-04' }, status: 'pending-owner' }

test('exchange date ranges require a checkout after check-in', () => {
  assert.equal(validRange(exchange.aStay), true)
  assert.equal(validRange({ start: '2026-11-04', end: '2026-11-01' }), false)
  assert.equal(validRange({ start: '2026-02-30', end: '2026-03-02' }), false)
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

test('a top-up needs a platform quote and separate approval from both owners before confirmation', () => {
  const agreed = changeExchange(exchange, 'accept')!
  assert.equal(proposeExchangeTopUp(exchange, 200, 'CNY', 'a'), null)
  assert.equal(proposeExchangeTopUp(agreed, 0, 'CNY', 'a'), null)
  const quote = proposeExchangeTopUp(agreed, 200, 'CNY', 'a')!
  assert.equal(changeExchange(quote, 'confirm'), null)
  const aAccepted = respondExchangeTopUp(quote, 'a', true)!
  assert.equal(aAccepted.status, 'topup-proposed')
  const bothAccepted = respondExchangeTopUp(aAccepted, 'b', true)!
  assert.equal(bothAccepted.status, 'topup-accepted')
  assert.equal(changeExchange(bothAccepted, 'confirm')?.status, 'platform-confirmed')
  assert.equal(respondExchangeTopUp(quote, 'b', false)?.status, 'topup-declined')
})

test('service enquiries progress from submitted through review to response', () => {
  const rental: RentalRequest = { id: 'T-2', createdAt: '2026-10-04', kind: 'rental', listingId: 'a', term: 'month', payment: 'one-two', start: '2026-11-01', guests: 2, status: 'submitted' }
  assert.equal(advanceService(rental)?.status, 'reviewing')
  assert.equal(advanceService(advanceService(rental)!)?.status, 'replied')
  assert.equal(advanceService({ ...rental, status: 'replied' }), null)
})
