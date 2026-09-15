const ThemeLoader = ({ message = "Preparing your dish..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative flex items-center justify-center">
        
        {/* Outer glowing pulsing aura */}
        <div className="absolute w-28 h-28 rounded-full bg-[#c93400]/20 animate-ping pointer-events-none" />

        {/* Outer spinning theme ring */}
        <div className="w-24 h-24 rounded-full border-4 border-[#c93400]/20 border-t-[#c93400] border-r-[#c93400] animate-spin" />

        {/* Center decorative food/flame icon */}
        <div className="absolute inset-0 flex items-center justify-center text-[#c93400] animate-pulse">
          <svg 
            className="w-10 h-10" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 23c-4.97 0-9-3.96-9-8.84 0-3.32 1.83-6.19 4.5-7.7.35-.2.8.06.77.47-.18 2.37.89 4.67 2.73 6.07.28.21.68.01.68-.34 0-2.8 1.48-5.36 3.73-6.8.36-.23.83.05.79.47-.29 3.01 1.05 5.92 3.4 7.6.35.25.79-.05.73-.48-.22-1.61.12-3.26.96-4.57.25-.39.81-.24.84.22.18 2.61-.43 5.25-1.8 7.37C17.07 20.88 14.65 23 12 23z" />
          </svg>
        </div>
      </div>

      {/* Loading Caption */}
      {message && (
        <p className="mt-6 text-white text-lg font-semibold tracking-wider animate-pulse drop-shadow-md">
          {message}
        </p>
      )}
    </div>
  )
}

export default ThemeLoader