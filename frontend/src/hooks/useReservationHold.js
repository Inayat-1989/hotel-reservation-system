import { useState, useEffect, useCallback, useRef } from 'react';
import useBooking from './useBooking.js';

export const useReservationHold = (isVerified) => {
  const { bookingData, clearBooking } = useBooking();
  const targetId = bookingData?.reservationId;

  const calculateRemainingSeconds = useCallback(() => {
    const expiry = sessionStorage.getItem('pendingHoldExpiry');
    if (!expiry) return 0;
    const remaining = Math.floor((parseInt(expiry, 10) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateRemainingSeconds);

  const clearHold = useCallback(() => {
    sessionStorage.removeItem('pendingHoldExpiry');
    clearBooking();
    setTimeLeft(0);
  }, [clearBooking]);

  const clearHoldRef = useRef(clearHold);
  useEffect(() => {
    clearHoldRef.current = clearHold;
  }, [clearHold]);

  useEffect(() => {
    // Stop evaluation cleanly if checked out successfully or reservation instance drops out
    if (isVerified || !targetId) {
      return;
    }

    const initialRemaining = calculateRemainingSeconds();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(initialRemaining);

    if (initialRemaining <= 0) {
      clearHoldRef.current();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateRemainingSeconds();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        clearHoldRef.current();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified, targetId, calculateRemainingSeconds]);

  return { timeLeft, clearHold };
};
