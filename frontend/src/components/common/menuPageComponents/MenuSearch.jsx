import React from 'react'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'main', label: 'Mains' },
  { id: 'dessert', label: 'Desserts' },
]

const MenuSearch = ({
  activeCategory,
  searchQuery,
  setSearchQuery,
  setActiveCategory,
  specialsOnly,
  setSpecialsOnly,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
      <input
        type="text"
        placeholder="Search food by name..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="w-full md:w-72 bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c93400]"
      />

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            /* FIXED: Arrow function prevents infinite render loop */
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
  )
}

export default MenuSearch