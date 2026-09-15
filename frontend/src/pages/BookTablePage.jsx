import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { locationList } from '../assets/constant-data/location-date-time.js'
import { formList, addPendingReservation } from '../components/data-storage/form-data.js'

const BookTablePage = () => {
  const navigate = useNavigate()
  const locationState = useLocation().state || {}
  const today = new Date().toISOString().split('T')[0]

  const selectedLocationObj =
    locationList.find(
      (loc) => loc.id === (locationState.locationId || locationState.location)
    ) || locationList[0]

  // Form State initialized with fallbacks
  const [formData, setFormData] = useState({
    location: selectedLocationObj.id,
    locationName: selectedLocationObj.name || locationState.locationName || 'Downtown',
    date: locationState.date || today,
    time: locationState.timeValue || locationState.time || '18:00',
    timeLabel: locationState.timeLabel || locationState.time || '6:00 PM',
    guests: '2',
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  // UI States
  const [errorMessage, setErrorMessage] = useState('')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  const validateForm = () => {
    const nameTrimmed = formData.fullName.trim()
    const emailTrimmed = formData.email.trim()
    const phoneTrimmed = formData.phone.trim()

    const nameRegex = /^[A-Za-z\s]{2,50}$/
    if (!nameRegex.test(nameTrimmed)) {
      return 'Please enter a valid Full Name (letters and spaces only, at least 2 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailTrimmed)) {
      return 'Please enter a valid Email Address (e.g., name@example.com).'
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!phoneRegex.test(phoneTrimmed)) {
      return 'Please enter a valid Phone Number (7 to 15 digits, optional + prefix).'
    }

    return null
  }

  const check24HourGap = () => {
    const bookingDateTime = new Date(`${formData.date}T${formData.time}:00`)
    const now = new Date()
    const diffInHours = (bookingDateTime - now) / (1000 * 60 * 60)
    return diffInHours >= 24
  }

  const handleConfirmWithoutSpecials = () => {
    const currentGuests = parseInt(formData.guests, 10)
    const totalMaxCapacity = selectedLocationObj.totalSeats || 0
    
    const existingBookingsForSlot = formList.filter(
      (b) =>
        b.location === formData.location &&
        b.date === formData.date &&
        b.time === formData.time
    )

    const totalBookedSeats = existingBookingsForSlot.reduce(
      (sum, b) => sum + parseInt(b.guests || 0, 10),
      0
    )

    const availableSeats = totalMaxCapacity - totalBookedSeats

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

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    const currentGuests = parseInt(formData.guests, 10)
    const totalMaxCapacity = selectedLocationObj.totalSeats || 0

    const existingBookingsForSlot = formList.filter(
      (b) =>
        b.location === formData.location &&
        b.date === formData.date &&
        b.time === formData.time
    )

    const totalBookedSeats = existingBookingsForSlot.reduce(
      (sum, b) => sum + parseInt(b.guests || 0, 10),
      0
    )

    const availableSeats = totalMaxCapacity - totalBookedSeats

    if (currentGuests > availableSeats) {
      setErrorMessage(
        `Not enough seats available. Only ${
          availableSeats > 0 ? availableSeats : '0'
        } out of ${totalMaxCapacity} seats left for this slot.`
      )
      return
    }

    const pendingReservation = JSON.parse(
      sessionStorage.getItem('pendingReservation') || 'null'
    )

    const isSameUserDuplicate =
      formList.some(
        (b) =>
          b.email?.toLowerCase() === formData.email.trim().toLowerCase() &&
          b.location === formData.location &&
          b.date === formData.date &&
          b.time === formData.time
      ) ||
      (pendingReservation &&
        pendingReservation.email?.toLowerCase() === formData.email.trim().toLowerCase() &&
        pendingReservation.location === formData.location &&
        pendingReservation.date === formData.date &&
        pendingReservation.time === formData.time)

    if (isSameUserDuplicate) {
      setErrorMessage('')
      setShowDuplicateModal(true)
      return
    }

    setErrorMessage('')

    if (check24HourGap()) {
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#c93400] mb-3">
          Book a Table
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base max-w-lg mx-auto mb-8">
          Complete your contact details to reserve your dining experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-xs md:text-sm text-center font-medium animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-[#c93400] uppercase tracking-wider">
                Selected Reservation Details
              </h3>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs text-gray-400 hover:text-white underline transition-colors"
              >
                Change Date/Time
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-xs text-gray-400 font-medium">Location</span>
                <span className="text-base font-semibold text-white">
                  {formData.locationName}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Date</span>
                <span className="text-base font-semibold text-white">{formData.date}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Time Slot</span>
                <span className="text-base font-semibold text-[#c93400]">
                  {formData.timeLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col text-left max-w-xs">
              <label className="text-xs text-gray-300 mb-2 font-medium">
                Number of Guests (Max 12)
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num} className="bg-neutral-900 text-white">
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4 text-left">
              <h3 className="text-base font-semibold text-[#c93400]">Contact Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (e.g. +1234567890)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
                  />
                </div>
              </div>

              <textarea
                name="specialRequests"
                rows="2"
                placeholder="Special requests, dietary restrictions, or anniversary notes (optional)"
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Booking
            </button>
          </div>
        </form>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="text-4xl">⏰</div>
            <h3 className="text-xl font-bold text-amber-400">Special Menu Unavailable</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Special menu items require at least <strong>1 day (24 hours)</strong> advance
              notice. Because your booking date/time is within 24 hours, pre-ordering
              special dishes will not be available.
            </p>
            <p className="text-xs text-gray-400">
              Would you like to proceed with seat reservation only, or adjust your date and time?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
              >
                Adjust Date & Time
              </button>
              <button
                onClick={handleConfirmWithoutSpecials}
                className="flex-1 py-2.5 rounded-xl bg-[#c93400] text-white text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
              >
                Proceed Seat Only
              </button>
            </div>
          </div>
        </div>
      )}

      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-rose-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-xl font-bold text-rose-400">Existing Booking Found</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              You already have an active or pending reservation registered under{' '}
              <strong>{formData.email}</strong> for this location on{' '}
              <strong>{formData.date}</strong> at <strong>{formData.timeLabel}</strong>.
            </p>
            <p className="text-xs text-gray-400">
              Please select a different date or time, or check your existing reservation status.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
              >
                Close & Edit Details
              </button>
              <button
                onClick={() => navigate('/my-reservation')}
                className="flex-1 py-2.5 rounded-xl bg-[#c93400] text-white text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <NextPageButton to="/my-reservation" name="Reservations" />
      </div>
    </div>
  )
}

export default BookTablePage