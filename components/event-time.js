import { useTimeFormat } from '../hooks/use-time-format'

const { formatEventTimeRange } = require('../lib/time-format')

const EventTime = ({ start, end }) => {
  const { timeFormat } = useTimeFormat()
  return formatEventTimeRange(start, end, timeFormat)
}

export default EventTime
