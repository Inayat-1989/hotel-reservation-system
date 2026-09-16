import { formList } from '../../components/data-storage/form-data.js'
import { getAvailableSeats } from '../constant-data/location-date-time.js'

export const getTodayStr = () => new Date().toISOString().split('T')[0]

export const getCurrentMinutes = () => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export const getLocationStatus = (locationObj, targetDateStr, todayStr = getTodayStr()) => {
  const [year, month, day] = targetDateStr.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  const daySchedule = locationObj?.schedule?.find(s => s.days.includes(dayName))

  if (!daySchedule?.open || !daySchedule?.close) {
    return { status: 'Closed', isOpen: false }
  }

  if (targetDateStr === todayStr) {
    const [openH, openM] = daySchedule.open.split(':').map(Number)
    const [closeH, closeM] = daySchedule.close.split(':').map(Number)
    const startMinutes = openH * 60 + openM
    const endMinutes = closeH * 60 + closeM
    const currentMins = getCurrentMinutes()

    const isOpenRightNow = currentMins >= startMinutes && currentMins < endMinutes
    return { status: isOpenRightNow ? 'Open Now' : 'Closed', isOpen: isOpenRightNow }
  }

  return { status: 'Open', isOpen: true }
}

export const getNextAvailableDate = (locationObj, todayStr = getTodayStr()) => {
  const baseDate = new Date()
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(baseDate)
    checkDate.setDate(baseDate.getDate() + i)
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = locationObj?.schedule?.find(s => s.days.includes(dayName))
    if (daySchedule?.open && daySchedule?.close) {
      return checkDate.toISOString().split('T')[0]
    }
  }
  return todayStr
}

export const getMinDate = (locationObj) => {
  const todayStr = getTodayStr()
  const todayStatus = getLocationStatus(locationObj, todayStr)
  return todayStatus.isOpen ? todayStr : getNextAvailableDate(locationObj, todayStr)
}

export const isLessThan24HoursAway = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false
  const formattedTime = timeStr.length === 5 ? timeStr : `${timeStr.padStart(5, '0')}`
  const targetDateTime = new Date(`${dateStr}T${formattedTime}:00`)
  const diffInMs = targetDateTime - new Date()
  return diffInMs / (1000 * 60 * 60) < 24
}

export const calculateAvailableTimeSlots = ({
  activeLocation,
  selectedDate,
  todayStr,
  currentMinutesNow,
  partySize,
  existingReservation
}) => {
  if (!activeLocation) return []

  const [year, month, day] = selectedDate.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })

  const daySchedule = activeLocation.schedule.find(s => s.days.includes(dayName))
  if (!daySchedule?.open || !daySchedule?.close) return []

  const [openH, openM] = daySchedule.open.split(':').map(Number)
  const [closeH, closeM] = daySchedule.close.split(':').map(Number)

  const startMinutes = openH * 60 + openM
  const endMinutes = closeH * 60 + closeM
  const slots = []
  const isToday = selectedDate === todayStr

  for (let time = startMinutes; time < endMinutes; time += 30) {
    if (isToday && time <= currentMinutesNow) continue

    const hours = Math.floor(time / 60)
    const mins = time % 60
    const valueStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`

    const period = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 === 0 ? 12 : hours % 12
    const minStr = mins < 10 ? `0${mins}` : mins
    const displayTimeStr = `${hours12}:${minStr} ${period}`

    let seatsRemaining = getAvailableSeats(activeLocation.id, selectedDate, valueStr)

    const pendingFormSeats = formList
      .filter(b => {
        if (existingReservation && b.id === existingReservation.id) return false
        const locId = b.locationId || b.location
        const bTime = b.timeValue || b.timeSlot || b.time
        return locId === activeLocation.id && b.date === selectedDate && bTime === valueStr
      })
      .reduce((sum, b) => sum + parseInt(b.guests || b.partySize || b.seatsBooked || 1, 10), 0)

    seatsRemaining = Math.max(0, seatsRemaining - pendingFormSeats)
    const isAvailable = seatsRemaining >= partySize

    let capacityLabel = ''
    if (seatsRemaining === 0) {
      capacityLabel = ' (Fully Booked)'
    } else if (!isAvailable) {
      capacityLabel = ` (Only ${seatsRemaining} seat${seatsRemaining > 1 ? 's' : ''} left)`
    } else {
      capacityLabel = ` (${seatsRemaining} seats left)`
    }

    slots.push({
      value: valueStr,
      displayTime: displayTimeStr,
      label: `${displayTimeStr}${capacityLabel}`,
      minutes: time,
      seatsRemaining,
      isAvailable
    })
  }

  return slots
}