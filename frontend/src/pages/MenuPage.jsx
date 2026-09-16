import React, { useState } from 'react'
import NextPageButton from '../components/common/NextPageButton.jsx'
import { menuItemsData } from '../assets/constant-data/menu-items.js'
import MenuHero from '../components/common/menuPageComponents/MenuHero.jsx'
import Menu from '../components/common/menuPageComponents/Menu.jsx'

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

  const handleQuerySearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleActiveCategory = (category) => {
    setActiveCategory(category)
  }
  
  return (
    <>
    <MenuHero
        searchQuery={searchQuery}
        setSearchQuery={handleQuerySearch}
        setActiveCategory={handleActiveCategory}
        activeCategory={activeCategory}
        specialsOnly={specialsOnly}
        setSpecialsOnly={setSpecialsOnly}
    />
    <Menu filteredItems={filteredItems} />

    <NextPageButton to="/location-date-time" name="Book a Table" />
    </>
  )
}

export default MenuPage