import React from 'react'

const GoogleCalender = ({ booking, bookingData, referenceCode }) => {
  // Safe fallbacks to handle both prop structures
  const data = booking || bookingData || {}
  const refCode = referenceCode || data.id || 'N/A'

  const createGoogleCalendarLink = () => {
    const { date, time, location, locationName, guests } = data

    if (!date || !time) return '#'

    // Formats dates from YYYY-MM-DD to YYYYMMDD
    const cleanDate = date.replace(/-/g, '')
    
    // Normalizes time string (e.g., '18:00' -> '180000')
    const cleanTime = time.replace(':', '')
    const startTime = `${cleanDate}T${cleanTime}00`
    
    // Calculates end time (+2 hours)
    const [hours, minutes] = time.split(':')
    const endHour = String((parseInt(hours, 10) + 2) % 24).padStart(2, '0')
    const endTime = `${cleanDate}T${endHour}${minutes}00`

    const title = encodeURIComponent('Hotel Restaurant Table Reservation')
    const details = encodeURIComponent(
      `Reservation Ref: ${refCode}\nGuests: ${guests || 2}\nSpecial Requests: ${data.specialRequests || 'None'}`
    )
    const loc = encodeURIComponent(`Hotel Restaurant - ${locationName || location || 'Downtown'}`)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${loc}`
  }

  return (
    <div className="bg-white/5 border border-emerald-500/40 rounded-2xl p-6 md:p-8 text-center space-y-4">
      <div className="bg-black/40 border border-white/10 p-4 rounded-xl inline-block">
        <span className="text-xs text-gray-400 block uppercase tracking-wider">Reference Code</span>
        <span className="text-2xl font-mono font-bold text-[#c93400]">{refCode}</span>
      </div>

      <div>
        <a
          href={createGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white hover:text-black transition-colors"
        >
          📅 Add to Google Calendar
        </a>
      </div>
    </div>
  )
}

export default GoogleCalender