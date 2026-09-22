import { useState, useMemo } from 'react';
import { getTimeNow } from '../utils/locationDateTimeUtils';

export const useThemedCalendar = () => {
  const [viewDate, setViewDate] = useState(getTimeNow());

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const date = new Date(year, month, d);
      const formattedDate = `${year}-${monthStr}-${dayStr}`;

      const isDisabled = date < getTimeNow('midnight');

      days.push({ day: d, dateStr: formattedDate, date, isDisabled });
    }
    return days;
  }, [viewDate]);

  return {
    state: {
      calendarDays,
      viewDate,
    },
    actions: {
      setViewDate,
      handleNextMonth,
      handlePrevMonth,
    },
  };
};
