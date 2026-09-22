import useBooking from '../../hooks/useBooking.js';
import {
  getTimeNow,
  parseValueFromDate,
} from '../../utils/locationDateTimeUtils.js';

const SelectedLocationDetail = ({ onChangeDetails }) => {
  const { bookingData } = useBooking();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h3 className="text-sm font-semibold text-[#c93400] uppercase tracking-wider">
          Selected Reservation Details
        </h3>
        <button
          type="button"
          onClick={onChangeDetails}
          className="text-xs text-gray-400 hover:text-white underline transition-colors"
        >
          Change Details
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div>
          <span className="block text-xs text-gray-400 font-medium">
            Location
          </span>
          <span className="text-base font-semibold text-white">
            {bookingData?.locationId}
          </span>
        </div>
        <div>
          <span className="block text-xs text-gray-400 font-medium">Date</span>
          <span className="text-base font-semibold text-white">
            {bookingData?.date
              ? bookingData.date
              : parseValueFromDate(getTimeNow('adjusted'))}
          </span>
        </div>
        <div>
          <span className="block text-xs text-gray-400 font-medium">
            Time Slot
          </span>
          <span className="text-base font-semibold text-white">
            {bookingData?.timeSlot}
          </span>
        </div>
        <div>
          <span className="block text-xs text-gray-400 font-medium">
            Guests
          </span>
          <span className="text-base font-semibold text-white">
            {bookingData?.guests}{' '}
            {bookingData.guests === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectedLocationDetail;
