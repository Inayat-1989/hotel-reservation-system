import { useState, useEffect, useRef } from 'react'
import { removeReservation } from '../../components/data-storage/form-data.js'
import { getRemainingHoldSeconds, clearHoldSession } from '../utils/timerUtils.js'

export const useReservationHold = (booking, isVerified) => {
  const [timeLeft, setTimeLeft] = useState(getRemainingHoldSeconds)
  const [timerError, setTimerError] = useState('')

  const isVerifiedRef = useRef(isVerified)
  const bookingRef = useRef(booking)

  useEffect(() => {
    isVerifiedRef.current = isVerified
    bookingRef.current = booking
  }, [isVerified, booking])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isVerifiedRef.current && bookingRef.current?.id && !bookingRef.current?.isEditing) {
        removeReservation(bookingRef.current.id)
        clearHoldSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    if (isVerified) return

    const timer = setInterval(() => {
      const expiry = sessionStorage.getItem('pendingHoldExpiry')
      if (expiry) {
        const remaining = Math.floor((parseInt(expiry, 10) - Date.now()) / 1000)

        if (remaining <= 0) {
          clearInterval(timer)
          setTimeLeft(0)
          
          if (bookingRef.current?.id && !bookingRef.current?.isEditing) {
            removeReservation(bookingRef.current.id)
          }

          clearHoldSession()
          setTimerError('Hold timer expired. Your pending table reservation change was canceled.')
        } else {
          setTimeLeft(remaining)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isVerified])

  return { timeLeft, timerError, setTimerError }
}