import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import GoogleCalender from '../components/layout/GoogleCalender.jsx'
import { 
  confirmReservation, 
  removeReservation 
} from '../components/data-storage/form-data.js'

const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [booking, setBooking] = useState(() => {
    return (
      location.state?.booking ||
      location.state?.bookingDetails ||
      JSON.parse(sessionStorage.getItem('pendingReservation') || 'null')
    )
  })

  const HOLD_DURATION_MS = 15 * 60 * 1000

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedExpiry = sessionStorage.getItem('pendingHoldExpiry')
    if (savedExpiry) {
      const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000)
      return remaining > 0 ? remaining : 0
    }
    
    const newExpiry = Date.now() + HOLD_DURATION_MS
    sessionStorage.setItem('pendingHoldExpiry', newExpiry.toString())
    return 900
  })

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [showResendToast, setShowResendToast] = useState(false)
  
  const isVerifiedRef = useRef(false)
  const bookingRef = useRef(booking)

  useEffect(() => {
    isVerifiedRef.current = isVerified
    bookingRef.current = booking
  }, [isVerified, booking])

  useEffect(() => {
    if (booking && !isVerified) {
      sessionStorage.setItem('pendingReservation', JSON.stringify(booking))
    }
  }, [booking, isVerified])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isVerifiedRef.current && bookingRef.current?.id) {
        removeReservation(bookingRef.current.id)
        sessionStorage.removeItem('pendingReservation')
        sessionStorage.removeItem('pendingHoldExpiry')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    if (isVerified || timeLeft <= 0) {
      if (timeLeft <= 0 && bookingRef.current?.id) {
        removeReservation(bookingRef.current.id)
        sessionStorage.removeItem('pendingReservation')
        sessionStorage.removeItem('pendingHoldExpiry')
      }
      return
    }

    const timer = setInterval(() => {
      const expiry = sessionStorage.getItem('pendingHoldExpiry')
      if (expiry) {
        const remaining = Math.floor((parseInt(expiry, 10) - Date.now()) / 1000)
        
        if (remaining <= 0) {
          clearInterval(timer)
          setTimeLeft(0)
          if (bookingRef.current?.id) {
            removeReservation(bookingRef.current.id)
          }
          sessionStorage.removeItem('pendingReservation')
          sessionStorage.removeItem('pendingHoldExpiry')
          setError('Hold timer expired. Your pending table reservation has been canceled.')
        } else {
          setTimeLeft(remaining)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isVerified])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (e, index) => {
    const value = e.target.value
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && e.target.nextElementSibling) {
      e.target.nextElementSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        e.target.previousElementSibling?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const enteredCode = otp.join('')

    if (timeLeft <= 0) {
      setError('Your 15-minute hold timer has expired. Please start a new reservation.')
      return
    }

    if (enteredCode.length === 6) {
      const confirmedData = confirmReservation(booking)
      if (confirmedData) {
        setBooking(confirmedData)
      } else {
        setBooking(prev => ({ ...prev, bookingStatus: 'Confirmed' }))
      }
      sessionStorage.removeItem('pendingReservation')
      sessionStorage.removeItem('pendingHoldExpiry')
      setIsVerified(true)
      setError('')
    } else {
      setError('Invalid verification code. Please check your email and try again.')
    }
  }

  const handleCancelHold = () => {
    if (booking?.id) {
      removeReservation(booking.id)
    }
    sessionStorage.removeItem('pendingReservation')
    sessionStorage.removeItem('pendingHoldExpiry')
    navigate('/location-date-time')
  }

  const handleResendOtp = () => {
    if (timeLeft <= 0) return
    setOtp(['', '', '', '', '', ''])
    setError('')
    setShowResendToast(true)
    setTimeout(() => setShowResendToast(false), 4000)
  }

  if (!booking) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-white px-4">
        <p className="text-gray-300 text-center">No active booking found or your hold session expired.</p>
        <button 
          onClick={() => navigate('/location-date-time')} 
          className="mt-4 px-6 py-2.5 bg-[#c93400] text-white rounded-full font-bold hover:bg-white hover:text-[#c93400] transition-colors text-sm"
        >
          Start New Booking
        </button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 text-white animate-fade-in relative">
      
      {showResendToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 text-xs font-semibold animate-bounce">
          ✉️ A new verification code has been sent to {booking?.email}
        </div>
      )}

      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-center">
        
        {!isVerified ? (
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c93400] bg-[#c93400]/10 px-3 py-1 rounded-full border border-[#c93400]/30">
              Step 3: Email Verification
            </span>

            <h1 className="text-3xl font-bold">Verify Your Reservation</h1>
            <p className="text-sm text-gray-300">
              We sent a verification code to <span className="text-white font-semibold">{booking.email}</span>.
            </p>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl max-w-sm mx-auto">
              <p className="text-xs text-amber-300 font-medium">Table Hold Time Remaining</p>
              <div className="text-3xl font-mono font-bold text-amber-400 mt-1">
                {formatTimer(timeLeft)}
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    disabled={timeLeft <= 0}
                    value={data}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-10 h-12 md:w-12 md:h-14 bg-black/60 border border-white/20 rounded-xl text-center text-xl font-bold text-white focus:border-[#c93400] focus:outline-none transition-colors disabled:opacity-50"
                  />
                ))}
              </div>

              {timeLeft > 0 ? (
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#c93400] text-white text-base font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all"
                  >
                    Confirm & Finalize Reservation
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelHold}
                    className="w-full py-2.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Cancel Reservation Hold
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelHold}
                  className="w-full py-3.5 rounded-full bg-rose-600 text-white text-base font-bold shadow-lg hover:bg-white hover:text-rose-600 transition-all"
                >
                  Hold Expired — Start Again
                </button>
              )}
            </form>

            {timeLeft > 0 && (
              <p className="text-xs text-gray-400">
                Didn't receive the code?{' '}
                <button 
                  onClick={handleResendOtp} 
                  className="text-[#c93400] underline font-semibold hover:text-white"
                >
                  Resend OTP
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="text-5xl">🎉</div>
            <h1 className="text-3xl font-bold text-emerald-400">Reservation Completed!</h1>
            <p className="text-sm text-gray-300">
              Your table is officially locked in for <strong className="text-white">{booking.fullName || booking.name}</strong>.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs md:text-sm space-y-2">
              <p><strong className="text-gray-400">Location:</strong> {booking.locationName || booking.location}</p>
              <p><strong className="text-gray-400">Date & Time:</strong> {booking.date} at {booking.timeLabel || booking.time}</p>
              <p><strong className="text-gray-400">Guests:</strong> {booking.guests} Guests</p>
              {booking.specialItems?.length > 0 && (
                <p><strong className="text-amber-400">Special Dishes:</strong> {booking.specialItems.map(i => i.title).join(', ')}</p>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-4 px-8 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <NextPageButton to="/my-reservation" name="Reservations" />
      </div>
    </div>
  )
}

export default EmailVerificationPage