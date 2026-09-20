import { useState } from 'react'

const MenuCard = ({ 
  id,
  src, 
  title = "Card Title", 
  description = "A card component has a figure, a body part, and inside body there are title and actions parts",
  price,
  isSpecial = false,
  isAvailable = true,
  isSelected = false,
  onSelect,
  isSelectable = false,
  disabledMessage = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    if (isSelectable && isAvailable && !disabledMessage && onSelect) {
      onSelect(id)
    }
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`card w-full min-w-0 shadow-md border transition-all duration-300 overflow-hidden flex flex-col justify-between relative ${
          isSelectable && isAvailable && !disabledMessage ? 'cursor-pointer' : ''
        } ${
          isSelected 
            ? 'bg-amber-500/10 border-[#c93400] ring-2 ring-[#c93400] shadow-xl scale-[1.01]' 
            : 'bg-white border-[#c93400]/20 hover:shadow-xl hover:border-[#c93400]'
        } ${(!isAvailable || disabledMessage) ? 'opacity-60' : ''}`}
      >
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center pointer-events-none">
          {isSpecial && (
            <span className="bg-[#c93400] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Special
            </span>
          )}
          {isSelected && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md ml-auto">
              ✓ Selected
            </span>
          )}
        </div>

        <figure 
          className="px-6 pt-6 w-full shrink-0 cursor-pointer group/img"
          onClick={(e) => {
            e.stopPropagation()
            setIsModalOpen(true)
          }}
          title="Click to expand"
        >
          <div className="w-full h-48 bg-gray-50 rounded-xl p-2 flex items-center justify-center overflow-hidden relative">
            <img
              src={src}
              alt={title}
              className="w-full h-full object-contain block transition-transform duration-300 group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
              <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">
                🔍 Click to View
              </span>
            </div>
          </div>
        </figure>

        <div className="card-body items-center text-center p-6 flex-1 flex flex-col justify-between">
          <div className="w-full">
            <div className="flex justify-between items-center gap-2 mb-2">
              <h2 className="card-title text-[#c93400] text-xl font-bold line-clamp-1">{title}</h2>
              {price && <span className="text-gray-900 font-extrabold text-base whitespace-nowrap">{price}</span>}
            </div>
            <p className="text-gray-700 text-sm line-clamp-3 text-left">{description}</p>
          </div>

          {disabledMessage ? (
            <p className="text-xs text-amber-600 font-medium mt-3 bg-amber-50 p-2 rounded-lg w-full text-center">
              {disabledMessage}
            </p>
          ) : !isAvailable ? (
            <p className="text-xs text-rose-500 font-bold mt-3 bg-rose-50 p-2 rounded-lg w-full text-center">
              Currently Unavailable
            </p>
          ) : isSelectable ? (
            <button
              type="button"
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c93400] text-white hover:bg-black'
              }`}
            >
              {isSelected ? 'Remove Dish' : '+ Add Dish'}
            </button>
          ) : null}
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#c93400] text-white font-bold hover:bg-red-700 transition-colors shadow-md"
              aria-label="Close full view"
            >
              ✕
            </button>

            <img 
              src={src} 
              alt={title} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            <h3 className="text-[#c93400] text-xl font-bold mt-3 text-center">{title}</h3>
          </div>
        </div>
      )}
    </>
  )
}

export default MenuCard