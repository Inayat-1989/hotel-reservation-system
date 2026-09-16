import HeroHeading from '../components/common/HeroHeading.jsx'
import NextPageButton from '../components/common/NextPageButton.jsx'
import SelectedLocationDetail from '../components/common/bookTableComponents/SelectedLocationDetail.jsx'
import ContactForm from '../components/common/bookTableComponents/ContactForm.jsx'
import Warning24Hour from '../components/common/bookTableComponents/Warning24Hour.jsx'
import DuplicateBooking from '../components/common/bookTableComponents/DuplicateBooking.jsx'
import { useBookTable } from '../assets/hooks/useBookTable.js'

const BookTablePage = () => {
  const {
    formData,
    errorMessage,
    showWarningModal,
    showDuplicateModal,
    handleChange,
    handleSubmit,
    handleConfirmWithoutSpecials,
    setShowDuplicateModal,
    navigate
  } = useBookTable()

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading
          heading="Book a Table"
          paragraph="Complete your contact details to reserve your dining experience."
        />

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-xs md:text-sm text-center font-medium animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          <SelectedLocationDetail
            formData={formData}
            onChangeDetails={() => navigate(-1)}
          />

          <ContactForm formData={formData} onChange={handleChange} />

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Booking
            </button>
          </div>
        </form>
      </div>

      {showWarningModal && (
        <Warning24Hour
          onAdjust={() => navigate(-1)}
          onProceedSeatOnly={handleConfirmWithoutSpecials}
        />
      )}

      {showDuplicateModal && (
        <DuplicateBooking
          email={formData.email}
          date={formData.date}
          timeLabel={formData.timeLabel}
          onClose={() => setShowDuplicateModal(false)}
          onViewBookings={() => navigate('/my-reservation')}
        />
      )}

      <NextPageButton to="/my-reservation" name="Reservations" />
    </div>
  )
}

export default BookTablePage