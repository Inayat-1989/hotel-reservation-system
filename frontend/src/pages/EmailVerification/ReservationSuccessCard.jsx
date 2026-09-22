import useBooking from '../../hooks/useBooking';

const ReservationSuccessCard = () => {
  const { bookingData } = useBooking();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-5xl">🎉</div>
      <h1 className="text-3xl font-bold text-emerald-400">
        Reservation Completed!
      </h1>
      <p className="text-sm text-gray-300">
        Your table is officially locked in for{' '}
        <strong className="text-white">{bookingData.contactInfo.name}</strong>.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs md:text-sm space-y-2">
        <p>
          <strong className="text-gray-400">Location:</strong>{' '}
          {bookingData.locationId}
        </p>
        <p>
          <strong className="text-gray-400">Date & Time:</strong>{' '}
          {bookingData.date} at {bookingData.timeSlot}
        </p>
        <p>
          <strong className="text-gray-400">Guests:</strong>{' '}
          {bookingData.guests} Guests
        </p>
        {bookingData.specialMenuItems?.length > 0 && (
          <p>
            <strong className="text-amber-400">Special Dishes:</strong>{' '}
            {bookingData.specialMenuItems.map((i) => i.title).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReservationSuccessCard;
