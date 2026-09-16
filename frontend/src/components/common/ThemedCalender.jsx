import React, { useState, useMemo, useEffect } from 'react'

const ThemedCalender = ({
  value,
  onChange,
  minDate,
  activeLocation,
  hasSpecialMenu = false,
  onClose
}) => {
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number)
      return new Date(y, m - 1, 1)
    }
    return new Date()
  })

  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number)
      setViewDate(new Date(y, m - 1, 1))
    }
  }, [value])

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const startDay = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(d).padStart(2, '0')
      const formattedDate = `${year}-${monthStr}-${dayStr}`

      let isDisabled = minDate ? formattedDate < minDate : false

      if (activeLocation && activeLocation.schedule && !isDisabled) {
        const [y, m, dayNum] = formattedDate.split('-').map(Number)
        const dateObj = new Date(y, m - 1, dayNum)
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
        const daySchedule = activeLocation.schedule.find(s => s.days.includes(dayName))

        if (!daySchedule || !daySchedule.open || !daySchedule.close) {
          isDisabled = true
        }
      }

      days.push({ day: d, dateStr: formattedDate, isDisabled })
    }
    return days
  }, [viewDate, minDate, activeLocation])

  return (
    <div className="w-full max-w-xs bg-[#171717] border border-white/20 rounded-3xl p-6 shadow-2xl text-white select-none relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#999999] hover:text-white text-sm w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
        >
          ✕
        </button>
      )}

      {/* Header Controls */}
      <div className={`flex justify-between items-center mb-5 ${onClose ? 'pr-6' : ''}`}>
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-white/10 rounded-lg text-xs text-[#999999] hover:text-white"
        >
          ◀
        </button>
        <span className="font-semibold text-base text-[#c93400]">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-white/10 rounded-lg text-xs text-[#999999] hover:text-white"
        >
          ▶
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#999999] font-semibold mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {calendarDays.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} />

          const isSelected = item.dateStr === value

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isDisabled}
              onClick={() => {
                onChange(item.dateStr)
                if (onClose) onClose()
              }}
              className={`h-9 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center ${
                isSelected
                  ? 'bg-[#c93400] text-white font-bold shadow-lg shadow-[#c93400]/40 scale-105'
                  : item.isDisabled
                  ? 'text-white/20 cursor-not-allowed line-through'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              {item.day}
            </button>
          )
        })}
      </div>

      {hasSpecialMenu && (
        <p className="text-[11px] text-amber-400 mt-4 text-center leading-tight">
          ⚠️ Special menu items require at least 24 hours advance notice.
        </p>
      )}
    </div>
  )
}

export default ThemedCalender