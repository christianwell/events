const test = require('node:test')
const assert = require('node:assert/strict')

const {
  TIME_FORMATS,
  normalizeTimeFormat,
  inferTimeFormat,
  getPreferredTimeFormat,
  formatEventTime,
  formatEventTimeRange
} = require('../lib/time-format')

const localDate = (hours, minutes) => new Date(2026, 6, 26, hours, minutes)

test('formats afternoon times in 12-hour time', () => {
  assert.equal(
    formatEventTime(localDate(15, 5), TIME_FORMATS.TWELVE_HOUR),
    '3:05 PM'
  )
})

test('formats afternoon times in military time', () => {
  assert.equal(
    formatEventTime(localDate(15, 5), TIME_FORMATS.TWENTY_FOUR_HOUR),
    '15:05'
  )
})

test('uses 00 for midnight in military time', () => {
  assert.equal(
    formatEventTime(localDate(0, 5), TIME_FORMATS.TWENTY_FOUR_HOUR),
    '00:05'
  )
})

test('formats time ranges in both formats', () => {
  const start = localDate(23, 45)
  const end = new Date(2026, 6, 27, 0, 15)

  assert.equal(
    formatEventTimeRange(start, end, TIME_FORMATS.TWELVE_HOUR),
    '11:45 PM–12:15 AM'
  )
  assert.equal(
    formatEventTimeRange(start, end, TIME_FORMATS.TWENTY_FOUR_HOUR),
    '23:45–00:15'
  )
})

test('normalizes only supported stored values', () => {
  assert.equal(normalizeTimeFormat('12h'), '12h')
  assert.equal(normalizeTimeFormat('24h'), '24h')
  assert.equal(normalizeTimeFormat('military'), null)
})

test('saved preferences override the browser locale', () => {
  assert.equal(getPreferredTimeFormat('24h', 'en-US'), '24h')
  assert.equal(getPreferredTimeFormat('12h', 'da-DK'), '12h')
})

test('infers common locale defaults', () => {
  assert.equal(inferTimeFormat('en-US'), '12h')
  assert.equal(inferTimeFormat('da-DK'), '24h')
})

test('returns an empty string for invalid dates', () => {
  assert.equal(formatEventTime('not-a-date', '24h'), '')
  assert.equal(formatEventTimeRange('not-a-date', localDate(12, 0), '24h'), '')
})
