import {
  findLocationObject,
  calculateSlotSeats,
} from '../services/location-date-time.js';

export const getToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getTimeNow = () => {
  const now = new Date();
  return adjustTime(now);
};

export const parseValueFromDate = (date) => {
  let [year, month, day] = date.toLocaleDateString().split('/');
  return `${year}-${month}-${day}`;
};

export const getStringDate = (date) => {
  date = date.split('T')[0];
  return date;
  // const [year, month, day] = date.split('-');
  // return `${year}-${month}-${day}`;
};

export const parseDatefromValue = (value) => {
  let [year, month, day] = value.split('-');
  const date = new Date(year, month - 1, day);
  return date;
};

export const formatDisplayTime = (dateObj) => {
  const hours = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const pad2 = (num) => String(num).padStart(2, '0');

  return `${pad2(hours12)}:${pad2(mins)} ${period}`;
};

export const calculateAvailableTimeSlots = (locationId, selectedDate) => {
  const location = findLocationObject(locationId); // we would need to change this, find the selected location object from DB later
  if (!location) {
    return [];
  }

<<<<<<< HEAD
  const now = getTimeNow();

  const [openHour, openMin] = location.open.split(':').map(Number);
  const [closeHour, closeMin] = location.close.split(':').map(Number);

  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const closeDateTime = new Date(selectedDate);
  closeDateTime.setHours(closeHour, closeMin, 0, 0);
  if (isToday) {
    if (closeDateTime <= now) return [];
    return calculateSlotSeats(locationId, get30MinList(now, closeDateTime));
=======
  const date = getTodayStr();
  let time = location.open;

  if (date === selectedDate) {
    if (location.close <= time) return [];
    time = getTimeNow();
>>>>>>> 3445e5576719aca6106eb4aad5413717a53e7849
  }

  const openDateTime = new Date(selectedDate);
  openDateTime.setHours(openHour, openMin, 0, 0);

  return calculateSlotSeats(
    locationId,
    get30MinList(openDateTime, closeDateTime)
  );
};

export const adjustTime = (dateObj) => {
  const d = new Date(dateObj);
  const min = d.getMinutes();

  if (min > 0 && min <= 30) {
    d.setMinutes(30, 0, 0);
  } else if (min > 30 && min <= 59) {
    d.setHours(d.getHours() + 1, 0, 0, 0);
  } else if (min === 0) {
    d.setMinutes(0, 0, 0);
  }
  return d;
};

const get30MinList = (startDateTime = getTimeNow(), endDateTime) => {
  if (!startDateTime || !endDateTime) return [];

  let current = adjustTime(new Date(startDateTime));
  const end = new Date(endDateTime);
  const slots = [];

  while (current < end) {
    slots.push({
      value24: new Date(current),
      display12: formatDisplayTime(current),
      minutes: current.getHours() * 60 + current.getMinutes(), // I guess we don't need this
    });

    current = new Date(current.getTime() + 30 * 60 * 1000);
  }

  return slots;
};

export const isLessThan24HoursAway = (targetDate) => {
  if (
    !targetDate ||
    !(targetDate instanceof Date) ||
    isNaN(targetDate.getTime())
  )
    return false;

  const now = getTimeNow();

  const diffInMs = targetDate.getTime() - now.getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  return diffInMs >= 0 && diffInMs < twentyFourHoursInMs;
};
