import { useState, useRef } from 'react'

export const useOtpInput = ({ isExpired, onVerifySuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [showResendToast, setShowResendToast] = useState(false)
  const inputsRef = useRef([])

  const handleOtpChange = (e, index) => {
    const val = e.target.value
    if (val && !/^\d+$/.test(val)) return

    // Handle full code paste
    if (val.length > 1) {
      const pastedDigits = val.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedDigits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit
      })
      setOtp(newOtp)
      const nextIndex = Math.min(pastedDigits.length, 5)
      inputsRef.current[nextIndex]?.focus()
      return
    }

    // Handle single digit input
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputsRef.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handleResendOtp = () => {
    if (isExpired) return
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setShowResendToast(true)
    setTimeout(() => setShowResendToast(false), 4000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isExpired) {
      setOtpError('Your 15-minute hold timer has expired. Please start a new reservation.')
      return
    }

    const enteredCode = otp.join('')
    if (enteredCode.length === 6) {
      setOtpError('')
      onVerifySuccess()
    } else {
      setOtpError('Invalid verification code. Please enter all 6 digits.')
    }
  }

  return {
    otp,
    otpError,
    showResendToast,
    inputsRef,
    handleOtpChange,
    handleKeyDown,
    handleResendOtp,
    handleSubmit,
  }
}