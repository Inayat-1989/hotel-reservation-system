import { useContext, useState, useMemo, useEffect } from 'react';
import { LocationGuestDateTimeContext } from '../../context/LocationGuestDateTime.jsx';
import { getToday } from '../../utils/locationDateTimeUtils.js';

const ThemedCalender = () => {
  const {
    isCalendarOpen,
    setSelectedDate,
    selectedDate,
    setIsCalendarOpen,
    selectedLocationId,
  } = useContext(LocationGuestDateTimeContext);

  const [viewDate, setViewDate] = useState(() => new Date(selectedDate));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewDate(new Date(selectedDate));
  }, [selectedDate]);

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

      const isDisabled = date < getToday();

      days.push({ day: d, dateStr: formattedDate, date, isDisabled });
    }
    return days;
  }, [viewDate]);

  return (
    <div className="relative w-full max-w-xs select-none rounded-3xl border border-white/20 bg-[#171717] p-6 text-white shadow-2xl">
      {isCalendarOpen && (
        <button
          type="button"
          onClick={() => setIsCalendarOpen(false)}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-sm text-[#999999] hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      )}

      <div
        className={`mb-5 flex items-center justify-between ${isCalendarOpen ? 'pr-6' : ''}`}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded-lg p-2 text-xs text-[#999999] hover:bg-white/10 hover:text-white"
        >
          ◀
        </button>
        <span className="text-base font-semibold text-[#c93400]">
          {viewDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded-lg p-2 text-xs text-[#999999] hover:bg-white/10 hover:text-white"
        >
          ▶
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#999999]">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {calendarDays.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} />;

          const isSelected =
            selectedDate &&
            item.day === selectedDate.getDate() &&
            viewDate.getMonth() === selectedDate.getMonth() &&
            viewDate.getFullYear() === selectedDate.getFullYear();

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isDisabled}
              onClick={() => {
                setSelectedDate(selectedLocationId, item.date);
                if (isCalendarOpen) setIsCalendarOpen(false);
              }}
              className={`flex h-9 items-center justify-center rounded-xl text-xs font-medium transition-all duration-150 ${
                isSelected
                  ? 'scale-105 bg-[#c93400] font-bold text-white shadow-lg shadow-[#c93400]/40'
                  : item.isDisabled
                    ? 'cursor-not-allowed text-white/20 line-through'
                    : 'text-white hover:bg-white/15'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemedCalender;
