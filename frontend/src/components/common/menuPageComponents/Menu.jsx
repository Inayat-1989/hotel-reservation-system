import React from 'react'
import MenuCard from '../MenuCard'

const Menu = ({filteredItems}) => {
  return (
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
          <p className="text-center text-white-400 py-12">No menu items found.</p>
        )}
    </div>
  )
}

export default Menu