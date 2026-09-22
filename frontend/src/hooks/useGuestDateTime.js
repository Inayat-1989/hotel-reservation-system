import { useState } from 'react';

import {
  calculateAvailableTimeSlots,
  formatDisplayTime,
  getTimeNow,
} from '../utils/locationDateTimeUtils.js';

import { locationList } from '../services/location-date-time.js';

export const useGuestDateTime = () => {
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(getTimeNow())
  );
  const [selectedTime, setSelectedTime] = useState(
    formatDisplayTime(getTimeNow())
  );
  const [availableSlots, setAvailableSlots] = useState(() =>
    calculateAvailableTimeSlots(locationList[0].id, getTimeNow())
  );

  const handleTimeChange = (e) => {
    setSelectedTime(e);
  };

  const handleGuestsChange = (e) => {
    const val = e;
    setGuests(Math.max(1, Number(val) || 1));
  };

  return {
    dateTimeState: {
      selectedDate,
      selectedTime,
      guests,
      availableSlots,
    },
    dateTimeActions: {
      setSelectedDate,
      setSelectedTime: handleTimeChange,
      setGuests: handleGuestsChange,
      setAvailableSlots,
    },
  };
};
