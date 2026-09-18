import { useState } from "react"
import { adjustTime, calculateAvailableTimeSlots, getTimeNow, getTodayStr } from "../utils/locationDateTimeUtils.js"
import { locationList } from "../constant-data/location-date-time.js"

export const useGuestDateTime = () => {
    const [selectedDate, setSelectedDate] = useState(getTodayStr())
    const [selectedTime, setSelectedTime] = useState(adjustTime(getTimeNow()))
    const [guests, setGuests] = useState(1)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [showClosedModal, setShowClosedModal] = useState(false)
    const [availableSlots, setAvailableSlots] = useState(() => 
        calculateAvailableTimeSlots(locationList[0].id, getTodayStr())
    )

    const updateSlotsForLocationAndDate = (locationId, date) => {
        const newSlots = calculateAvailableTimeSlots(locationId, date)
        setAvailableSlots(newSlots)
        
        if (newSlots && newSlots.length > 0) {
            setSelectedTime(newSlots[0].value24)
        } else {
            setSelectedTime('')
        }
        console.log(availableSlots)
    }

    const handleDateChange = (locationId, newDate) => {
        updateSlotsForLocationAndDate(locationId, newDate)
        setSelectedDate(newDate)
    }

    const handleTimeChange = (e) => setSelectedTime(e?.target ? e.target.value : e)

    const handleGuestsChange = (e) => {
        const val = e?.target ? e.target.value : e
        setGuests(Math.max(1, Number(val) || 1))
    }

    return {
        dateTimeState: { selectedDate, selectedTime, guests, isCalendarOpen, showClosedModal, availableSlots },
        dateTimeActions: { setSelectedDate: handleDateChange, setSelectedTime: handleTimeChange, setGuests: handleGuestsChange, setIsCalendarOpen, setShowClosedModal },
    }
}