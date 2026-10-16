import test from 'node:test'
import assert from 'node:assert/strict'
import { ROAM_TEST_HISTORY_LIMIT, ROAM_TEST_STORAGE_KEY, saveRoamTestRequest } from './roamRequests.ts'

const today = new Date(2026, 9, 16, 12)
const request = { experienceId: 'pattaya-coast', date: '2026-10-20', guests: 2 }

function memoryStorage(initial: string | null = null) {
  let value = initial
  return {
    getItem: (key: string) => key === ROAM_TEST_STORAGE_KEY ? value : null,
    setItem: (key: string, content: string) => { assert.equal(key, ROAM_TEST_STORAGE_KEY); value = content },
    get value() { return value },
  }
}

test('stores a test-only request and returns its receipt only after successful write', () => {
  const storage = memoryStorage()
  const result = saveRoamTestRequest(storage, request, today)
  assert.equal(result.testOnly, true)
  assert.match(result.code, /^ROAM-/)
  assert.equal(result.date, request.date)
  assert.deepEqual(JSON.parse(storage.value!), [result])
})

test('keeps only the latest 50 browser demo requests', () => {
  const storage = memoryStorage()
  for (let n = 0; n < ROAM_TEST_HISTORY_LIMIT + 3; n++) {
    saveRoamTestRequest(storage, { ...request, guests: n % 6 + 1 }, today)
  }
  const history = JSON.parse(storage.value!)
  assert.equal(history.length, ROAM_TEST_HISTORY_LIMIT)
  assert.equal(history[0].guests, (ROAM_TEST_HISTORY_LIMIT + 2) % 6 + 1)
})

test('rejects past dates, invalid calendar dates, guests and blank experiences without a write', () => {
  const storage = memoryStorage()
  for (const details of [
    { ...request, date: '2026-10-15' },
    { ...request, date: '2026-02-30' },
    { ...request, date: '2026-10-20', guests: 0 },
    { ...request, experienceId: ' ' },
  ]) assert.throws(() => saveRoamTestRequest(storage, details, today))
  assert.equal(storage.value, null)
})

test('storage errors and damaged history are never reported as a successful save', () => {
  const broken = memoryStorage('{broken')
  assert.throws(() => saveRoamTestRequest(broken, request, today))
  assert.equal(broken.value, '{broken')
  assert.throws(() => saveRoamTestRequest({
    getItem: () => null,
    setItem: () => { throw new Error('Quota exceeded') },
  }, request, today), /Quota exceeded/)
})
