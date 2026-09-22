import { location } from '../services/location-date-time';

export const getToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getTimeNow = (condition) => {
  const now = new Date();
  if (condition === 'midnight') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  return adjustTime(now);
  // else if (condition === 'adjusted') {
  //   return adjustTime(now);
  // }
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

export const parseValueFromDate = (date) => {
  const [year, month, day] = date.toLocaleDateString().split('/');
  return `${year}-${month}-${day}`;
};

export const parseDatefromValue = (date) => {
  const [y, m, d] = date.split('-');
  return adjustTime(new Date(new Date().setFullYear(y, m - 1, d)));
};

export const formatDisplayTime = (dateObj) => {
  const hours = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const pad2 = (num) => String(num).padStart(2, '0');

  return `${pad2(hours12)}:${pad2(mins)} ${period}`;
};

export const calculateAvailableTimeSlots = (selectedDate) => {
  if (!location) {
    return [];
  }

  const now = getTimeNow('adjusted');

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
    return get30MinList(now, closeDateTime);
  }
  const openDateTime = new Date(selectedDate);
  openDateTime.setHours(openHour, openMin, 0, 0);

  return get30MinList(openDateTime, closeDateTime);
};

const get30MinList = (startDateTime = getTimeNow('adjusted'), endDateTime) => {
  if (!startDateTime || !endDateTime) return [];

  let current = adjustTime(new Date(startDateTime));
  const end = new Date(endDateTime);
  const slots = [];

  while (current < end) {
    slots.push({
      value24: new Date(current),
      display12: formatDisplayTime(current),
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

  const now = getTimeNow('adjusted');

  const diffInMs = targetDate.getTime() - now.getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  return diffInMs >= 0 && diffInMs < twentyFourHoursInMs;
};
