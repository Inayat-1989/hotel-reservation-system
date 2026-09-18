import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import BookTablePage from './pages/BookTablePage.jsx'
import LocationDateTimePage from './pages/LocationDateTimePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import MenuPage from './pages/MenuPage.jsx'
import './App.css'
import heroBg from '../src/assets/hero-background.jpg'
import MyReservationPage from './pages/MyReservationPage.jsx'
import SpecialMenuSelectionPage from './pages/SpecialMenuSelectionPage.jsx'
import EmailVerificationPage from './pages/EmailVerificationPage.jsx'

const App = () => {
  return (
    <div data-theme='cupcake' className="min-h-screen flex flex-col justify-between min-w-screen bg-cover bg-fixed bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url(${heroBg})` }}
    >
      <Header />

      <div className="flex-1 w-full bg-black/40 flex flex-col items-center justify-center">
        <div className="text-neutral-content text-center w-full max-w-7xl mx-auto px-4 py-8 isolate">          
          <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/book-table' element={<BookTablePage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/location-date-time' element={<LocationDateTimePage />} />
              <Route path='/menu' element={<MenuPage />} />
              <Route path='/my-reservation' element={<MyReservationPage />} />
              <Route path='/special-menu-selection' element={<SpecialMenuSelectionPage />} />
              <Route path='/email-verification' element={<EmailVerificationPage />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default App
