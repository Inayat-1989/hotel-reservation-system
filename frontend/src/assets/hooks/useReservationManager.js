import { useState, useMemo } from 'react'
import { formList, removeReservation } from '../../components/data-storage/form-data.js'
import { isBookingUpcoming } from '../utils/reservationUtils.js'

export const useReservationManager = () => {
  const [reservations, setReservations] = useState([...formList])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [cancelModalId, setCancelModalId] = useState(null)

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

  const confirmCancelReservation = () => {
    if (cancelModalId) {
      removeReservation(cancelModalId)
      setReservations((prev) => prev.filter((res) => res.id !== cancelModalId))
      setCancelModalId(null)
    }
  }

  return {
    activeTab,
    setActiveTab,
    cancelModalId,
    setCancelModalId,
    upcomingList,
    pastList,
    currentList,
    confirmCancelReservation,
  }
}