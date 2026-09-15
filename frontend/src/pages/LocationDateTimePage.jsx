import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { locationList } from '../assets/constant-data/location-date-time.js'

// Assume existing Bookings come from API, Context, or Props
// Example structure: [{ locationId: 'loc1', date: '2026-09-16', timeValue: '18:00', seatsBooked: 4 }]
const LocationDateTimePage = ({ existingBookings = [], partySize = 2 }) => {
  const navigate = useNavigate()

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const currentMinutesNow = useMemo(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }, [])

  const [selectedLocationId, setSelectedLocationId] = useState(locationList[0]?.id || '')
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [selectedTime, setSelectedTime] = useState('')
  const [showClosedModal, setShowClosedModal] = useState(false)

  const activeLocation = useMemo(() => {
    return locationList.find(loc => loc.id === selectedLocationId) || locationList[0]
  }, [selectedLocationId])

  // Helper: Status calculation
  const getLocationStatus = (location, targetDateStr) => {
    const [year, month, day] = targetDateStr.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = location.schedule.find(s => s.days.includes(dayName))

    if (!daySchedule || !daySchedule.open || !daySchedule.close) {
      return { status: 'Closed', isOpen: false }
    }

    if (targetDateStr === todayStr) {
      const [openH, openM] = daySchedule.open.split(':').map(Number)
      const [closeH, closeM] = daySchedule.close.split(':').map(Number)
      const startMinutes = openH * 60 + openM
      const endMinutes = closeH * 60 + closeM

      const isOpenRightNow = currentMinutesNow >= startMinutes && currentMinutesNow < endMinutes
      return {
        status: isOpenRightNow ? 'Open Now' : 'Closed',
        isOpen: isOpenRightNow
      }
    }

    return { status: 'Open', isOpen: true }
  }

  const getNextAvailableDate = (location) => {
    const baseDate = new Date()
    for (let i = 1; i <= 7; i++) {
      const checkDate = new Date(baseDate)
      checkDate.setDate(baseDate.getDate() + i)
      const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' })
      const daySchedule = location.schedule.find(s => s.days.includes(dayName))
      if (daySchedule && daySchedule.open && daySchedule.close) {
        return checkDate.toISOString().split('T')[0]
      }
    }
    return todayStr
  }

  const getMinDate = (location) => {
    const todayStatus = getLocationStatus(location, todayStr)
    return todayStatus.isOpen ? todayStr : getNextAvailableDate(location)
  }

  // Calculate seat-aware available time slots
  const availableTimeSlots = useMemo(() => {
    if (!activeLocation) return []

    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })

    const daySchedule = activeLocation.schedule.find(s => s.days.includes(dayName))
    if (!daySchedule || !daySchedule.open || !daySchedule.close) return []

    const [openH, openM] = daySchedule.open.split(':').map(Number)
    const [closeH, closeM] = daySchedule.close.split(':').map(Number)

    const startMinutes = openH * 60 + openM
    const endMinutes = closeH * 60 + closeM
    const slots = []
    const isToday = selectedDate === todayStr

    for (let time = startMinutes; time < endMinutes; time += 30) {
      if (isToday && time <= currentMinutesNow) continue

      const hours = Math.floor(time / 60)
      const mins = time % 60
      const valueStr = `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`
      
      // Calculate remaining seats for this specific slot
      const totalBooked = existingBookings
        .filter(b => b.locationId === activeLocation.id && b.date === selectedDate && b.timeValue === valueStr)
        .reduce((sum, b) => sum + (b.seatsBooked || 0), 0)

      const seatsRemaining = activeLocation.totalSeats - totalBooked
      const isAvailable = seatsRemaining >= partySize

      const period = hours >= 12 ? 'PM' : 'AM'
      const hours12 = hours % 12 === 0 ? 12 : hours % 12
      const minStr = mins < 10 ? `0${mins}` : mins
      const labelStr = `${hours12}:${minStr} ${period} (${seatsRemaining > 0 ? `${seatsRemaining} seats left` : 'Full'})`

      slots.push({
        value: valueStr,
        label: labelStr,
        minutes: time,
        seatsRemaining,
        isAvailable
      })
    }

    return slots
  }, [activeLocation, selectedDate, todayStr, currentMinutesNow, existingBookings, partySize])

  // Automatically select first valid slot with available capacity
  useEffect(() => {
    const validSlot = availableTimeSlots.find(s => s.isAvailable)
    if (validSlot) {
      if (!availableTimeSlots.some(s => s.value === selectedTime && s.isAvailable)) {
        setSelectedTime(validSlot.value)
      }
    } else {
      setSelectedTime('')
    }
  }, [availableTimeSlots, selectedTime])

  const handleLocationSelect = (loc) => {
    setSelectedLocationId(loc.id)
    const locTodayStatus = getLocationStatus(loc, todayStr)
    setSelectedDate(!locTodayStatus.isOpen ? getNextAvailableDate(loc) : todayStr)
  }

  const handleProceed = (e) => {
    e?.preventDefault()
    const selectedSlot = availableTimeSlots.find(slot => slot.value === selectedTime)
    
    if (!selectedTime || !selectedSlot?.isAvailable) {
      setShowClosedModal(true)
      return
    }

    navigate('/book-table', {
      state: {
        locationId: activeLocation.id,
        locationName: activeLocation.name,
        totalSeats: activeLocation.totalSeats,
        address: activeLocation.address,
        phone: activeLocation.phone,
        date: selectedDate,
        timeValue: selectedTime,
        timeLabel: selectedSlot.label,
        remainingSeats: selectedSlot.seatsRemaining
      }
    })
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#c93400] mb-3">
          Locations & Opening Hours
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base max-w-lg mx-auto mb-8">
          Select a location and reserve your table for any available date and time slot.
        </p>

        {/* Location Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
          {locationList.map((loc) => {
            const isSelected = selectedLocationId === loc.id
            const { status, isOpen } = getLocationStatus(loc, selectedDate)

            return (
              <div 
                key={loc.id}
                onClick={() => handleLocationSelect(loc)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white/15 border-[#c93400] shadow-lg shadow-[#c93400]/20 scale-[1.02]' 
                    : 'bg-white/5 border-white/10 hover:border-[#c93400]/50 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white">{loc.name}</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors duration-300 ${
                      isOpen 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-1">{loc.address}</p>
                  <p className="text-xs text-amber-500 mb-4 font-medium">Capacity: {loc.totalSeats} seats</p>
                  
                  <div className="space-y-2 border-t border-white/10 pt-3 mb-4">
                    {loc.schedule.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{item.days.length === 1 ? item.days[0] : `${item.days.at(0)}-${item.days.at(-1)}`}</span>
                        <span className="text-white font-semibold">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-400 border-t border-white/10 pt-3 flex items-center justify-between">
                  <span>📞 {loc.phone}</span>
                  <span className={`text-[#c93400] font-bold ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                    Selected ✓
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Date and Time Selection */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-[#c93400] mb-4">
            Plan Your Visit at {activeLocation.name}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            <div className="flex flex-col text-left">
              <label className="text-xs text-gray-300 mb-1 font-medium">Select Date</label>
              <input 
                type="date" 
                min={getMinDate(activeLocation)}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400]" 
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-xs text-gray-300 mb-1 font-medium">Select Time Slot (30 min)</label>
              <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={availableTimeSlots.filter(s => s.isAvailable).length === 0}
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#c93400] disabled:opacity-50"
              >
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot) => (
                    <option 
                      key={slot.value} 
                      value={slot.value} 
                      disabled={!slot.isAvailable}
                      className="bg-neutral-900 text-white disabled:text-gray-500"
                    >
                      {slot.label}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-neutral-900 text-gray-400">
                    Closed / No slots on this date
                  </option>
                )}
              </select>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-8" onClick={handleProceed}>
        <NextPageButton name="Book a Table" />
      </div>

      {/* Styled Popup Modal */}
      {showClosedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-[#c93400]/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white relative">
            <div className="w-12 h-12 bg-[#c93400]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c93400]/50">
              <span className="text-[#c93400] text-xl font-bold">!</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-white">
              No Seats Available
            </h3>
            
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              <span className="font-semibold text-[#c93400]">{activeLocation.name}</span> does not have enough seats remaining on <span className="underline decoration-[#c93400]">{selectedDate}</span>. Please choose a different date or time slot.
            </p>

            <button
              onClick={() => {
                setShowClosedModal(false)
                setSelectedDate(getNextAvailableDate(activeLocation))
              }}
              className="w-full py-3 bg-[#c93400] hover:bg-[#a32a00] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#c93400]/30"
            >
              Select Next Available Date
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default LocationDateTimePage