import React, { useState } from 'react'
import MenuCard from '../components/common/MenuCard.jsx'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { menuItemsData } from '../assets/constant-data/menu-items.js'

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [specialsOnly, setSpecialsOnly] = useState(false)

  const filteredItems = menuItemsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    const matchesSpecials = !specialsOnly || item.isSpecial

    return matchesCategory && matchesSearch && matchesSpecials
  })

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-8 animate-fade-in">
      
      <div className="w-full max-w-7xl mx-auto space-y-6 mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[#c93400]">Our Menu</h1>
        <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto">
          Browse our complete selection of starters, mains, and desserts.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          
          <input
            type="text"
            placeholder="Search food by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c93400]"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'starters', label: 'Starters' },
              { id: 'main', label: 'Mains' },
              { id: 'dessert', label: 'Desserts' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#c93400] text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <input
              type="checkbox"
              checked={specialsOnly}
              onChange={(e) => setSpecialsOnly(e.target.checked)}
              className="accent-[#c93400] w-4 h-4 cursor-pointer"
            />
            <span className="text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">
              ⭐ Specials Only
            </span>
          </label>

        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto py-4 flex-1">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                src={item.src}
                title={item.title}
                description={item.description}
                price={item.price}
                isSpecial={item.isSpecial}
                isAvailable={item.isAvailable}
                isSelectable={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">No menu items found.</p>
        )}
      </div>

      <div className="mt-8">
        <NextPageButton to="/location-date-time" name="Book a Table" />
      </div>
    </div>
  )
}

export default MenuPage