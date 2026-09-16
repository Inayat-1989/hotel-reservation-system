export const timeSlots = [
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
  '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', 
  '08:00 PM', '08:30 PM', '09:00 PM'
];

export const locationList = [
  {
    id: 'downtown',
    name: 'Downtown',
    address: '100 Culinary Way, Suite 400',
    phone: '+1 (555) 019-2834',
    status: 'Open Now',
    totalSeats: 48,
    schedule: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], open: '11:00', close: '22:00', label: '11:00 AM – 10:00 PM' },
      { days: ['Friday', 'Saturday'], open: '11:00', close: '23:30', label: '11:00 AM – 11:30 PM' },
      { days: ['Sunday'], open: '12:00', close: '21:30', label: '12:00 PM – 09:30 PM' },
    ]
  },
  {
    id: 'waterfront',
    name: 'Waterfront Bay',
    address: '45 Marina Boulevard, Dock 3',
    phone: '+1 (555) 019-5582',
    status: 'Open Now',
    totalSeats: 10,
    schedule: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '12:00', close: '23:00', label: '12:00 PM – 11:00 PM' },
      { days: ['Saturday', 'Sunday'], open: '10:00', close: '23:30', label: '10:00 AM – 11:30 PM' },
    ]
  },
  {
    id: 'uptown',
    name: 'Uptown Express',
    address: '880 Highland Ave, Building B',
    phone: '+1 (555) 019-9941',
    status: 'Closed',
    totalSeats: 32,
    schedule: [
      { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], open: '16:00', close: '22:30', label: '04:00 PM – 10:30 PM' },
      { days: ['Monday'], open: null, close: null, label: 'Closed for Maintenance' },
    ]
  }
];

// In-memory slot booking map: key = `${locationId}_${date}_${timeSlot}`
export const slotBookings = {};

export const getLocations = () => locationList;

// Calculate remaining seats for a specific location, date, and time slot
export const getAvailableSeats = (locationId, date, timeSlot) => {
  const location = locationList.find((loc) => loc.id === locationId);
  if (!location) return 0;

  // If no date or time provided, return total capacity
  if (!date || !timeSlot) return location.totalSeats;

  const key = `${locationId}_${date}_${timeSlot}`;
  const bookedSeats = slotBookings[key] || 0;

  return Math.max(0, location.totalSeats - bookedSeats);
};

// Increase bookedSeats for a specific slot when reservation is confirmed
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
};

// Decrease bookedSeats for a specific slot when reservation is canceled
export const releaseSeats = (locationId, date, timeSlot, partySize) => {
  const guestCount = parseInt(partySize, 10) || 0;
  if (!locationId || !date || !timeSlot || guestCount <= 0) return;

  const key = `${locationId}_${date}_${timeSlot}`;
  const currentBooked = slotBookings[key] || 0;

  slotBookings[key] = Math.max(0, currentBooked - guestCount);
};