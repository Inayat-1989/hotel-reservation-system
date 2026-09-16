const LocationCard = ({locationDetails, isSelected}) => {
  return (
<>
    <div>
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">{locationDetails.name}</h2>
        </div>
        <p className="text-xs text-[#999999] mb-1">{locationDetails.address}</p>
        <p className="text-xs text-[#f59e0b] mb-4 font-medium">Capacity: {locationDetails.totalSeats} seats</p>
    </div>
    <div className="space-y-2 border-t border-white/10 pt-3 mb-4">
        {locationDetails.schedule.map((item, index) => (
        <div key={index} className="flex justify-between text-xs">
        <span>{item.days.length === 1 ? item.days[0] : `${item.days.at(0)}-${item.days.at(-1)}`}</span>
        <span className="text-white font-semibold">{item.label}</span>
        </div>
        ))}
    </div>
    <div className="text-xs text-[#999999] border-t border-white/10 pt-3 flex items-center justify-between">
        <span>📞 {locationDetails.phone}</span>
        <span className={`text-[#c93400] font-bold ${isSelected ? 'opacity-100' : 'opacity-0'}`}>Selected ✓</span>
    </div>
</>
  )
}

export default LocationCard