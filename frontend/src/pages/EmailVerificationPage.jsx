import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NextPageButton from '../components/common/NextPageButton.jsx'
import OtpInputGroup from '../components/common/emailVerificationComponents/OtpInputGroup.jsx'
import ReservationSuccessCard from '../components/common/emailVerificationComponents/ReservationSuccessCard.jsx'
import { useReservationHold } from '../assets/hooks/useReservationHold.js'
import { useOtpInput } from '../assets/hooks/useOtpInput.js'
import { formatTimer, clearHoldSession } from '../assets/utils/timerUtils.js'
import { confirmReservation, removeReservation } from '../components/data-storage/form-data.js'

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

  const [isVerified, setIsVerified] = useState(false)
  const { timeLeft, timerError } = useReservationHold(booking, isVerified)

  const {
    otp,
    otpError,
    showResendToast,
    inputsRef,
    handleOtpChange,
    handleKeyDown,
    handleResendOtp,
    handleSubmit,
  } = useOtpInput({
    isExpired: timeLeft <= 0,
    onVerifySuccess: () => {
      const confirmedData = confirmReservation(booking)
      setBooking(confirmedData || { ...booking, bookingStatus: 'Confirmed' })
      clearHoldSession()
      setIsVerified(true)
    },
  })

  useEffect(() => {
    if (booking && !isVerified) {
      sessionStorage.setItem('pendingReservation', JSON.stringify(booking))
    }
  }, [booking, isVerified])

  const handleCancelHold = () => {
    if (booking?.id) removeReservation(booking.id)
    clearHoldSession()
    navigate('/location-date-time')
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

  const activeError = otpError || timerError

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

            {activeError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                ⚠️ {activeError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <OtpInputGroup
                otp={otp}
                disabled={timeLeft <= 0}
                inputsRef={inputsRef}
                onChange={handleOtpChange}
                onKeyDown={handleKeyDown}
              />

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
          <ReservationSuccessCard
            booking={booking}
            onHomeClick={() => navigate('/')}
          />
        )}
      </div>

      <div className="mt-8">
        <NextPageButton to="/my-reservation" name="Reservations" />
      </div>
    </div>
  )
}

export default EmailVerificationPage