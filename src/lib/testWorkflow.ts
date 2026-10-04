import type { LeasePaymentOption } from './catalog'

export type DateRange = { start: string; end: string }
export type BaseRequest = { id: string; createdAt: string; status: string }
export type RentalRequest = BaseRequest & { kind: 'rental'; listingId: string; term: string; payment: LeasePaymentOption | 'confirm'; start: string; guests: number; status: 'submitted' | 'reviewing' | 'replied' }
export type ManagementRequest = BaseRequest & { kind: 'management'; mode: 'leasing' | 'operation' | 'care'; city: string; region: string; propertyType: string; area: number; status: 'submitted' | 'reviewing' | 'replied' }
export type ExchangeRequest = BaseRequest & { kind: 'exchange'; sourceId: string; targetId: string; aStay: DateRange; bStay: DateRange; status: 'pending-owner' | 'counter-proposed' | 'owner-accepted' | 'owner-declined' | 'applicant-declined' | 'platform-confirmed'; counterStay?: DateRange }
export type TestRequest = RentalRequest | ManagementRequest | ExchangeRequest
export type ExchangeAction = 'accept' | 'decline' | 'counter' | 'confirm'

const storageKey = 'kuailvju-test-requests-v1'

export function validRange(range: DateRange): boolean {
  return Boolean(range.start && range.end && /^\d{4}-\d{2}-\d{2}$/.test(range.start) && /^\d{4}-\d{2}-\d{2}$/.test(range.end) && range.end > range.start)
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
  if (request.status === 'owner-accepted' && action === 'confirm') return { ...request, status: 'platform-confirmed' }
  return null
}

export function advanceService(request: RentalRequest | ManagementRequest): RentalRequest | ManagementRequest | null {
  const status = request.status === 'submitted' ? 'reviewing' : request.status === 'reviewing' ? 'replied' : null
  return status ? { ...request, status } : null
}
