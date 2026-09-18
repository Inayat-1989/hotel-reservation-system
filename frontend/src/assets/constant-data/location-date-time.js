import { findForm } from "../../components/data-storage/form-data"
export const locationList = [
  {
    id: 'Downtown',
    name: 'Downtown',
    address: '100 Culinary Way, Suite 400',
    phone: '+92 341 5054871',
    status: 'Open Now',
    totalSeats: 48,
    open: '11:00', 
    close: '22:00',
    label: '11:00 AM – 10:00 PM'
  },
  {
    id: 'Waterfront-Bay',
    name: 'Waterfront-Bay',
    address: '45 Marina Boulevard, Dock 3',
    phone: '+92 313 1133871',
    status: 'Open Now',
    totalSeats: 10,
    open: '12:00', 
    close: '23:00', 
    label: '12:00 PM – 11:00 PM',
  },
  {
    id: 'Uptown-Express',
    name: 'Uptown-Express',
    address: '880 Highland Ave, Building B',
    phone: '+92 320 2224541',
    status: 'Closed',
    totalSeats: 32,
    open: '16:00', 
    close: '22:30', 
    label: '04:00 PM – 10:30 PM' 
  },
]

export const findLocationObject = (locationId) => {
  const location = locationList.find((loc) => loc.id === locationId)
  return location
}

export const slotBookings = {};

export const getLocations = () => locationList;

export const getAvailableSeats = (locationId, date, timeSlot) => {
  const location = findLocationObject(locationId)
  if (!location) return 0;

  if (!date || !timeSlot) return location.totalSeats;

  const key = `${locationId}_${date}_${timeSlot}`;
  const bookedSeats = slotBookings[key] || 0;

  return Math.max(0, location.totalSeats - bookedSeats);
}

export const reserveSeats = (locationId, date, timeSlot, partySize) => {
  const location = locationList.find((loc) => loc.id === locationId);
  const guestCount = parseInt(partySize, 10) || 0;

  if (!location || !date || !timeSlot || guestCount <= 0) return false;

  const key = `${locationId}_${date}_${timeSlot}`;
  const currentBooked = slotBookings[key] || 0;
  const remaining = location.totalSeats - currentBooked;

  if (remaining >= guestCount) {
    slotBookings[key] = currentBooked + guestCount;
    return true;
  }

  return false;
}

export const releaseSeats = (locationId, date, timeSlot, partySize) => {
  const guestCount = parseInt(partySize, 10) || 0;
  if (!locationId || !date || !timeSlot || guestCount <= 0) return;

  const key = `${locationId}_${date}_${timeSlot}`;
  const currentBooked = slotBookings[key] || 0;

  slotBookings[key] = Math.max(0, currentBooked - guestCount);
}

export const actualRemainingSeats = (selectedLocationId, selectedDate, selectedTime, isEditMode, targetId) => {
  let remainingSeats = getAvailableSeats(selectedLocationId, selectedDate, selectedTime)
  if(isEditMode) {
    const form = findForm(targetId)
    if (form.locationId === selectedLocationId) remainingSeats = remainingSeats + form?.guests
  }
  return remainingSeats
}

// export const getAvailableSeatsForSlot = (locationId, date, time, totalSeats) => {
//   const existingBookingsForSlot = formList.filter(
//     (b) => b.location === locationId && b.date === date && b.time === time
//   )

//   const totalBookedSeats = existingBookingsForSlot.reduce(
//     (sum, b) => sum + parseInt(b.guests || 0, 10),
//     0
//   )

//   return (totalSeats || 0) - totalBookedSeats
// }
