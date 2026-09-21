const DuplicateBooking = ({
  email,
  date,
  timeLabel,
  onClose,
  onViewBookings,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-rose-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-xl font-bold text-rose-400">
          Existing Booking Found
        </h3>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          You already have an active or pending reservation registered under{' '}
          <strong>{email}</strong> for this location on <strong>{date}</strong>{' '}
          at <strong>{timeLabel}</strong>.
        </p>
        <p className="text-xs text-gray-400">
          Please select a different date or time, or check your existing
          reservation status.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            Close & Edit Details
          </button>
          <button
            onClick={onViewBookings}
            className="flex-1 py-2.5 rounded-xl bg-[#c93400] text-white text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateBooking;
