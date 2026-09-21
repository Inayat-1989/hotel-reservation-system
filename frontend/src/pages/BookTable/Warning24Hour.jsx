const Warning24Hour = ({ onAdjust, onProceedSeatOnly }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="text-4xl">⏰</div>
        <h3 className="text-xl font-bold text-amber-400">
          Special Menu Unavailable
        </h3>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          Special menu items require at least <strong>1 day (24 hours)</strong>{' '}
          advance notice. Because your booking date/time is within 24 hours,
          pre-ordering special dishes will not be available.
        </p>
        <p className="text-xs text-gray-400">
          Would you like to proceed with seat reservation only, or adjust your
          date and time?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onAdjust}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            Adjust Details
          </button>
          <button
            onClick={onProceedSeatOnly}
            className="flex-1 py-2.5 rounded-xl bg-[#c93400] text-[#ffffff] text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
          >
            Proceed Seat Only
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warning24Hour;
