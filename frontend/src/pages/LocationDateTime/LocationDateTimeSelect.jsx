import LocationCard from './LocationCard.jsx';

import {
  locationList,
  actualRemainingSeats,
} from '../../services/location-date-time.js';
import useLocationGuestDateTime from '../../hooks/useLocationGuestDateTime.js';

const LocationDateTimeSelect = () => {
  const {
    selectedLocationId,
    setSelectedLocationId,
    selectedDate,
    selectedTime,
  } = useLocationGuestDateTime();
  const actualSeats = actualRemainingSeats(
    selectedLocationId,
    selectedDate,
    selectedTime
  ); //We need to properly do the actual remaining seats available check
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
      {locationList.map((locationDetails) => {
        const isSelected = selectedLocationId === locationDetails.id;

        return (
          <div
            key={locationDetails.id}
            onClick={() => setSelectedLocationId(locationDetails.id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              isSelected
                ? 'bg-white/15 border-[#c93400] shadow-lg shadow-[#c93400]/20 scale-[1.02]'
                : 'bg-white/5 border-white/10 hover:border-[#c93400]/50 hover:bg-white/10'
            }`}
          >
            <LocationCard
              locationDetails={locationDetails}
              isSelected={isSelected}
              actualSeats={actualSeats}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LocationDateTimeSelect;
