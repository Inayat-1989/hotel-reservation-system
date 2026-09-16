import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { 
  locationList, 
  getAvailableSeats 
} from '../assets/constant-data/location-date-time.js'
import { formList, updateReservation, addPendingReservation } from '../components/data-storage/form-data.js'
import HeroHeading from '../components/common/HeroHeading.jsx'
import LocationDateTimeSelect from '../components/common/locationDateTimePageComponents/LocationDateTimeSelect.jsx'
import GuestDateTimeSelect from '../components/common/locationDateTimePageComponents/GuestDateTimeSelect.jsx'
import IsCalenderOpen from '../components/common/locationDateTimePageComponents/IsCalenderOpen.jsx'

const LocationDateTimePage = ({ reservationId }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const existingReservation = useMemo(() => {
    if (location.state?.editReservation) {
      return location.state.editReservation
    }
    if (reservationId) {
      return formList.find(item => item.id === reservationId) || null
    }
    return null
  }, [location.state, reservationId])

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const currentMinutesNow = useMemo(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }, [])

  const [selectedLocationId, setSelectedLocationId] = useState(
    existingReservation?.locationId || existingReservation?.location || locationList[0]?.id || ''
  )
  const [selectedDate, setSelectedDate] = useState(
    existingReservation?.date || todayStr
  )
  const [selectedTime, setSelectedTime] = useState(
    existingReservation?.timeValue || existingReservation?.timeSlot || existingReservation?.time || ''
  )
  const [partySize, setPartySize] = useState(
    Number(existingReservation?.partySize || existingReservation?.guests || 2)
  )

  const [showClosedModal, setShowClosedModal] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const activeLocation = useMemo(() => {
    return locationList.find(loc => loc.id === selectedLocationId) || locationList[0]
  }, [selectedLocationId])

  const getLocationStatus = (locationObj, targetDateStr) => {
    const [year, month, day] = targetDateStr.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = locationObj.schedule.find(s => s.days.includes(dayName))

    if (!daySchedule || !daySchedule.open || !daySchedule.close) {
      return { status: 'Closed', isOpen: false }
    }

    if (targetDateStr === todayStr) {
      const [openH, openM] = daySchedule.open.split(':').map(Number)
      const [closeH, closeM] = daySchedule.close.split(':').map(Number)
      const startMinutes = openH * 60 + openM
      const endMinutes = closeH * 60 + closeM

      const isOpenRightNow = currentMinutesNow >= startMinutes && currentMinutesNow < endMinutes
      return { status: isOpenRightNow ? 'Open Now' : 'Closed', isOpen: isOpenRightNow }
    }

    return { status: 'Open', isOpen: true }
  }

  const getNextAvailableDate = (locationObj) => {
    const baseDate = new Date()
    for (let i = 1; i <= 7; i++) {
      const checkDate = new Date(baseDate)
      checkDate.setDate(baseDate.getDate() + i)
      const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' })
      const daySchedule = locationObj.schedule.find(s => s.days.includes(dayName))
      if (daySchedule && daySchedule.open && daySchedule.close) {
        return checkDate.toISOString().split('T')[0]
      }
    }
    return todayStr
  }

  const getMinDate = (locationObj) => {
    const todayStatus = getLocationStatus(locationObj, todayStr)
    return todayStatus.isOpen ? todayStr : getNextAvailableDate(locationObj)
  }

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
      const valueStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`

      const period = hours >= 12 ? 'PM' : 'AM'
      const hours12 = hours % 12 === 0 ? 12 : hours % 12
      const minStr = mins < 10 ? `0${mins}` : mins
      const displayTimeStr = `${hours12}:${minStr} ${period}`

      let seatsRemaining = getAvailableSeats(activeLocation.id, selectedDate, valueStr)

      const pendingFormSeats = formList
        .filter(b => {
          if (existingReservation && b.id === existingReservation.id) return false
          const locId = b.locationId || b.location
          const bTime = b.timeValue || b.timeSlot || b.time
          return locId === activeLocation.id && b.date === selectedDate && bTime === valueStr
        })
        .reduce((sum, b) => sum + parseInt(b.guests || b.partySize || b.seatsBooked || 1, 10), 0)

      seatsRemaining = Math.max(0, seatsRemaining - pendingFormSeats)
      const isAvailable = seatsRemaining >= partySize

      let capacityLabel = ''
      if (seatsRemaining === 0) {
        capacityLabel = ' (Fully Booked)'
      } else if (!isAvailable) {
        capacityLabel = ` (Only ${seatsRemaining} seat${seatsRemaining > 1 ? 's' : ''} left)`
      } else {
        capacityLabel = ` (${seatsRemaining} seats left)`
      }

      slots.push({
        value: valueStr,
        displayTime: displayTimeStr,
        label: `${displayTimeStr}${capacityLabel}`,
        minutes: time,
        seatsRemaining,
        isAvailable
      })
    }

    return slots
  }, [activeLocation, selectedDate, todayStr, currentMinutesNow, partySize, existingReservation])

  useEffect(() => {
    const isCurrentTimeValid = availableTimeSlots.some(s => s.value === selectedTime && s.isAvailable)
    if (!isCurrentTimeValid) {
      const validSlot = availableTimeSlots.find(s => s.isAvailable)
      setSelectedTime(validSlot ? validSlot.value : '')
    }
  }, [availableTimeSlots, selectedTime])

  const handleLocationSelect = (loc) => {
    setSelectedLocationId(loc.id)
    const locTodayStatus = getLocationStatus(loc, todayStr)
    setSelectedDate(!locTodayStatus.isOpen ? getNextAvailableDate(loc) : todayStr)
  }

  const handleSetPartySize = (e) => {
    setPartySize(parseInt(e.target.value, 10))
  }

  const handleIsCalenderOpen = (value) => {
    setIsCalendarOpen(value)
  }

  const handleSetSelectedDate = (date) => {
    setSelectedDate(date)
  }

  const handleSetSelectedTime = (e) => {
    setSelectedTime(e.target.value)
  }

  const isLessThan24HoursAway = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false
    const formattedTime = timeStr.length === 5 ? timeStr : `${timeStr.padStart(5, '0')}`
    const targetDateTime = new Date(`${dateStr}T${formattedTime}:00`)
    const now = new Date()
    const diffInMs = targetDateTime - now
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return diffInHours < 24
  }

  const handleProceed = (e) => {
    e?.preventDefault()
    const selectedSlot = availableTimeSlots.find(slot => slot.value === selectedTime)
    
    if (!selectedTime || !selectedSlot || !selectedSlot.isAvailable) {
      setShowClosedModal(true)
      return
    }

    const isUrgentBooking = isLessThan24HoursAway(selectedDate, selectedTime)

    const bookingDetails = {
      ...(existingReservation || {}),
      id: existingReservation?.id || `RES-${Date.now().toString().slice(-6)}`,
      locationId: activeLocation.id,
      locationName: activeLocation.name,
      location: activeLocation.id,
      totalSeats: activeLocation.totalSeats,
      address: activeLocation.address,
      phone: activeLocation.phone,
      date: selectedDate,
      timeValue: selectedTime,
      timeSlot: selectedTime,
      time: selectedTime,
      timeLabel: selectedSlot.displayTime,
      partySize: partySize,
      guests: partySize,
      remainingSeats: selectedSlot.seatsRemaining,
      hasSpecialMenu: isUrgentBooking ? false : (existingReservation?.hasSpecialMenu || false),
      specialItems: isUrgentBooking ? [] : (existingReservation?.specialItems || [])
    }

    if (existingReservation?.id) {
      updateReservation(existingReservation.id, bookingDetails)
    } else {
      addPendingReservation(bookingDetails)
    }

    sessionStorage.setItem('pendingReservation', JSON.stringify(bookingDetails))
    navigate('/book-table', { state: bookingDetails })
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading heading={existingReservation ? 'Edit Reservation Details' : 'Locations & Opening Hours'} paragraph={existingReservation ? 'Update your selected location, date, time slot, or guest count.' : 'Select a location and reserve your table for any available date and time slot.'} />

        <LocationDateTimeSelect selectedLocationId={selectedLocationId} locationList={locationList} handleLocationSelect={handleLocationSelect} />
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-[#c93400] mb-4"> Plan Your Visit at {activeLocation.name}</h3>
          <GuestDateTimeSelect setPartySize={handleSetPartySize} partySize={partySize} setIsCalendarOpen={handleIsCalenderOpen} selectedDate={selectedDate} selectedTime={selectedTime} availableTimeSlots={availableTimeSlots} setSelectedTime={handleSetSelectedTime} handleProceed={handleProceed} existingReservation={existingReservation}/>
        </div>
      </div>

      <div className="mt-8">
        <NextPageButton to="/menu" name="Menu" />
      </div>

      <IsCalenderOpen 
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={handleIsCalenderOpen} 
        selectedDate={selectedDate}
        setSelectedDate={handleSetSelectedDate} 
        activeLocation={activeLocation}
        getMinDate={getMinDate}
      />

      {showClosedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#171717] border border-[#c93400]/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white relative">
            <div className="w-12 h-12 bg-[#c93400]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c93400]/50">
              <span className="text-[#c93400] text-xl font-bold">!</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-white">
              Insufficient Seat Availability
            </h3>
            
            <p className="text-sm text-[#999999] mb-6 leading-relaxed">
              <span className="font-semibold text-[#c93400]">{activeLocation.name}</span> does not have enough seats available for <span className="font-semibold text-white">{partySize} {partySize === 1 ? 'guest' : 'guests'}</span> on <span className="underline decoration-[#c93400]">{selectedDate}</span> at this time slot.
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