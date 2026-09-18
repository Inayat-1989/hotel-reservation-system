import React from 'react'

const CancelReservationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-xl font-bold text-white">Cancel Reservation?</h3>
        <p className="text-xs text-gray-300">
          Are you sure you want to cancel this booking? This step cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-lg"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelReservationModal