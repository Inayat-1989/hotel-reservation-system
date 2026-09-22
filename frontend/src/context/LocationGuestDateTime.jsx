import { createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useBooking from '../hooks/useBooking';
import { useGuestDateTime } from '../hooks/useGuestDateTime';

import {
  getTimeNow,
  calculateAvailableTimeSlots,
  isLessThan24HoursAway,
  parseValueFromDate,
} from '../utils/locationDateTimeUtils';

// eslint-disable-next-line react-refresh/only-export-components
export const LocationGuestDateTimeContext = createContext(null);

export const LocationGuestDateTimeProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    bookingData,
    updateLocation,
    updateDateTimeGuests,
    updateSpecialMenu,
    setReservationMeta,
  } = useBooking();
  // const { locationState, locationActions } = useLocationDateTime();
  const { dateTimeState, dateTimeActions } = useGuestDateTime();

  // const { selectedLocationId, isCalendarOpen, showClosedModal, errorMessage } =
  //   locationState;
  // const {
  //   setSelectedLocationId,
  //   setIsCalendarOpen,
  //   setShowClosedModal,
  //   setErrorMessage,
  // } = locationActions;

  const { selectedDate, selectedTime, guests, availableSlots } = dateTimeState;
  const { setSelectedDate, setSelectedTime, setGuests } = dateTimeActions;

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate)
  };

  const handleIsCalenderOpen = (value) => {
    // setIsCalendarOpen(value);
  };

  const handleShowClosedModel = (value) => {
    // setShowClosedModal(value);
  };

  const handleProceed = () => {
    const reservationId = location?.state?.reservationId;
    const formattedDate = parseValueFromDate(selectedDate);
    let isEdit = false;
    if (reservationId) {
      isEdit = true;
    }
    // all checks here, if same location date time exists already in the reservation shouldn't allow
    // checks for slots availability and the guest size selection
    // checks

    // if (
    //   !isEdit &&
    //   bookingData.locationId === selectedLocationId &&
    //   bookingData.date === selectedDate &&
    //   bookingData.timeSlot === selectedTime
    // ) {
    //   setErrorMessage(
    //     'Duplicate Reservation:Same Location, Date, Time and Guests.'
    //   );
    //   setShowClosedModal(true);
    //   navigate('/my-reservation');
    // }
    // Before updating location id we have to calculate and release old values
    // let availableSeats = getAvailableSeats(
    //   selectedLocationId,
    //   selectedDate,
    //   selectedTime
    // );
    // if (isEdit) {
    //   bookingData.guests;
    // }
    // updateLocation(selectedLocationId);
    const guestDateTime = {
      date: formattedDate,
      timeSlot: selectedTime,
      guests: guests,
    };
    updateDateTimeGuests(guestDateTime);
    if (isLessThan24HoursAway(selectedDate)) updateSpecialMenu(null);
    else updateSpecialMenu([]);
    setReservationMeta(`RES-${Date.now()}`);

    navigate('/book-table');
  };

  return (
    <LocationGuestDateTimeContext.Provider
      value={{
        // selectedLocationId,
        // setSelectedLocationId: handleLocationSelect,
        // isCalendarOpen,
        // setIsCalendarOpen: handleIsCalenderOpen,
        // showClosedModal,
        // setShowClosedModal: handleShowClosedModel,
        selectedDate,
        setSelectedDate: handleDateSelect,
        selectedTime,
        setSelectedTime,
        guests,
        setGuests,
        availableSlots,
        handleProceed,
      }}
    >
      {children}
    </LocationGuestDateTimeContext.Provider>
  );
};
