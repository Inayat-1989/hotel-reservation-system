import HeroHeading from '../../components/ui/HeroHeading.jsx'

import MenuSearch from './MenuSearch.jsx'

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