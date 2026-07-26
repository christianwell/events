const TIME_FORMATS = Object.freeze({
  TWELVE_HOUR: '12h',
  TWENTY_FOUR_HOUR: '24h'
})

const TIME_FORMAT_STORAGE_KEY = 'hackclub-events-time-format'
const TIME_FORMAT_CHANGE_EVENT = 'hackclub-events-time-format-change'

const normalizeTimeFormat = value =>
  value === TIME_FORMATS.TWENTY_FOUR_HOUR
    ? TIME_FORMATS.TWENTY_FOUR_HOUR
    : value === TIME_FORMATS.TWELVE_HOUR
      ? TIME_FORMATS.TWELVE_HOUR
      : null

const inferTimeFormat = locale => {
  try {
    const { hour12 } = new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    }).resolvedOptions()

    return hour12
      ? TIME_FORMATS.TWELVE_HOUR
      : TIME_FORMATS.TWENTY_FOUR_HOUR
  } catch {
    return TIME_FORMATS.TWELVE_HOUR
  }
}

const getPreferredTimeFormat = (storedValue, locale) =>
  normalizeTimeFormat(storedValue) || inferTimeFormat(locale)

const toDate = value => {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const pad = value => String(value).padStart(2, '0')

const formatEventTime = (value, timeFormat = TIME_FORMATS.TWELVE_HOUR) => {
  const date = toDate(value)
  if (!date) return ''

  const hours = date.getHours()
  const minutes = pad(date.getMinutes())

  if (normalizeTimeFormat(timeFormat) === TIME_FORMATS.TWENTY_FOUR_HOUR) {
    return `${pad(hours)}:${minutes}`
  }

  const displayHours = hours % 12 || 12
  const period = hours < 12 ? 'AM' : 'PM'
  return `${displayHours}:${minutes} ${period}`
}

const formatEventTimeRange = (start, end, timeFormat) => {
  const startTime = formatEventTime(start, timeFormat)
  const endTime = formatEventTime(end, timeFormat)

  if (!startTime || !endTime) return ''
  return `${startTime}–${endTime}`
}

module.exports = {
  TIME_FORMATS,
  TIME_FORMAT_STORAGE_KEY,
  TIME_FORMAT_CHANGE_EVENT,
  normalizeTimeFormat,
  inferTimeFormat,
  getPreferredTimeFormat,
  formatEventTime,
  formatEventTimeRange
}
