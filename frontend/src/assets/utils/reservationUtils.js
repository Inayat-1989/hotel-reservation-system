import { formList } from '../../components/data-storage/form-data.js'
import { locationList } from '../constant-data/location-date-time.js'

export const check24HourGap = (date, time) => {
  if (!date || !time) return false
  const formattedTime = time.length === 5 ? time : time.padStart(5, '0')
  const bookingDateTime = new Date(`${date}T${formattedTime}:00`)
  const now = new Date()
  const diffInHours = (bookingDateTime - now) / (1000 * 60 * 60)
  return diffInHours >= 24
}

export const getAvailableSeatsForSlot = (locationId, date, time, totalSeats) => {
  const existingBookingsForSlot = formList.filter(
    (b) => b.location === locationId && b.date === date && b.time === time
  )

  const totalBookedSeats = existingBookingsForSlot.reduce(
    (sum, b) => sum + parseInt(b.guests || 0, 10),
    0
  )

  return (totalSeats || 0) - totalBookedSeats
}

export const checkForDuplicateBooking = (email, locationId, date, time) => {
  const trimmedEmail = (email || '').trim().toLowerCase()
  const pendingReservation = JSON.parse(
    sessionStorage.getItem('pendingReservation') || 'null'
  )

  const existsInList = formList.some(
    (b) =>
      b.email?.toLowerCase() === trimmedEmail &&
      b.location === locationId &&
      b.date === date &&
      b.time === time
  )

  const existsInPending =
    pendingReservation &&
    pendingReservation.email?.toLowerCase() === trimmedEmail &&
    pendingReservation.location === locationId &&
    pendingReservation.date === date &&
    pendingReservation.time === time

  return existsInList || Boolean(existsInPending)
}

export const getLocationName = (id) => {
  const loc = locationList.find((l) => l.id === id || l.name === id)
  return loc ? loc.name : id
}

export const isBookingUpcoming = (resDate, resTime) => {
  const bookingDateTime = new Date(`${resDate}T${resTime || '00:00'}`)
  return bookingDateTime >= new Date()
}