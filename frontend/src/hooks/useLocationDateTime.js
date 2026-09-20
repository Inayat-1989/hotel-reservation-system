import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { locationList, actualRemainingSeats, releaseSeats, reserveSeats } from '../services/location-date-time.js'
import { addPendingReservation, findForm, updateReservation } from '../services/form-data.js'
import { useGuestDateTime } from './useGuestDateTime.js'
import { getTodayStr, isLessThan24HoursAway } from '../utils/locationDateTimeUtils.js'

export const useLocationDateTime = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isEditMode = Boolean(location.state?.targetId)
  const targetId = location.state?.targetId
  const [selectedLocationId, setSelectedLocationId] = useState(locationList[0].id)

  const { dateTimeState, dateTimeActions } = useGuestDateTime()

  const { selectedDate, selectedTime, guests, isCalendarOpen, showClosedModal, availableSlots } = dateTimeState
  const { setSelectedDate, setSelectedTime, setGuests, setIsCalendarOpen, setShowClosedModal } = dateTimeActions

  const actualSeats = actualRemainingSeats(selectedLocationId, selectedDate, selectedTime, isEditMode, targetId)

  const handleLocationSelect = (locId) => {
    setSelectedLocationId(locId)
    setSelectedDate(locId, getTodayStr())
  }

  const handleProceed = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    let message = ''

    if (!selectedTime) {
      setShowClosedModal(true)
      return
    }


    const selectedSlot = availableSlots?.find((slot) => slot.value24 === selectedTime)
    if(isEditMode) {
      const targetId = location.state.targetId
      const form = findForm(targetId)
      releaseSeats(form.locationId,form.date, form.time,form.guests)
    }
    if(!reserveSeats(selectedLocationId,selectedDate, selectedTime, guests)) {
      setShowClosedModal(true)
      return
    }
    const isUrgentBooking = isLessThan24HoursAway(selectedDate, selectedTime)

    if (isUrgentBooking) {
      message = "Less than 24 Hour Booking Special Items won't be allowed."
    }

    if (isUrgentBooking === null) {
      navigate('/menu', { state: {} })
      return
    }

    const targetId = isEditMode ? location.state.id : `RES-${Date.now().toString().slice(-6)}`

    const bookingDetails = {
      id: targetId,
      status: 'upcoming',
      locationId: selectedLocationId,
      date: selectedDate,
      time: selectedTime,
      timeLabel: selectedSlot?.display12 || selectedTime,
      guests: guests,
      hasSpecialMenu: !isUrgentBooking,
      specialItems: isUrgentBooking ? [] : (location.state?.specialItems || []),
      message: message,
    }

    if (isEditMode) {
      updateReservation(bookingDetails)
    } else {
      addPendingReservation(bookingDetails)
    }

    navigate('/book-table', { state: { targetId } })
  }

  return {
    state: {
      selectedLocationId,
      isEditMode,
      selectedDate,
      selectedTime,
      guests,  
      isCalendarOpen,
      showClosedModal,
      availableSlots,
      actualSeats,
    },
    actions: {
      setLocationId: handleLocationSelect,
      handleProceed,
      setSelectedDate,
      setSelectedTime,
      setGuests,
      setIsCalendarOpen,
      setShowClosedModal
    },
  }
}