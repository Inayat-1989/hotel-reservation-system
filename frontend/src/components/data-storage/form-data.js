import { 
  locationList, 
  reserveSeats, 
  releaseSeats, 
  getAvailableSeats 
} from "../../assets/constant-data/location-date-time.js"

export const formList = []

export const addPendingReservation = (formData) => {
  const pendingBooking = {
    ...formData,
    status: 'pending',
    createdAt: Date.now()
  }
  formList.push(pendingBooking)
  return pendingBooking
}

const getLocationDateTimeGuest = (booking) => {
  return [booking.locationId, booking.date, booking.time, parseInt(booking.guests, 10)]
}

export const confirmReservation = (bookingId) => {
  const index = formList.findIndex((item) => item.id === bookingId)
  
  if (index !== -1 && formList[index].status !== 'confirmed') {
    const booking = formList[index]
    
    const [locationId, date, timeSlot, guestCount] = getLocationDateTimeGuest(booking)

    const reservedSuccess = reserveSeats(locationId, date, timeSlot, guestCount)

    if (reservedSuccess) {
      formList[index].status = 'confirmed'
      return formList[index]
    }
  }
  return null
}

export const removeReservation = (bookingId) => {
  const index = formList.findIndex((item) => item.id === bookingId)
  if (index !== -1) {
    const booking = formList[index]
    
    if (booking.status === 'confirmed') {
      const [locationId, date, timeSlot, guestCount] = getLocationDateTimeGuest(booking)

      releaseSeats(locationId, date, timeSlot, guestCount)
    }

    formList.splice(index, 1)
  }
}

export const updateReservation = (reservationData) => {
  if (!reservationData.id) return

  const existingIndex = formList.findIndex(item => item.id === reservationData.id)

  if (existingIndex !== -1) {
    formList[existingIndex] = { ...formList[existingIndex], ...reservationData }
  } else {
    return
  }
}

export { getAvailableSeats }