import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { locationList } from '../constant-data/location-date-time.js'
import { addPendingReservation } from '../../components/data-storage/form-data.js'
import { validateContactDetails } from '../utils/validationUtils.js'
import {
  check24HourGap,
  getAvailableSeatsForSlot,
  checkForDuplicateBooking
} from '../utils/reservationUtils.js'

export const useBookTable = () => {
  const navigate = useNavigate()
  const locationState = useLocation().state || {}
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const selectedLocationObj = useMemo(() => {
    return (
      locationList.find(
        (loc) => loc.id === (locationState.locationId || locationState.location)
      ) || locationList[0]
    )
  }, [locationState.locationId, locationState.location])

  const [formData, setFormData] = useState({
    location: selectedLocationObj.id,
    locationName: selectedLocationObj.name || locationState.locationName || 'Downtown',
    date: locationState.date || today,
    time: locationState.timeValue || locationState.time || '18:00',
    timeLabel: locationState.timeLabel || locationState.time || '6:00 PM',
    guests: String(locationState.guests || '2'),
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  useEffect(() => {
    if (locationState.locationId || locationState.location) {
      setFormData((prev) => ({
        ...prev,
        location: selectedLocationObj.id,
        locationName: selectedLocationObj.name || locationState.locationName || 'Downtown',
        date: locationState.date || today,
        time: locationState.timeValue || locationState.time || '18:00',
        timeLabel: locationState.timeLabel || locationState.time || '6:00 PM',
        guests: String(locationState.guests || '2')
      }))
    }
  }, [locationState, selectedLocationObj, today])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleConfirmWithoutSpecials = () => {
    const currentGuests = parseInt(formData.guests, 10)
    const availableSeats = getAvailableSeatsForSlot(
      formData.location,
      formData.date,
      formData.time,
      selectedLocationObj.totalSeats
    )

    const finalBookingData = {
      ...formData,
      id: Date.now().toString(),
      specialItems: [],
      specialMenuDiscount: 0,
      totalAmount: 0,
      availableSeatsRemaining: Math.max(0, availableSeats - currentGuests),
      bookingStatus: 'Pending'
    }

    addPendingReservation(finalBookingData)
    sessionStorage.setItem('pendingReservation', JSON.stringify(finalBookingData))

    setShowWarningModal(false)
    navigate('/email-verification', { state: { bookingDetails: finalBookingData } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationError = validateContactDetails(formData)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    const currentGuests = parseInt(formData.guests, 10)
    const availableSeats = getAvailableSeatsForSlot(
      formData.location,
      formData.date,
      formData.time,
      selectedLocationObj.totalSeats
    )

    if (currentGuests > availableSeats) {
      setErrorMessage(
        `Not enough seats available. Only ${
          availableSeats > 0 ? availableSeats : '0'
        } out of ${selectedLocationObj.totalSeats || 0} seats left for this slot.`
      )
      return
    }

    const isDuplicate = checkForDuplicateBooking(
      formData.email,
      formData.location,
      formData.date,
      formData.time
    )

    if (isDuplicate) {
      setErrorMessage('')
      setShowDuplicateModal(true)
      return
    }

    setErrorMessage('')

    if (check24HourGap(formData.date, formData.time)) {
      navigate('/special-menu-selection', {
        state: {
          bookingDetails: {
            ...formData,
            availableSeatsRemaining: availableSeats - currentGuests
          }
        }
      })
    } else {
      setShowWarningModal(true)
    }
  }

  return {
    formData,
    errorMessage,
    showWarningModal,
    showDuplicateModal,
    handleChange,
    handleSubmit,
    handleConfirmWithoutSpecials,
    setShowDuplicateModal,
    navigate
  }
}