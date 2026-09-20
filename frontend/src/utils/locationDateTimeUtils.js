import { findLocationObject } from '../services/location-date-time.js'

export const getTodayStr = () => new Date().toISOString().split('T')[0]

export const getTimeNow = () => {
  const now = new Date()
  const [hour, min] = [now.getHours(), now.getMinutes()]
  
  return `${hour}:${min}`

}

export const calculateAvailableTimeSlots = (locationId, selectedDate) => {
  const location = findLocationObject(locationId)
  if (!location) {
    return []
  }

  const date = getTodayStr()
  const time = getTimeNow()

  if (date === selectedDate) {
    if (location.close <= time) return []
  }

  return get30MinList(time, location.close)
}

export const adjustTime = (time) => {
  const [hour, adjustedMin] = time.split(":")

  if (adjustedMin >= '00' && adjustedMin < '30') {
    return `${hour}:30`
  } else if (adjustedMin >= '30' && adjustedMin <= '59') {
    return `${Number(hour) + 1}:00`
  } else {
    return time
  }
}

const get30MinList = (startTime, endTime) => {

  if (!startTime || !endTime) return []

  startTime = adjustTime(startTime)

  const formatDisplayTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 === 0 ? 12 : hours % 12
    const pad2 = (num) => String(num).padStart(2, '0')
    
    return `${pad2(hours12)}:${pad2(mins)} ${period}`
  }

  const startMins = parseTimeToMinutes(startTime)
  const endMins = parseTimeToMinutes(endTime)
  const slots = []

  for (let time = startMins; time < endMins; time += 30) {
    const hours = Math.floor(time / 60)
    const mins = time % 60
    const value24 = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    slots.push({
      value24,
      display12: formatDisplayTime(time),
      minutes: time,
    })
  }

  return slots
}

const parseTimeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
}

export const isLessThan24HoursAway = (selectedDate, selectedTime) => {
  if (!selectedDate || !selectedTime) return false

  const now = new Date()
  
  const minutes = now.getMinutes()
  const roundedMinutes = minutes === 0 ? 0 : minutes <= 30 ? 30 : 60
  now.setMinutes(roundedMinutes, 0, 0)

  const targetDate = new Date(`${selectedDate}T${selectedTime}:00`)

  if (isNaN(targetDate.getTime())) return false

  const diffInMs = targetDate.getTime() - now.getTime()
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000

  return diffInMs > 0 && diffInMs < twentyFourHoursInMs
}