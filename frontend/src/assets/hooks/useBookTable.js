import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { locationList } from '../constant-data/location-date-time.js'
import { formList, addPendingReservation, updateReservation } from '../../components/data-storage/form-data.js'
import { validateContactDetails } from '../utils/validationUtils.js'
import {
  check24HourGap,
  getAvailableSeatsForSlot,
  checkForDuplicateBooking
} from '../utils/reservationUtils.js'

export const useBookTable = () => {
  const navigate = useNavigate()
  const rawLocationState = useLocation().state || {}

  const [errorMessage, setErrorMessage] = useState('')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  const bookingDetails = useMemo(() => {
    if (rawLocationState.bookingDetails) {
      return rawLocationState.bookingDetails
    }
    if (rawLocationState.locationId || rawLocationState.location) {
      return rawLocationState
    }
    const savedDraft = sessionStorage.getItem('pendingReservationDraft')
    return savedDraft ? JSON.parse(savedDraft) : {}
  }, [rawLocationState])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const selectedLocationObj = useMemo(() => {
    const locId = bookingDetails.locationId || bookingDetails.location
    return locationList.find((loc) => loc.id === locId) || locationList[0]
  }, [bookingDetails.locationId, bookingDetails.location])

  const [formData, setFormData] = useState({
    id: bookingDetails.id || '',
    isEditing: Boolean(bookingDetails.isEditing || bookingDetails.id),
    location: selectedLocationObj.id,
    locationName: selectedLocationObj.name || bookingDetails.locationName || 'Downtown',
    date: bookingDetails.date || today,
    time: bookingDetails.timeValue || bookingDetails.timeSlot || bookingDetails.time || '18:00',
    timeLabel: bookingDetails.timeLabel || bookingDetails.time || '6:00 PM',
    guests: String(bookingDetails.partySize || bookingDetails.guests || '2'),
    fullName: bookingDetails.fullName || '',
    email: bookingDetails.email || '',
    phone: bookingDetails.phone || '',
    specialRequests: bookingDetails.specialRequests || ''
  })

  useEffect(() => {
    if (bookingDetails && (bookingDetails.locationId || bookingDetails.location || bookingDetails.date)) {
      setFormData((prev) => ({
        ...prev,
        id: bookingDetails.id || prev.id,
        isEditing: Boolean(bookingDetails.isEditing || bookingDetails.id || prev.isEditing),
        location: selectedLocationObj.id,
        locationName: selectedLocationObj.name || bookingDetails.locationName || 'Downtown',
        date: bookingDetails.date || today,
        time: bookingDetails.timeValue || bookingDetails.timeSlot || bookingDetails.time || '18:00',
        timeLabel: bookingDetails.timeLabel || bookingDetails.time || '6:00 PM',
        guests: String(bookingDetails.partySize || bookingDetails.guests || '2'),
        fullName: bookingDetails.fullName || prev.fullName,
        email: bookingDetails.email || prev.email,
        phone: bookingDetails.phone || prev.phone,
        specialRequests: bookingDetails.specialRequests || prev.specialRequests
      }))
    }
  }, [bookingDetails, selectedLocationObj, today])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const saveOrUpdateReservation = (data) => {
    const exists = formList.some((item) => item.id === data.id)
    if (exists) {
      updateReservation(data)
    } else {
      addPendingReservation(data)
    }
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
      id: formData.id || Date.now().toString(),
      specialItems: bookingDetails.specialItems || [],
      specialMenuDiscount: bookingDetails.specialMenuDiscount || 0,
      totalAmount: bookingDetails.totalAmount || 0,
      availableSeatsRemaining: Math.max(0, availableSeats - currentGuests),
      bookingStatus: 'Confirmed'
    }

    saveOrUpdateReservation(finalBookingData)
    sessionStorage.setItem('pendingReservation', JSON.stringify(finalBookingData))

    console.log("before email verification and right after final booking Form List:", formList)
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

    // Skip duplicate check if editing existing record
    const isDuplicate = !formData.isEditing && checkForDuplicateBooking(
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

    const updatedBooking = {
      ...formData,
      id: formData.id || Date.now().toString(),
      availableSeatsRemaining: availableSeats - currentGuests
    }

    saveOrUpdateReservation(updatedBooking)

    if (check24HourGap(formData.date, formData.time)) {
      navigate('/special-menu-selection', {
        state: { bookingDetails: updatedBooking }
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