import { useState, useRef, useEffect } from 'react';
import {
  getTimeNow,
  parseValueFromDate,
} from '../../utils/locationDateTimeUtils.js';
import useLocationGuestDateTime from '../../hooks/useLocationGuestDateTime.js';
import ThemedCalendar from '../../components/ui/ThemedCalender.jsx'; // Kept your original spelling 'ThemedCalender'

const GuestDateTimeSelect = () => {
  const {
    setGuests,
    selectedDate,
    selectedTime,
    setSelectedTime,
    availableSlots,
    handleProceed,
    setSelectedDate,
  } = useLocationGuestDateTime();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">
            Guests
          </label>
          <select
            value={1}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] h-[38px] min-w-[120px]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num} className="bg-[#171717] text-white">
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">
            Select Date
          </label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className={`bg-black/50 border rounded-xl px-4 py-2 text-white text-sm focus:outline-none flex items-center gap-3 min-w-[170px] h-[38px] justify-between hover:bg-black/70 transition-all ${
              isCalendarOpen ? 'border-[#c93400]' : 'border-white/20'
            }`}
          >
            <span>
              {selectedDate ? parseValueFromDate(selectedDate) : 'Select Date'}
            </span>
            <span className="text-xs opacity-70">📅</span>
          </button>
        </div>

        {isCalendarOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#171717] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in scale-in duration-200">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-sm font-semibold text-[#999999] uppercase tracking-wider">
                  Choose Date
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-white/60 hover:text-white text-lg transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center">
                <ThemedCalendar setSelectedDate={setSelectedDate} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">
            Select Time Slot (30 min)
          </label>
          <select
            value="Select Time"
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] disabled:opacity-50 h-[38px] min-w-[200px]"
          >
            {availableSlots ? (
              availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option
                    key={slot.value24}
                    value={slot.display12}
                    className="bg-[#171717] text-white disabled:text-[#737373]"
                  >
                    {slot.display12}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  disabled
                  className="bg-[#171717] text-[#737373]"
                >
                  Closed / No slots on this date
                </option>
              )
            ) : (
              <option disabled className="bg-[#171717] text-[#737373]">
                No slots Refresh
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="pt-8 text-center">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
        >
          Book a Table
        </button>
      </div>
    </>
  );
};

export default GuestDateTimeSelect;
