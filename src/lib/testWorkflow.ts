import type { LeasePaymentOption } from './catalog'

export type DateRange = { start: string; end: string }
export type BaseRequest = { id: string; createdAt: string; status: string }
export type RentalRequest = BaseRequest & { kind: 'rental'; listingId: string; term: string; payment: LeasePaymentOption | 'confirm'; start: string; end?: string; guests: number; status: 'submitted' | 'reviewing' | 'replied' }
export type ManagementRequest = BaseRequest & {
  kind: 'management'; mode: 'leasing' | 'operation' | 'care'; city: string; region: string; propertyType: string; area: number;
  floor?: number; totalFloors?: number; bedrooms?: number; livingRooms?: number; bathrooms?: number; handover?: string;
  renovation?: string; furnishing?: string; appliances?: string; occupancy?: string; rentalMinimum?: string; cooperationModel?: string;
  expectedMonthlyRent?: number; operationReady?: string; careAddons?: string[]; photoCount?: number; careEstimate?: number;
  status: 'submitted' | 'reviewing' | 'replied'
}
export type ExchangeTopUp = { amount: number; currency: 'CNY' | 'THB'; payer: 'a' | 'b'; acceptedA: boolean; acceptedB: boolean }
export type ExchangeRequest = BaseRequest & { kind: 'exchange'; sourceId: string; targetId: string; aStay: DateRange; bStay: DateRange; guests?: number; status: 'pending-owner' | 'counter-proposed' | 'owner-accepted' | 'owner-declined' | 'applicant-declined' | 'topup-proposed' | 'topup-accepted' | 'topup-declined' | 'platform-confirmed'; counterStay?: DateRange; topUp?: ExchangeTopUp }
export type TestRequest = RentalRequest | ManagementRequest | ExchangeRequest
export type ExchangeAction = 'accept' | 'decline' | 'counter' | 'confirm'

const storageKey = 'kuailvju-test-requests-v1'

export function validRange(range: DateRange): boolean {
  const actualDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
  return actualDate(range.start) && actualDate(range.end) && range.end > range.start
}

export function createId(): string {
  return `T-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function readTestRequests(): TestRequest[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is TestRequest => Boolean(item && typeof item === 'object' && 'id' in item && 'kind' in item && 'status' in item)) : []
  } catch { return [] }
}

export function saveTestRequest(request: TestRequest): void {
  const next = [request, ...readTestRequests().filter(item => item.id !== request.id)]
  localStorage.setItem(storageKey, JSON.stringify(next))
  window.dispatchEvent(new Event('kuailvju-test-updated'))
}

export function changeExchange(request: ExchangeRequest, action: ExchangeAction, counterStay?: DateRange): ExchangeRequest | null {
  if (request.status === 'pending-owner' && action === 'accept') return { ...request, status: 'owner-accepted' }
  if (request.status === 'pending-owner' && action === 'decline') return { ...request, status: 'owner-declined' }
  if (request.status === 'pending-owner' && action === 'counter' && counterStay && validRange(counterStay)) return { ...request, status: 'counter-proposed', counterStay }
  if (request.status === 'counter-proposed' && action === 'decline') return { ...request, status: 'applicant-declined' }
  if (request.status === 'counter-proposed' && action === 'accept') return { ...request, status: 'owner-accepted', bStay: request.counterStay!, counterStay: undefined }
  if ((request.status === 'owner-accepted' && !request.topUp || request.status === 'topup-accepted') && action === 'confirm') return { ...request, status: 'platform-confirmed' }
  return null
}

export function proposeExchangeTopUp(request: ExchangeRequest, amount: number, currency: 'CNY' | 'THB', payer: 'a' | 'b'): ExchangeRequest | null {
  if (request.status !== 'owner-accepted' || !Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount) || !['CNY', 'THB'].includes(currency) || !['a', 'b'].includes(payer)) return null
  return { ...request, status: 'topup-proposed', topUp: { amount, currency, payer, acceptedA: false, acceptedB: false } }
}

export function respondExchangeTopUp(request: ExchangeRequest, party: 'a' | 'b', accepted: boolean): ExchangeRequest | null {
  if (request.status !== 'topup-proposed' || !request.topUp) return null
  if (!accepted) return { ...request, status: 'topup-declined' }
  const topUp = { ...request.topUp, [party === 'a' ? 'acceptedA' : 'acceptedB']: true }
  return { ...request, topUp, status: topUp.acceptedA && topUp.acceptedB ? 'topup-accepted' : 'topup-proposed' }
}

export function advanceService(request: RentalRequest | ManagementRequest): RentalRequest | ManagementRequest | null {
  const status = request.status === 'submitted' ? 'reviewing' : request.status === 'reviewing' ? 'replied' : null
  return status ? { ...request, status } : null
}
