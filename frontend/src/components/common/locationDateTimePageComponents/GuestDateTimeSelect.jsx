import React from 'react';

const GuestDateTimeSelect = ({
  partySize, 
  setPartySize, 
  setIsCalendarOpen, 
  selectedDate, 
  selectedTime, 
  availableTimeSlots, 
  setSelectedTime, 
  handleProceed, 
  existingReservation
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">Guests</label>
          <select 
            value={partySize}
            onChange={setPartySize}
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
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] flex items-center gap-3 min-w-[170px] justify-between hover:bg-black/70 transition-all"
          >
            <span>{selectedDate || 'Select Date'}</span>
            <span className="text-xs opacity-70">📅</span>
          </button>
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs text-[#999999] mb-1 font-medium">Select Time Slot (30 min)</label>
          <select 
            value={selectedTime}
            onChange={setSelectedTime}
            disabled={availableTimeSlots.filter(s => s.isAvailable).length === 0}
            className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] disabled:opacity-50"
          >
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot) => (
                <option 
                  key={slot.value} 
                  value={slot.value} 
                  disabled={!slot.isAvailable}
                  className="bg-[#171717] text-white disabled:text-[#737373]"
                >
                  {slot.label}
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
          onClick={handleProceed}
          className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
        >
          {existingReservation ? "Save Changes" : "Book a Table"}
        </button>
      </div>
    </>
  );
};

export default GuestDateTimeSelect;