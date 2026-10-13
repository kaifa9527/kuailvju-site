import type { DateRange } from './testWorkflow.ts'

export type ComparableHome = { area: number; bedrooms: number; condition?: 'new' | 'standard' | 'refresh'; price?: number; city?: string }
export type MatchLevel = 'close' | 'discuss' | 'different' | 'unknown'

export function stayNights(stay: DateRange): number {
  const start = Date.parse(`${stay.start}T00:00:00Z`)
  const end = Date.parse(`${stay.end}T00:00:00Z`)
  return Number.isFinite(start) && Number.isFinite(end) && end > start ? (end - start) / 86_400_000 : 0
}

// A recommendation only. Neither market price nor location is an input or an automatic top-up.
export function compareExchange(source: ComparableHome, sourceStay: DateRange, target: ComparableHome, targetStay: DateRange): MatchLevel {
  const sourceNights = stayNights(sourceStay)
  const targetNights = stayNights(targetStay)
  if (!sourceNights || !targetNights || !source.area || !target.area || !source.bedrooms || !target.bedrooms || !source.condition || !target.condition) return 'unknown'
  const areaRatio = Math.max(source.area, target.area) / Math.min(source.area, target.area)
  const roomGap = Math.abs(source.bedrooms - target.bedrooms)
  const nightGap = Math.abs(sourceNights - targetNights)
  const conditionsClose = source.condition === target.condition || [source.condition, target.condition].includes('standard')
  if (nightGap === 0 && areaRatio <= 1.2 && roomGap === 0 && conditionsClose) return 'close'
  if (nightGap <= 1 && areaRatio <= 1.3 && roomGap <= 1 && conditionsClose) return 'discuss'
  return 'different'
}
