import NextPageButton from '../components/common/NextPageButton.jsx'
import HeroHeading from '../components/common/HeroHeading.jsx'
import LocationDateTimeSelect from '../components/common/locationDateTimePageComponents/LocationDateTimeSelect.jsx'
import GuestDateTimeSelect from '../components/common/locationDateTimePageComponents/GuestDateTimeSelect.jsx'
import IsCalenderOpen from '../components/common/locationDateTimePageComponents/IsCalenderOpen.jsx'
import InsufficientSeats from '../components/common/locationDateTimePageComponents/InsufficientSeats.jsx'

import { locationList } from '../assets/constant-data/location-date-time.js'
import { useLocationDateTime } from '../assets/hooks/useLocationDateTime.js'

const LocationDateTimePage = () => {
  const {state, actions} = useLocationDateTime()

  const {
    selectedLocationId,
    isEditMode,
    selectedDate,
    selectedTime,
    guests,  
    isCalendarOpen,
    showClosedModal,
    availableSlots,
    errorMessage,
    actualSeats,
  } = state

  const {
    setLocationId,
    handleProceed,
    setSelectedDate,
    setSelectedTime,
    setGuests,
    setIsCalendarOpen,
    setShowClosedModal,
    setErrorMessage,
  } = actions

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading 
          heading={isEditMode ? 'Edit Reservation Details' : 'Locations & Opening Hours'} 
          paragraph={isEditMode ? 'Update your selected location, date, time slot, or guest count.' : 'Select a location and reserve your table for any available date and time slot.'} 
        />
        
        <LocationDateTimeSelect 
          selectedLocationId={selectedLocationId}
          locationList={locationList}
          setLocationId={setLocationId} 
          actualSeats={actualSeats}
        />
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-[#c93400] mb-4"> Plan Your Visit at {selectedLocationId}</h3>
          <GuestDateTimeSelect selectedDate={selectedDate} selectedTime={selectedTime} guests={guests} availableSlots={availableSlots} setSelectedTime={setSelectedTime} setGuests={setGuests} setIsCalendarOpen={setIsCalendarOpen} isEditMode={isEditMode} handleProceed={handleProceed} />
        </div>
      </div>

      <NextPageButton to="/menu" name="Menu" />

      <IsCalenderOpen 
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={setIsCalendarOpen} 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate} 
        selectedLocationId={selectedLocationId}
      />
      
      <InsufficientSeats
        isOpen={showClosedModal}
        onClose={() => setShowClosedModal(false)}
        locationName={selectedLocationId}
        guests={guests}
        selectedDate={selectedDate}
        onSelectNextDate={() => setSelectedDate(selectedLocationId, selectedDate)}
      />
    </div>
  )
}

export default LocationDateTimePage