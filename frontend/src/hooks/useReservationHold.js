import { useState, useEffect } from 'react';

import { removeReservation } from '../services/form-data.js';

export const useReservationHold = (targetId, isVerified) => {
  const calculateRemainingSeconds = () => {
    const expiry = sessionStorage.getItem('pendingHoldExpiry');
    if (!expiry) return 0;
    const remaining = Math.floor((parseInt(expiry, 10) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemainingSeconds);

  useEffect(() => {
    if (isVerified || !targetId) return;

    const timer = setInterval(() => {
      const remaining = calculateRemainingSeconds();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        removeReservation(targetId);
        sessionStorage.removeItem('pendingHoldExpiry');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified, targetId]);

  const clearHold = () => {
    if (targetId) {
      removeReservation(targetId);
      sessionStorage.removeItem('pendingHoldExpiry');
    }
  };

  return { timeLeft, clearHold };
};
