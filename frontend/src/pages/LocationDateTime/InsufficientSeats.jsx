const InsufficientSeats = ({
  isOpen,
  onClose,
  locationName,
  guests,
  selectedDate,
  onSelectNextDate
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#171717] border border-[#c93400]/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-lg font-bold"
        >
          ✕
        </button>

        <div className="w-12 h-12 bg-[#c93400]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c93400]/50">
          <span className="text-[#c93400] text-xl font-bold">!</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">
          Insufficient Seat Availability
        </h3>
        
        <p className="text-sm text-[#999999] mb-6 leading-relaxed">
          <span className="font-semibold text-[#c93400]">{locationName}</span> does not have enough seats available for{' '}
          <span className="font-semibold text-white">
            {guests} {guests === 1 ? 'guest' : 'guests'}
          </span>{' '}
          on <span className="underline decoration-[#c93400]">{selectedDate}</span> at this time slot.
        </p>

        <button
          type="button"
          onClick={() => {
            onClose()
            onSelectNextDate()
          }}
          className="w-full py-3 bg-[#c93400] hover:bg-[#a32a00] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#c93400]/30"
        >
          Select different Location, Date or Time
        </button>
      </div>
    </div>
  )
}

export default InsufficientSeats