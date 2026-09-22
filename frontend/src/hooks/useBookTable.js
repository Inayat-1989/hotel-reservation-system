import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { validateContactDetails } from '../utils/validationUtils.js';
import useBooking from './useBooking.js';

export const useBookTable = () => {
  const { bookingData, updateContactInfo, setErrorMessage } = useBooking();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceed = () => {
    if (bookingData.reservationId === null) {
      navigate('/location-date-time');
      return;
    }

    const { name, email, phone, note } = formData;

    const validationError = validateContactDetails({ name, email, phone });
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const contactInfo = { name, email, phone, note };
    updateContactInfo(contactInfo);

    if (bookingData.specialMenuItems === null) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      sessionStorage.setItem(
        'pendingHoldExpiry',
        (Date.now() + FIFTEEN_MINUTES_IN_MS).toString()
      );
      navigate('/email-verification');
      return;
    }

    navigate('/special-menu-selection');
  };

  return {
    state: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      note: formData.note,
    },
    actions: {
      handleChange,
      handleProceed,
    },
  };
};
