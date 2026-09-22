import { useState } from 'react';

import { locationList } from '../services/location-date-time.js';

export const useLocationDateTime = () => {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locationList[0].id
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);

  return {
    locationState: {
      selectedLocationId,
      isCalendarOpen,
      showClosedModal,
    },
    locationActions: {
      setSelectedLocationId,
      setIsCalendarOpen,
      setShowClosedModal,
    },
  };

  // const navigate = useNavigate();
  // const location = useLocation();

  // we will check this from local storage, we can pass the state as we are doing right now, works fine, no need to add complexity
  /* const isEditMode = Boolean(location.state?.targetId); */

  // same no changes
  /* const targetId = location.state?.targetId; */

  /* const handleProceed = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let message = '';

    if (!selectedTime) {
      setShowClosedModal(true);
      return;
    }

    const selectedSlot = availableSlots?.find(
      (slot) => slot.value24 === selectedTime
    );
    if (isEditMode) {
      const targetId = location.state.targetId;
      const form = findForm(targetId);
      releaseSeats(form.locationId, form.date, form.time, form.guests);
    }
    if (!reserveSeats(selectedLocationId, selectedDate, selectedTime, guests)) {
      setShowClosedModal(true);
      return;
    }
    const isUrgentBooking = isLessThan24HoursAway(selectedDate, selectedTime);

    if (isUrgentBooking) {
      message = "Less than 24 Hour Booking Special Items won't be allowed.";
    }

    if (isUrgentBooking === null) {
      navigate('/menu', { state: {} });
      return;
    }

    const targetId = isEditMode
      ? location.state.id
      : `RES-${Date.now().toString().slice(-6)}`;

    const bookingDetails = {
      id: targetId,
      status: 'upcoming',
      locationId: selectedLocationId,
      date: selectedDate,
      time: selectedTime,
      timeLabel: selectedSlot?.display12 || selectedTime,
      guests: guests,
      hasSpecialMenu: !isUrgentBooking,
      specialItems: isUrgentBooking ? [] : location.state?.specialItems || [],
      message: message,
    };

    if (isEditMode) {
      updateReservation(bookingDetails);
    } else {
      addPendingReservation(bookingDetails);
    }

    navigate('/book-table', { state: { targetId } });
  }; */
};
