import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

const {
  TIME_FORMATS,
  TIME_FORMAT_STORAGE_KEY,
  getPreferredTimeFormat,
  normalizeTimeFormat
} = require('../lib/time-format')

const TimeFormatContext = createContext(null)

const readTimeFormat = () => {
  if (typeof window === 'undefined') return TIME_FORMATS.TWELVE_HOUR

  try {
    const storedValue = window.localStorage.getItem(TIME_FORMAT_STORAGE_KEY)
    return getPreferredTimeFormat(storedValue, window.navigator.language)
  } catch {
    return getPreferredTimeFormat(null, window.navigator.language)
  }
}

export const TimeFormatProvider = ({ children }) => {
  const [timeFormat, setTimeFormatState] = useState(TIME_FORMATS.TWELVE_HOUR)

  useEffect(() => {
    const syncTimeFormat = () => setTimeFormatState(readTimeFormat())

    syncTimeFormat()
    window.addEventListener('storage', syncTimeFormat)
    return () => window.removeEventListener('storage', syncTimeFormat)
  }, [])

  const setTimeFormat = useCallback(value => {
    const normalizedValue = normalizeTimeFormat(value)
    if (!normalizedValue) return

    try {
      window.localStorage.setItem(TIME_FORMAT_STORAGE_KEY, normalizedValue)
    } catch {
      // The preference still works for this session when storage is unavailable.
    }

    setTimeFormatState(normalizedValue)
  }, [])

  const toggleTimeFormat = useCallback(() => {
    setTimeFormat(
      timeFormat === TIME_FORMATS.TWENTY_FOUR_HOUR
        ? TIME_FORMATS.TWELVE_HOUR
        : TIME_FORMATS.TWENTY_FOUR_HOUR
    )
  }, [setTimeFormat, timeFormat])

  const value = useMemo(
    () => ({ timeFormat, setTimeFormat, toggleTimeFormat }),
    [setTimeFormat, timeFormat, toggleTimeFormat]
  )

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  )
}

export const useTimeFormat = () => {
  const context = useContext(TimeFormatContext)
  if (!context) {
    throw new Error('useTimeFormat must be used inside TimeFormatProvider')
  }
  return context
}
