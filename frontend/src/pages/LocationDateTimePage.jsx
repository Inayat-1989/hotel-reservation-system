import NextPageButton from '../components/common/NextPageButton.jsx'
import HeroHeading from '../components/common/HeroHeading.jsx'
import LocationDateTimeSelect from '../components/common/locationDateTimePageComponents/LocationDateTimeSelect.jsx'
import GuestDateTimeSelect from '../components/common/locationDateTimePageComponents/GuestDateTimeSelect.jsx'
import IsCalenderOpen from '../components/common/locationDateTimePageComponents/IsCalenderOpen.jsx'
import InsufficientSeats from '../components/common/locationDateTimePageComponents/InsufficientSeats.jsx'

import { locationList } from '../assets/constant-data/location-date-time.js'
import { getMinDate, getNextAvailableDate } from '../assets/utils/locationDateTimeUtils.js'
import { useLocationDateTime } from '../assets/hooks/useLocationDateTime.js'

const LocationDateTimePage = ({ reservationId }) => {
  const { state, actions } = useLocationDateTime(reservationId)
  const {
    selectedLocationId,
    selectedDate,
    selectedTime,
    partySize,
    showClosedModal,
    isCalendarOpen,
    activeLocation,
    availableTimeSlots,
    existingReservation
  } = state

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading 
          heading={existingReservation ? 'Edit Reservation Details' : 'Locations & Opening Hours'} 
          paragraph={existingReservation ? 'Update your selected location, date, time slot, or guest count.' : 'Select a location and reserve your table for any available date and time slot.'} 
        />

        <LocationDateTimeSelect 
          selectedLocationId={selectedLocationId}
          locationList={locationList} 
          handleLocationSelect={actions.handleLocationSelect} 
        />
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-[#c93400] mb-4"> Plan Your Visit at {activeLocation.name}</h3>
          <GuestDateTimeSelect 
            setPartySize={actions.setPartySize} 
            partySize={partySize} 
            setIsCalendarOpen={actions.setIsCalendarOpen} 
            selectedDate={selectedDate} 
            selectedTime={selectedTime} 
            availableTimeSlots={availableTimeSlots} 
            setSelectedTime={actions.setSelectedTime} 
            handleProceed={actions.handleProceed} 
            existingReservation={existingReservation}
          />
        </div>
      </div>

      <NextPageButton to="/menu" name="Menu" />

      <IsCalenderOpen 
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={actions.setIsCalendarOpen} 
        selectedDate={selectedDate}
        setSelectedDate={actions.setSelectedDate} 
        activeLocation={activeLocation}
        getMinDate={getMinDate}
      />
      
      <InsufficientSeats
        isOpen={showClosedModal}
        onClose={() => actions.setShowClosedModal(false)}
        locationName={activeLocation.name}
        partySize={partySize}
        selectedDate={selectedDate}
        onSelectNextDate={() => actions.setSelectedDate(getNextAvailableDate(activeLocation))}
      />
    </div>
  )
}

export default LocationDateTimePage