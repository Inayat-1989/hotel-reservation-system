import React from 'react'
import HeroHeading from '../HeroHeading'
import MenuSearch from './MenuSearch'

const MenuHero = ({
  activeCategory,
  searchQuery,
  setSearchQuery,
  setActiveCategory,
  specialsOnly,
  setSpecialsOnly,
}) => {
  return (
    <div className="space-y-6 mb-8 text-center">
      <HeroHeading
        heading="Our Menu"
        paragraph="Browse our complete selection of starters, mains, and desserts."
      />
      <MenuSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        specialsOnly={specialsOnly}
        setSpecialsOnly={setSpecialsOnly}
      />
    </div>
  )
}

export default MenuHero