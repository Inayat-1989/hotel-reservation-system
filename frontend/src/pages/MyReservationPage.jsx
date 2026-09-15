import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { locationList } from '../assets/constant-data/location-date-time.js'
import { formList, removeReservation } from '../components/data-storage/form-data.js'

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([...formList])
  const [activeTab, setActiveTab] = useState('upcoming')

  // Modals state
  const [cancelModalId, setCancelModalId] = useState(null)
  const [editingReservation, setEditingReservation] = useState(null)
  const [editError, setEditError] = useState('')

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes()

  // Calculate minimum date for Special Menu (+24 hours/Tomorrow)
  const tomorrowStr = useMemo(() => {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [now])

  const getLocationName = (id) => {
    const loc = locationList.find((l) => l.id === id || l.name === id)
    return loc ? loc.name : id
  }

  const getLocationDetails = (locId) => {
    return locationList.find((l) => l.id === locId || l.name === locId) || locationList[0]
  }

  const isBookingUpcoming = (resDate, resTime) => {
    const bookingDateTime = new Date(`${resDate}T${resTime || '00:00'}`)
    return bookingDateTime >= now
  }

  const { upcomingList, pastList } = useMemo(() => {
    const upcoming = []
    const past = []

    reservations.forEach((res) => {
      if (isBookingUpcoming(res.date, res.time)) {
        upcoming.push(res)
      } else {
        past.push(res)
      }
    })

    return { upcomingList: upcoming, pastList: past }
  }, [reservations])

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList

  // Compute available time slots based on location schedule and chosen date
  const availableTimeSlots = useMemo(() => {
    if (!editingReservation) return []

    const selectedLoc = getLocationDetails(editingReservation.location)
    if (!selectedLoc || !editingReservation.date) return []

    const dateObj = new Date(`${editingReservation.date}T00:00:00`)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = selectedLoc.schedule?.find((s) => s.days.includes(dayName))

    if (!daySchedule || !daySchedule.open || !daySchedule.close) return []

    const [openH, openM] = daySchedule.open.split(':').map(Number)
    const [closeH, closeM] = daySchedule.close.split(':').map(Number)

    const startMinutes = openH * 60 + openM
    const endMinutes = closeH * 60 + closeM
    const slots = []
    const isToday = editingReservation.date === todayStr

    for (let time = startMinutes; time < endMinutes; time += 30) {
      if (isToday && time <= currentMinutesNow) continue

      const hours = Math.floor(time / 60)
      const mins = time % 60
      const valueStr = `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`

      const period = hours >= 12 ? 'PM' : 'AM'
      const hours12 = hours % 12 === 0 ? 12 : hours % 12
      const minStr = mins < 10 ? `0${mins}` : mins
      const labelStr = `${hours12}:${minStr} ${period}`

      slots.push({ value: valueStr, label: labelStr })
    }

    return slots
  }, [editingReservation, todayStr, currentMinutesNow])

  // Sync selected time when location or date changes in modal
  useEffect(() => {
    if (editingReservation && availableTimeSlots.length > 0) {
      const exists = availableTimeSlots.some((s) => s.value === editingReservation.time)
      if (!exists) {
        setEditingReservation((prev) => ({ ...prev, time: availableTimeSlots[0].value }))
      }
    }
  }, [availableTimeSlots])

  // Confirm cancel reservation
  const confirmCancelReservation = () => {
    if (cancelModalId) {
      removeReservation(cancelModalId)
      setReservations((prev) => prev.filter((res) => res.id !== cancelModalId))
      setCancelModalId(null)
    }
  }

  // Open Edit Modal with pre-populated data
  const handleOpenEdit = (res) => {
    const hasSpecial = Boolean(res.hasSpecialMenu || res.specialItems?.length || res.specialMenu)
    const minSelectableDate = hasSpecial ? tomorrowStr : todayStr
    const validDate = res.date < minSelectableDate ? minSelectableDate : res.date

    setEditingReservation({
      id: res.id,
      name: res.name || '',
      email: res.email || '',
      location: res.location || locationList[0]?.id,
      date: validDate,
      time: res.time || '',
      guests: res.guests || 1,
      specialRequests: res.specialRequests || '',
      hasSpecialMenu: hasSpecial,
      specialItems: res.specialItems || [],
      specialMenuDiscount: res.specialMenuDiscount || 0,
      totalAmount: res.totalAmount || 0,
    })
    setEditError('')
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    setEditError('')

    const selectedDateTime = new Date(`${editingReservation.date}T${editingReservation.time || '00:00'}`)
    const hoursDifference = (selectedDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (selectedDateTime < now) {
      setEditError('You cannot select a date or time in the past.')
      return
    }

    if (editingReservation.hasSpecialMenu && hoursDifference < 24) {
      setEditError('Reservations with special menus cannot be scheduled less than 24 hours in advance.')
      return
    }

    if (availableTimeSlots.length === 0) {
      setEditError('The selected location is closed on this date.')
      return
    }

    // Update internal state and storage
    setReservations((prev) =>
      prev.map((res) => (res.id === editingReservation.id ? editingReservation : res))
    )

    const targetIdx = formList.findIndex((item) => item.id === editingReservation.id)
    if (targetIdx !== -1) {
      formList[targetIdx] = { ...editingReservation }
    }

    setEditingReservation(null)
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#c93400] mb-3">
          My Reservations
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base max-w-lg mx-auto mb-8">
          Manage and view all your active dining bookings and previous visit history.
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-full flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#c93400] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({upcomingList.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-[#c93400] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past ({pastList.length})
            </button>
          </div>
        </div>

        {currentList.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center space-y-4">
            <div className="text-4xl">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-200">No {activeTab} reservations found</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming tables reserved right now."
                : 'You have no past reservation history.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/location-date-time"
                className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#c93400] text-white text-xs font-bold hover:bg-white hover:text-[#c93400] transition-colors"
              >
                Book a Table Now
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-left">
            {currentList.map((res) => {
              const isUpcoming = isBookingUpcoming(res.date, res.time)
              return (
                <div
                  key={res.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-white">
                        {getLocationName(res.location)}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isUpcoming
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        {isUpcoming ? 'Confirmed' : 'Completed'}
                      </span>
                      {res.hasSpecialMenu && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Special Menu
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-300 space-y-1">
                      <p>👤 <strong className="text-white">{res.name || 'Guest'}</strong> ({res.email || 'N/A'})</p>
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <span>📅 <strong className="text-white">{res.date}</strong></span>
                        <span>⏰ <strong className="text-white">{res.time}</strong></span>
                        <span>👥 <strong className="text-white">{res.guests} Guests</strong></span>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <p className="text-xs text-gray-400 italic bg-black/30 p-2 rounded-lg border border-white/5">
                        "{res.specialRequests}"
                      </p>
                    )}
                  </div>

                  {isUpcoming && (
                    <div className="w-full md:w-auto flex md:flex-col justify-end gap-2 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                      <button
                        onClick={() => handleOpenEdit(res)}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        Change Details
                      </button>
                      <button
                        onClick={() => setCancelModalId(res.id)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-8">
        <NextPageButton to="/menu" name="Back to Menu" />
      </div>

      {/* Cancel Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6 animate-scale-up">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-xl font-bold text-white">Cancel Reservation?</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-5 py-2.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelReservation}
                className="px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl text-left space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-[#c93400]">Modify Reservation</h3>
              <button
                onClick={() => setEditingReservation(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl">
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingReservation.name}
                  onChange={(e) =>
                    setEditingReservation({ ...editingReservation, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingReservation.email}
                  onChange={(e) =>
                    setEditingReservation({ ...editingReservation, email: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Location</label>
                <select
                  value={editingReservation.location}
                  onChange={(e) =>
                    setEditingReservation({ ...editingReservation, location: e.target.value })
                  }
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                >
                  {locationList.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    min={editingReservation.hasSpecialMenu ? tomorrowStr : todayStr}
                    value={editingReservation.date}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, date: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                  />
                  {editingReservation.hasSpecialMenu && (
                    <span className="text-[10px] text-amber-400 mt-1 block">
                      Special menu requires 24h advance notice (today disabled).
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Time Slot</label>
                  <select
                    value={editingReservation.time}
                    onChange={(e) =>
                      setEditingReservation({ ...editingReservation, time: e.target.value })
                    }
                    disabled={availableTimeSlots.length === 0}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                  >
                    {availableTimeSlots.length === 0 ? (
                      <option value="">Closed on selected date</option>
                    ) : (
                      availableTimeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold font-sans">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={editingReservation.guests}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      guests: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Special Requests</label>
                <textarea
                  rows="2"
                  value={editingReservation.specialRequests}
                  onChange={(e) =>
                    setEditingReservation({
                      ...editingReservation,
                      specialRequests: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c93400]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#c93400] text-white font-bold hover:bg-red-700 transition-all shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyReservationsPage