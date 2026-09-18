import { Link, useLocation, useNavigate } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import ReservationCard from '../components/common/myReservationComponents/ReservationCard.jsx'
import CancelReservation from '../components/common/myReservationComponents/CancelReservation.jsx'
import { useReservationManager } from '../assets/hooks/useReservationManager.js'
import HeroHeading from '../components/common/HeroHeading.jsx'
import { formList } from '../components/data-storage/form-data.js'

const MyReservationsPage = () => {
  const navigate = useNavigate()
  const {
    activeTab,
    setActiveTab,
    cancelModalId,
    setCancelModalId,
    upcomingList,
    pastList,
    currentList,
    confirmCancelReservation,
  } = useReservationManager()

  const location = useLocation();

  const handleOpenEdit = (reservation) => {
    sessionStorage.setItem('pendingReservationDraft', JSON.stringify(reservation))

    console.log("In Reservation After the email : ", formList, "\nEdit Reservation: ", reservation, "\nBookingDetails: ", location.state)
    navigate('/location-date-time', {
      state: {
        id: reservation.id,
        editReservation: reservation,
        bookingDetails: reservation,
      },
    })
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading
          heading="My Reservations"
          paragraph="Manage and view all your active dining bookings and previous visit history."
        />

        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-full flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#c93400] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({upcomingList.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-[#c93400] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past ({pastList.length})
            </button>
          </div>
        </div>

        {currentList.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center space-y-4">
            <div className="text-4xl">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-200">
              No {activeTab} reservations found
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              {activeTab === 'upcoming'
                ? "You don't have any active table bookings right now."
                : 'You have no past reservation history.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/location-date-time"
                className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#c93400] text-white text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
              >
                Book a Table Now
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-left">
            {currentList.map((res) => (
              <ReservationCard
                key={res.id}
                reservation={res}
                onEdit={handleOpenEdit}
                onCancel={(id) => setCancelModalId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <NextPageButton to="/menu" name="Back to Menu" />

      <CancelReservation
        isOpen={Boolean(cancelModalId)}
        onClose={() => setCancelModalId(null)}
        onConfirm={confirmCancelReservation}
      />
    </div>
  )
}

export default MyReservationsPage