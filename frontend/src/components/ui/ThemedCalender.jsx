import { useThemedCalendar } from '../../hooks/useThemedCalender.js';

const ThemedCalender = ({ setSelectedDate }) => {
  const { state, actions } = useThemedCalendar();
  const { calendarDays, viewDate } = state;
  const { setViewDate, handleNextMonth, handlePrevMonth } = actions;

  return (
    <div className="relative w-full max-w-xs select-none rounded-3xl text-white bg-[#c93400] border border-white/20 bg-[#171717] p-6 text-white shadow-2xl">
      <div className={'mb-5 flex items-center justify-between'}>
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded-lg p-2 text-xs text-[#999999] hover:bg-white/60 hover:text-white bg-white"
        >
          ◀
        </button>
        <span className="text-base font-semibold text-white">
          {viewDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded-lg p-2 text-xs text-[#999999] hover:bg-white/60 hover:text-white bg-white"
        >
          ▶
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#c93400] bg-white">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {calendarDays.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} />;

          const isSelected =
            viewDate &&
            item.day === viewDate.getDate() &&
            item.date.getMonth() === viewDate.getMonth() &&
            item.date.getFullYear() === viewDate.getFullYear();

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isDisabled}
              onClick={() => {
                setSelectedDate(item.date);
                setViewDate(item.date);
              }}
              className={`flex h-9 items-center justify-center rounded-xl text-xs font-medium transition-all duration-150 ${
                isSelected
                  ? 'scale-105 bg-[#2b62e3] font-bold text-white shadow-lg shadow-[#c93400]/40'
                  : item.isDisabled
                    ? 'cursor-not-allowed text-white/20 line-through'
                    : 'text-[#c93400] bg-white/40 hover:bg-white/90'
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
