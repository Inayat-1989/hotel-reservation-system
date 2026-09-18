import { useLocation } from "react-router-dom";
import { useGuestDateTime } from "../../../assets/hooks/useGuestDateTime.js";
import { useLocationDateTime } from "../../../assets/hooks/useLocationDateTime.js";
const GuestDateTimeSelect = ({selectedDate, selectedTime, guests, availableSlots, setSelectedTime, setGuests, setIsCalendarOpen, isEditMode, handleProceed }) => {

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">Guests</label>
          <select 
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
              <option key={num} value={num} className="bg-[#171717] text-white">
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">Select Date</label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] flex items-center gap-3 min-w-42.5 justify-between hover:bg-black/70 transition-all"
          >
            <span>{selectedDate || 'Select Date'}</span>
            <span className="text-xs opacity-70">📅</span>
          </button>
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">Select Time Slot (30 min)</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] disabled:opacity-50"
          >
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <option 
                  key={slot.value24} 
                  value={slot.value24} 
                  className="bg-[#171717] text-white disabled:text-[#737373]"
                >
                  {slot.display12}
                </option>
              ))
            ) : (
              <option value="" disabled className="bg-[#171717] text-[#737373]">
                Closed / No slots on this date
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
        >
          {isEditMode ? "Save Changes" : "Book a Table"}
        </button>
      </div>
    </>
  );
};

export default GuestDateTimeSelect;