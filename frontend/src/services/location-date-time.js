import { parseValueFromDate } from '../utils/locationDateTimeUtils';

export const location = {
  id: 'Downtown',
  name: 'Downtown',
  address: '100 Culinary Way, Suite 400',
  phone: '+92 341 5054871',
  status: 'Open Now',
  totalSeats: 48,
  open: '10:30',
  close: '22:00',
  label: '11:00 AM – 10:00 PM',
};

export const slotBookings = {};

export const getAvailableSeats = (date, timeSlot) => {
  date = parseValueFromDate(date);
  if (!location) return 0;

  if (!date || !timeSlot) return location.totalSeats;

  const key = `${date}_${timeSlot}`;
  const bookedSeats = slotBookings[key] || 0;

  return Math.max(0, location.totalSeats - bookedSeats);
};

export const calculateSlotSeats = (slotList) => {
  if (!location) return 0;
  slotList = slotList.map((slot) => {
    let seats = getAvailableSeats(slot.value24, slot.display12);
    const key = `${parseValueFromDate(slot.value24)}_${slot.display12}`;
    slotBookings[key] = slotBookings[key] || seats;
    return { ...slot, seats: slotBookings[key] };
  });
  return slotList;
};

export const reserveSeats = (date, timeSlot, guests) => {
  const guestCount = parseInt(guests, 10) || 0;

  if (!location || !date || !timeSlot || guestCount <= 0) return false;

  const key = `${date}_${timeSlot}`;
  const currentBooked = slotBookings[key] || 0;
  const remaining = location.totalSeats - currentBooked;

  if (remaining >= guestCount) {
    slotBookings[key] = currentBooked + guestCount;
    return true;
  }

  return false;
};

export const releaseSeats = (date, timeSlot, guests) => {
  const guestCount = parseInt(guests, 10) || 0;
  if (!date || !timeSlot || guestCount <= 0) return;

  const key = `${date}_${timeSlot}`;
  const currentBooked = slotBookings[key] || 0;

  slotBookings[key] = Math.max(0, currentBooked - guestCount);
};
