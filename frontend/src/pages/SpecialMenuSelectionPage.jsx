import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuCard from '../components/common/MenuCard.jsx'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { menuItemsData } from '../assets/constant-data/menu-items.js'
import { addPendingReservation } from '../components/data-storage/form-data.js'

const SpecialMenuSelectionPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const bookingDetails = location.state?.bookingDetails || {
    location: 'downtown',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    guests: '2',
    fullName: 'Guest',
    email: '',
    phone: '',
    specialRequests: ''
  }

  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const specialDishes = menuItemsData
    .filter((item) => item.isSpecial)
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))

  const handleToggleSelect = (id) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id))
    } else {
      setSelectedItemIds([...selectedItemIds, id])
    }
  }

  const selectedDishes = menuItemsData.filter((item) => selectedItemIds.includes(item.id))
  
  const handleConfirmAndProceed = () => {
    const finalReservation = {
      ...bookingDetails,
      specialItems: selectedDishes,
      id: Date.now().toString()
    }

    addPendingReservation(finalReservation)

    navigate('/email-verification', { state: { booking: finalReservation } })
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between px-4 py-8 animate-fade-in text-white">
      
      <div className="w-full max-w-6xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c93400] bg-[#c93400]/10 px-3 py-1 rounded-full border border-[#c93400]/30">
            Step 2: Pre-order Chef Specials
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white pt-2">
            Select Special Dishes
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto">
            Your booking is qualified for pre-ordered chef specials. Select one or multiple items to complement your table reservation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl mb-8">
          
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="Search special dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl">
              ⭐ {selectedItemIds.length} Dish(es) Selected
            </span>
          </div>

        </div>

        {specialDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {specialDishes.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                src={item.src}
                title={item.title}
                description={item.description}
                price={item.price}
                isSpecial={item.isSpecial}
                isAvailable={item.isAvailable}
                isSelectable={true}
                isSelected={selectedItemIds.includes(item.id)}
                onSelect={handleToggleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 mb-10">
            <div className="text-4xl">🍽️</div>
            <h3 className="text-lg font-bold text-white">No Special Dishes Found</h3>
            <p className="text-xs text-gray-400">
              No special items match your search. Clear your search query to view available dishes.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-full bg-[#c93400] text-white text-xs font-semibold"
            >
              Clear Search
            </button>
          </div>
        )}

\        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs text-gray-300">
            <p className="font-semibold text-white text-sm">
              Reservation: <span className="text-[#c93400]">{bookingDetails.date}</span> at <span className="text-[#c93400]">{bookingDetails.time}</span> ({bookingDetails.guests} guests)
            </p>
            <p className="text-gray-400 mt-1">
              Selected Special Items: {selectedDishes.length > 0 ? selectedDishes.map(d => d.title).join(', ') : 'None'}
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 md:flex-none px-6 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmAndProceed}
              className="flex-1 md:flex-none px-8 py-3 rounded-full bg-[#c93400] text-white text-sm font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all transform hover:scale-105"
            >
              {selectedDishes.length > 0 ? `Confirm (${selectedDishes.length}) Items & Verify` : 'Skip Specials & Verify Table'}
            </button>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <NextPageButton to="/my-reservation" name="My Reservations" />
      </div>

    </div>
  )
}

export default SpecialMenuSelectionPage