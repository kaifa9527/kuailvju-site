import { localDate } from './exchangeDiscovery.ts'

export const ROAM_TEST_STORAGE_KEY = 'kuailvju-roam-test'
export const ROAM_TEST_HISTORY_LIMIT = 50

export type RoamTestRequest = {
  code: string
  experienceId: string
  date: string
  guests: number
  createdAt: string
  testOnly: true
}

type RoamRequestStorage = Pick<Storage, 'getItem' | 'setItem'>

export function saveRoamTestRequest(
  storage: RoamRequestStorage,
  details: { experienceId: string; date: string; guests: number },
  now = new Date(),
): RoamTestRequest {
  const parsedDay = /^\d{4}-\d{2}-\d{2}$/.test(details.date)
    ? new Date(`${details.date}T00:00:00Z`)
    : new Date(Number.NaN)

  if (!details.experienceId.trim()
    || !Number.isInteger(details.guests) || details.guests < 1 || details.guests > 6
    || Number.isNaN(parsedDay.getTime())
    || parsedDay.toISOString().slice(0, 10) !== details.date
    || details.date < localDate(now)) {
    throw new Error('Invalid demo experience request')
  }

  const stored = storage.getItem(ROAM_TEST_STORAGE_KEY)
  const previous: unknown = stored ? JSON.parse(stored) : []
  if (!Array.isArray(previous)) throw new Error('Invalid demo request history')

  const record: RoamTestRequest = {
    code: `ROAM-${now.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    experienceId: details.experienceId,
    date: details.date,
    guests: details.guests,
    createdAt: now.toISOString(),
    testOnly: true,
  }

  // Keep browser-only demo history bounded; this is not a real booking or a server request.
  storage.setItem(ROAM_TEST_STORAGE_KEY, JSON.stringify([record, ...previous].slice(0, ROAM_TEST_HISTORY_LIMIT)))
  return record
}
