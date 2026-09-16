import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { locationList } from '../constant-data/location-date-time.js'
import { formList, updateReservation, addPendingReservation } from '../../components/data-storage/form-data.js'
import {
  getTodayStr,
  getCurrentMinutes,
  getLocationStatus,
  getNextAvailableDate,
  calculateAvailableTimeSlots,
  isLessThan24HoursAway
} from '../utils/locationDateTimeUtils.js'

export const useLocationDateTime = (reservationId) => {
  const navigate = useNavigate()
  const location = useLocation()

  const existingReservation = useMemo(() => {
    if (location.state?.editReservation) return location.state.editReservation
    if (reservationId) return formList.find(item => item.id === reservationId) || null
    return null
  }, [location.state, reservationId])

  const todayStr = useMemo(() => getTodayStr(), [])
  const currentMinutesNow = useMemo(() => getCurrentMinutes(), [])

  const [selectedLocationId, setSelectedLocationId] = useState(
    existingReservation?.locationId || existingReservation?.location || locationList[0]?.id || ''
  )
  const [selectedDate, setSelectedDate] = useState(existingReservation?.date || todayStr)
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

  const availableTimeSlots = useMemo(() => {
    return calculateAvailableTimeSlots({
      activeLocation,
      selectedDate,
      todayStr,
      currentMinutesNow,
      partySize,
      existingReservation
    })
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
    setSelectedDate(!locTodayStatus.isOpen ? getNextAvailableDate(loc, todayStr) : todayStr)
  }

  const handleProceed = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const selectedSlot = availableTimeSlots.find(slot => slot.value === selectedTime)
    
    if (!selectedTime || !selectedSlot?.isAvailable) {
      setShowClosedModal(true)
      return
    }

    const isUrgentBooking = isLessThan24HoursAway(selectedDate, selectedTime)
    const targetId = existingReservation?.id

    const bookingDetails = {
      ...(existingReservation || {}),
      id: targetId || `RES-${Date.now().toString().slice(-6)}`,
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
      partySize,
      guests: partySize,
      remainingSeats: selectedSlot.seatsRemaining,
      hasSpecialMenu: isUrgentBooking ? false : (existingReservation?.hasSpecialMenu || false),
      specialItems: isUrgentBooking ? [] : (existingReservation?.specialItems || [])
    }

    const alreadyExists = formList.some(item => item.id === targetId)

    if (targetId && alreadyExists) {
      updateReservation(targetId, bookingDetails)
    } else {
      addPendingReservation(bookingDetails)
    }

    sessionStorage.setItem('pendingReservation', JSON.stringify(bookingDetails))
    navigate('/book-table', { state: bookingDetails })
  }

  return {
    state: {
      selectedLocationId,
      selectedDate,
      selectedTime,
      partySize,
      showClosedModal,
      isCalendarOpen,
      activeLocation,
      availableTimeSlots,
      existingReservation
    },
    actions: {
      setSelectedDate,
      setSelectedTime: (e) => setSelectedTime(e.target.value),
      setPartySize: (e) => setPartySize(parseInt(e.target.value, 10)),
      setShowClosedModal,
      setIsCalendarOpen,
      handleLocationSelect,
      handleProceed
    }
  }
}