import ThemedCalender from '../../components/ui/ThemedCalender';

import useLocationGuestDateTime from '../../hooks/useLocationGuestDateTime.js';

const IsCalenderOpen = () => {
  const { isCalendarOpen, setIsCalendarOpen } = useLocationGuestDateTime();
  if (!isCalendarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={() => setIsCalendarOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ThemedCalender />
      </div>
    </div>
  );
};

export default IsCalenderOpen;
