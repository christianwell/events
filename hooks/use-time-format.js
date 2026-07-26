import { useCallback, useEffect, useState } from 'react'

const {
  TIME_FORMATS,
  TIME_FORMAT_STORAGE_KEY,
  TIME_FORMAT_CHANGE_EVENT,
  getPreferredTimeFormat,
  normalizeTimeFormat
} = require('../lib/time-format')

const readTimeFormat = () => {
  if (typeof window === 'undefined') return TIME_FORMATS.TWELVE_HOUR

  const storedValue = window.localStorage.getItem(TIME_FORMAT_STORAGE_KEY)
  return getPreferredTimeFormat(storedValue, window.navigator.language)
}

export const useTimeFormat = () => {
  const [timeFormat, setTimeFormatState] = useState(TIME_FORMATS.TWELVE_HOUR)

  useEffect(() => {
    const syncTimeFormat = () => setTimeFormatState(readTimeFormat())

    syncTimeFormat()
    window.addEventListener('storage', syncTimeFormat)
    window.addEventListener(TIME_FORMAT_CHANGE_EVENT, syncTimeFormat)

    return () => {
      window.removeEventListener('storage', syncTimeFormat)
      window.removeEventListener(TIME_FORMAT_CHANGE_EVENT, syncTimeFormat)
    }
  }, [])

  const setTimeFormat = useCallback(value => {
    const normalizedValue = normalizeTimeFormat(value)
    if (!normalizedValue) return

    window.localStorage.setItem(TIME_FORMAT_STORAGE_KEY, normalizedValue)
    setTimeFormatState(normalizedValue)
    window.dispatchEvent(new Event(TIME_FORMAT_CHANGE_EVENT))
  }, [])

  const toggleTimeFormat = useCallback(() => {
    setTimeFormat(
      timeFormat === TIME_FORMATS.TWENTY_FOUR_HOUR
        ? TIME_FORMATS.TWELVE_HOUR
        : TIME_FORMATS.TWENTY_FOUR_HOUR
    )
  }, [setTimeFormat, timeFormat])

  return { timeFormat, setTimeFormat, toggleTimeFormat }
}
