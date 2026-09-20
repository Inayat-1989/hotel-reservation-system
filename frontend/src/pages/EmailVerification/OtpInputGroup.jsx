const OtpInputGroup = ({ otp, disabled, inputsRef, onChange, onKeyDown }) => {
  return (
    <div className="flex justify-center gap-2 md:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength="6"
          disabled={disabled}
          value={digit}
          onChange={(e) => onChange(e, index)}
          onKeyDown={(e) => onKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          className="w-10 h-12 md:w-12 md:h-14 bg-black/60 border border-white/20 rounded-xl text-center text-xl font-bold text-white focus:border-[#c93400] focus:outline-none transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  )
}

export default OtpInputGroup