import { useState, useRef } from 'react';

const HARDCODED_OTP = '123456';

export const useOtpInput = ({ timeLeft, onVerifySuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [showResendToast, setShowResendToast] = useState(false);
  const inputsRef = useRef([]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (val && !/^\d+$/.test(val)) return;

    if (val.length > 1) {
      const pastedDigits = val.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResendOtp = () => {
    if (timeLeft <= 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setShowResendToast(true);
    setTimeout(() => setShowResendToast(false), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setOtpError(
        'Your 15-minute hold timer has expired. Please start a new reservation.'
      );
      return;
    }

    const enteredCode = otp.join('');
    if (enteredCode.length !== 6) {
      setOtpError('Invalid verification code. Please enter all 6 digits.');
      return;
    }

    if (enteredCode === HARDCODED_OTP) {
      setOtpError('');
      onVerifySuccess();
    } else {
      setOtpError('Incorrect verification code. Please try again.');
    }
  };

  return {
    otp,
    otpError,
    showResendToast,
    inputsRef,
    handleOtpChange,
    handleKeyDown,
    handleResendOtp,
    handleSubmit,
  };
};
