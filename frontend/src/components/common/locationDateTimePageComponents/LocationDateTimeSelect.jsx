import LocationCard from './LocationCard.jsx'

const LocationDateTimeSelect = ({selectedLocationId, locationList, handleLocationSelect}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
        {locationList.map((locationDetails) => {
            const isSelected = selectedLocationId === locationDetails.id

            return (
              <div 
                key={locationDetails.id}
                onClick={() => handleLocationSelect(locationDetails)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white/15 border-[#c93400] shadow-lg shadow-[#c93400]/20 scale-[1.02]' 
                    : 'bg-white/5 border-white/10 hover:border-[#c93400]/50 hover:bg-white/10'
                }`}
              >
                <LocationCard locationDetails={locationDetails} isSelected={isSelected} />
              </div>
            )
          })}
    </div>
  )
}

export default LocationDateTimeSelect