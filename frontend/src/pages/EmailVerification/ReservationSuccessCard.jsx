const ReservationSuccessCard = ({ booking, onHomeClick }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-5xl">🎉</div>
      <h1 className="text-3xl font-bold text-emerald-400">
        Reservation Completed!
      </h1>
      <p className="text-sm text-gray-300">
        Your table is officially locked in for{' '}
        <strong className="text-white">
          {booking.fullName || booking.name}
        </strong>
        .
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs md:text-sm space-y-2">
        <p>
          <strong className="text-gray-400">Location:</strong>{' '}
          {booking.locationName || booking.location}
        </p>
        <p>
          <strong className="text-gray-400">Date & Time:</strong> {booking.date}{' '}
          at {booking.timeLabel || booking.time}
        </p>
        <p>
          <strong className="text-gray-400">Guests:</strong> {booking.guests}{' '}
          Guests
        </p>
        {booking.specialItems?.length > 0 && (
          <p>
            <strong className="text-amber-400">Special Dishes:</strong>{' '}
            {booking.specialItems.map((i) => i.title).join(', ')}
          </p>
        )}
      </div>

      <button
        onClick={onHomeClick}
        className="mt-4 px-8 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white hover:text-black transition-colors"
      >
        Return to Home
      </button>
    </div>
  );
};

export default ReservationSuccessCard;
