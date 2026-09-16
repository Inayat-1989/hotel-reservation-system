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
    id: formData.id || Date.now().toString(),
    status: 'pending',
    createdAt: Date.now()
  }
  formList.push(pendingBooking)
  return pendingBooking
}

export const confirmReservation = (bookingId) => {
  const index = formList.findIndex((item) => item.id === bookingId)
  
  if (index !== -1 && formList[index].status !== 'confirmed') {
    const booking = formList[index]
    
    // Normalize properties
    const locationId = booking.locationId || booking.location
    const date = booking.date
    const timeSlot = booking.timeValue || booking.timeSlot || booking.time
    const guestCount = parseInt(booking.guests || booking.partySize || booking.seatsBooked || 1, 10)

    // Deduct seats from specific slot capacity
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
    
    // If it was confirmed, release seats for that specific slot
    if (booking.status === 'confirmed') {
      const locationId = booking.locationId || booking.location
      const date = booking.date
      const timeSlot = booking.timeValue || booking.timeSlot || booking.time
      const guestCount = parseInt(booking.guests || booking.partySize || booking.seatsBooked || 1, 10)

      releaseSeats(locationId, date, timeSlot, guestCount)
    }

    formList.splice(index, 1)
  }
}

// form-data.js
export const updateReservation = (reservationData) => {
  // 1. Don't save empty/invalid forms
  if (!reservationData.id) return;

  const existingIndex = formList.findIndex(item => item.id === reservationData.id);

  if (existingIndex !== -1) {
    // Update existing entry in-place
    formList[existingIndex] = { ...formList[existingIndex], ...reservationData };
  } else {
    // Check if a record with identical details already exists to prevent duplicate placeholders
    const duplicateIndex = formList.findIndex(item => 
      item.locationId === reservationData.locationId &&
      item.date === reservationData.date &&
      item.timeValue === reservationData.timeValue &&
      (item.customerName === 'N/A' || !item.customerName)
    );

    if (duplicateIndex !== -1) {
      // Overwrite the 'N/A' placeholder instead of creating a second entry
      formList[duplicateIndex] = { ...formList[duplicateIndex], ...reservationData };
    } else {
      // Push new valid reservation
      formList.push(reservationData);
    }
  }
};

export { getAvailableSeats }