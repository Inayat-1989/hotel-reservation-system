import React from 'react';
import ThemedCalender from '../ThemedCalender';

const IsCalenderOpen = ({ 
  isCalendarOpen, 
  setIsCalendarOpen, 
  selectedDate, 
  setSelectedDate, 
  selectedLocationId, 
}) => {
  if (!isCalendarOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={() => setIsCalendarOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ThemedCalender
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(selectedLocationId, newDate)}
          onClose={() => setIsCalendarOpen(false)}
        />
      </div>
    </div>
  );
};

export default IsCalenderOpen;