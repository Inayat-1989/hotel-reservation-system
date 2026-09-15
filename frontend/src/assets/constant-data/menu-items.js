// Import menu item images
import item1 from '../menu-item/menu-item-1.png'
import item2 from '../menu-item/menu-item-2.png'
import item3 from '../menu-item/menu-item-3.png'
import item4 from '../menu-item/menu-item-4.png'
import item5 from '../menu-item/menu-item-5.png'
import item6 from '../menu-item/menu-item-6.png'
import item7 from '../menu-item/menu-item-7.png'
import item8 from '../menu-item/menu-item-8.png'
import item9 from '../menu-item/menu-item-9.png'
import item10 from '../menu-item/menu-item-10.png'
import item11 from '../menu-item/menu-item-11.png'
import item12 from '../menu-item/menu-item-12.png'
import item13 from '../menu-item/menu-item-13.png'
import item14 from '../menu-item/menu-item-14.png'
import item15 from '../menu-item/menu-item-15.png'
import item16 from '../menu-item/menu-item-16.png'
import item17 from '../menu-item/menu-item-17.png'
import item18 from '../menu-item/menu-item-18.png'
import item19 from '../menu-item/menu-item-19.png'
import item20 from '../menu-item/menu-item-20.png'
import item21 from '../menu-item/menu-item-21.png'
import item22 from '../menu-item/menu-item-22.png'
import item23 from '../menu-item/menu-item-23.png'

export const menuItemsData = [
  // Original items
  { id: 1, category: 'starters', src: item1, title: 'Chicken Tikka', description: 'An extraordinary starter dish from India.', price: '$12.99', isSpecial: false, isAvailable: true },
  { id: 2, category: 'starters', src: item2, title: 'Chinese Roll', description: 'Chinese cuisine best starters roll.', price: '$9.50', isSpecial: false, isAvailable: true },
  { id: 3, category: 'main', src: item3, title: 'Jan-Chan Ramen', description: 'Chinese Ramen created in Japan.', price: '$16.00', isSpecial: true, isAvailable: true },
  { id: 4, category: 'starters', src: item4, title: 'Veg-Olive Salad', description: 'Fresh olives mixed with seasonal salad.', price: '$10.00', isSpecial: false, isAvailable: true },
  { id: 5, category: 'dessert', src: item5, title: 'Choco Lava', description: 'Lava mixed chocolates with molten center.', price: '$8.50', isSpecial: false, isAvailable: true },
  { id: 6, category: 'main', src: item6, title: 'Avocado Rice', description: 'Rice mixed with fresh seasoned avocados.', price: '$14.00', isSpecial: false, isAvailable: true },

  // STARTERS
  { id: 7, category: 'starters', src: item7, title: 'Truffle Fries', description: 'Crispy hand-cut fries tossed with parmesan and black truffle oil.', price: '$11.00', isSpecial: false, isAvailable: true },
  { id: 8, category: 'starters', src: item8, title: 'Garlic Butter Prawns', description: 'Sautéed jumbo prawns in garlic, butter, and white wine glaze.', price: '$15.50', isSpecial: true, isAvailable: true },
  { id: 9, category: 'starters', src: item9, title: 'Caprese Salad', description: 'Fresh heirloom tomatoes, buffalo mozzarella, and fresh basil drizzle.', price: '$12.00', isSpecial: false, isAvailable: true },
  { id: 10, category: 'starters', src: item10, title: 'Crispy Calamari', description: 'Lightly battered squid rings served with house spicy marinara.', price: '$13.50', isSpecial: false, isAvailable: true },
  { id: 11, category: 'starters', src: item11, title: 'Stuffed Mushrooms', description: 'Baked button mushrooms filled with herbs, garlic, and cream cheese.', price: '$10.50', isSpecial: false, isAvailable: false },

  // MAINS
  { id: 12, category: 'main', src: item12, title: 'Truffle Wagyu Steak', description: 'Prime aged Wagyu beef topped with black truffle butter.', price: '$45.00', isSpecial: true, isAvailable: true },
  { id: 13, category: 'main', src: item13, title: 'Lobster Thermidor', price: '$52.00', description: 'Fresh lobster baked in a rich cognac and mustard cream sauce.', isSpecial: true, isAvailable: true },
  { id: 14, category: 'main', src: item14, title: 'Grilled Atlantic Salmon', description: 'Pan-seared salmon fillet over lemon asparagus risotto.', price: '$24.00', isSpecial: false, isAvailable: true },
  { id: 15, category: 'main', src: item15, title: 'Wild Mushroom Pasta', description: 'Fettuccine with roasted forest mushrooms in light garlic cream.', price: '$18.50', isSpecial: false, isAvailable: true },
  { id: 16, category: 'main', src: item16, title: 'Chicken Parmesan', description: 'Breaded chicken breast topped with melted mozzarella and marinara.', price: '$19.00', isSpecial: false, isAvailable: true },
  { id: 17, category: 'main', src: item17, title: 'BBQ Prime Ribs', description: 'Slow-roasted pork ribs glazed with signature honey smoked BBQ sauce.', price: '$28.00', isSpecial: true, isAvailable: true },
  { id: 18, category: 'main', src: item18, title: 'Lamb Chops Supreme', description: 'Herb-crusted lamb chops served with roasted red potatoes.', price: '$34.00', isSpecial: true, isAvailable: false },

  // DESSERTS
  { id: 19, category: 'dessert', src: item19, title: 'Chef Special Caviar Tart', description: 'Sweet dessert tart shell layered with fruit caviar pearls.', price: '$16.00', isSpecial: true, isAvailable: true },
  { id: 20, category: 'dessert', src: item20, title: 'Classic Tiramisu', description: 'Traditional Italian espresso-soaked ladyfingers with mascarpone.', price: '$9.00', isSpecial: false, isAvailable: true },
  { id: 21, category: 'dessert', src: item21, title: 'New York Cheesecake', description: 'Rich creamy cheesecake topped with fresh berry compote.', price: '$9.50', isSpecial: false, isAvailable: true },
  { id: 22, category: 'dessert', src: item22, title: 'Matcha Green Tea Pudding', description: 'Silky smooth Japanese matcha pudding with sweet red bean.', price: '$8.00', isSpecial: false, isAvailable: true },
  { id: 23, category: 'dessert', src: item23, title: 'Mango Passion Creme', description: 'Chilled tropical cream layered with real mango puree.', price: '$10.00', isSpecial: true, isAvailable: true },
]