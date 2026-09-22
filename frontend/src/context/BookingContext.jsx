import { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const BookingContext = createContext(null);

const initialBookingState = {
  locationId: null,
  date: null,
  timeSlot: null,
  guests: 1,
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    note: '',
  },
  specialMenuItems: null,
  reservationId: null,
  status: 'IDLE',
};

const STORAGE_KEY = 'active_booking_draft';

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : initialBookingState;
    } catch (error) {
      console.error('Failed to load booking state from sessionStorage', error);
      return initialBookingState;
    }
  });
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    } catch (error) {
      console.error('Failed to save booking state to sessionStorage', error);
    }
  }, [bookingData]);

  const updateLocation = (locationId) => {
    setBookingData((prev) => ({ ...prev, locationId }));
  };

  const updateDateTimeGuests = (selection) => {
    setBookingData((prev) => ({
      ...prev,
      date: selection.date ?? prev.date,
      timeSlot: selection.timeSlot ?? prev.timeSlot,
      guests: selection.guests ?? prev.guests,
    }));
  };

  const updateContactInfo = (contactInfo) => {
    setBookingData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactInfo },
    }));
  };

  const updateSpecialMenu = (specialMenuItems) => {
    setBookingData((prev) => ({ ...prev, specialMenuItems }));
  };

  const setReservationMeta = (reservationId, status) => {
    setBookingData((prev) => ({ ...prev, reservationId, status }));
  };

  const clearBooking = () => {
    setBookingData(initialBookingState);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        errorMessage,
        updateLocation,
        updateDateTimeGuests,
        updateContactInfo,
        updateSpecialMenu,
        setReservationMeta,
        clearBooking,
        setErrorMessage: handleErrorMessage,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
