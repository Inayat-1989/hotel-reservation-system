const ReservationCard = ({ reservation, onEdit, onCancel }) => {
  const isUpcoming = isBookingUpcoming(reservation.date, reservation.time);
  const name = findPerson(reservation.email).name;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all">
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-white">
            {reservation.locationId}
          </span>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isUpcoming
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {isUpcoming ? 'Confirmed' : 'Completed'}
          </span>
          {reservation.hasSpecialMenu && (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Special Menu
            </span>
          )}
        </div>

        <div className="text-xs text-gray-300 space-y-1">
          <p>
            👤 <strong className="text-white">{name || 'Guest'}</strong> (
            {reservation.email || 'N/A'})
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <span>
              📅 <strong className="text-white">{reservation.date}</strong>
            </span>
            <span>
              ⏰ <strong className="text-white">{reservation.time}</strong>
            </span>
            <span>
              👥{' '}
              <strong className="text-white">
                {reservation.guests} Guests
              </strong>
            </span>
          </div>
        </div>

        {reservation.specialRequests && (
          <p className="text-xs text-gray-400 italic bg-black/30 p-2 rounded-lg border border-white/5">
            "{reservation.specialRequests}"
          </p>
        )}
      </div>

      {isUpcoming && (
        <div className="w-full md:w-auto flex md:flex-col justify-end gap-2 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
          <button
            type="button"
            onClick={() => onEdit(reservation)}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500 hover:text-white transition-colors"
          >
            Change Details
          </button>
          <button
            type="button"
            onClick={() => onCancel(reservation.id)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
