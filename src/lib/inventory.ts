import type { DateRange, TestRequest } from './testWorkflow.ts'
import { validRange } from './testWorkflow.ts'

export type InventoryBlock = {
  propertyId: string
  start: string
  end: string
  requestId: string
  kind: 'rental' | 'stay' | 'exchange'
  temporary: boolean
}

export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

export function addMonths(date: string, months: number): string {
  const value = new Date(`${date}T00:00:00Z`)
  const day = value.getUTCDate()
  value.setUTCDate(1)
  value.setUTCMonth(value.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 0)).getUTCDate()
  value.setUTCDate(Math.min(day, lastDay))
  return value.toISOString().slice(0, 10)
}

export function leaseRange(start: string, term: string): DateRange | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return null
  const months = term === 'halfYear' ? 6 : term === 'year' ? 12 : 0
  if (!months) return null
  return { start, end: addMonths(start, months) }
}

const overlaps = (left: DateRange, right: DateRange) => left.start < right.end && right.start < left.end

// Exchange checkout is followed by one complete day for cleaning and human inspection.
const exchangeWindow = (stay: DateRange): DateRange => ({ start: stay.start, end: addDays(stay.end, 2) })

export function inventoryBlocks(requests: readonly TestRequest[], now = Date.now()): InventoryBlock[] {
  return requests.flatMap((request): InventoryBlock[] => {
    if (request.kind === 'rental' && request.status === 'confirmed') {
      const range = request.term === 'day' && request.end ? { start: request.start, end: request.end } : leaseRange(request.start, request.term)
      return range && validRange(range) ? [{ propertyId: request.listingId, ...range, requestId: request.id, kind: request.term === 'day' ? 'stay' : 'rental', temporary: false }] : []
    }
    if (request.kind !== 'exchange' || request.rulesVersion !== 24) return []
    const temporary = request.status === 'owner-accepted' || request.status === 'topup-proposed' || request.status === 'topup-accepted'
    if (!temporary && request.status !== 'platform-confirmed') return []
    if (temporary && (!request.holdExpiresAt || Date.parse(request.holdExpiresAt) <= now)) return []
    return [
      { propertyId: request.targetId, ...exchangeWindow(request.aStay), requestId: request.id, kind: 'exchange', temporary },
      { propertyId: request.sourceId, ...exchangeWindow(request.bStay), requestId: request.id, kind: 'exchange', temporary },
    ]
  })
}

export function propertyAvailable(propertyId: string, range: DateRange, requests: readonly TestRequest[], exceptRequestId?: string, now = Date.now()): boolean {
  return validRange(range) && inventoryBlocks(requests, now).every(block => block.propertyId !== propertyId || block.requestId === exceptRequestId || !overlaps(range, block))
}

export function pairedExchangeAvailable(sourceId: string, sourceStay: DateRange, targetId: string, targetStay: DateRange, requests: readonly TestRequest[], exceptRequestId?: string, now = Date.now()): boolean {
  return sourceId !== targetId && propertyAvailable(sourceId, exchangeWindow(sourceStay), requests, exceptRequestId, now) && propertyAvailable(targetId, exchangeWindow(targetStay), requests, exceptRequestId, now)
}

// Search may show dates after the cleaning buffer, but a firm handover still needs human inspection.
export function handoverReady(propertyId: string, start: string, requests: readonly TestRequest[]): boolean {
  return requests.every(request => {
    if (request.kind !== 'exchange' || request.rulesVersion !== 24 || request.status !== 'platform-confirmed') return true
    if (request.sourceId === propertyId && request.bStay.end <= start && !request.inspections?.source) return false
    if (request.targetId === propertyId && request.aStay.end <= start && !request.inspections?.target) return false
    return true
  })
}
