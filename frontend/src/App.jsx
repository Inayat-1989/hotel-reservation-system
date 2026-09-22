import { Route, Routes } from 'react-router-dom';

import ContextLayout from './components/layout/ContextLayout.jsx';

import './App.css';

import heroBg from '../src/assets/images/hero-background.jpg';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

import HomePage from './pages/Home/HomePage.jsx';
import MenuPage from './pages/Menu/MenuPage.jsx';
import LocationDateTimePage from './pages/LocationDateTime/LocationDateTimePage.jsx';
import BookTablePage from './pages/BookTable/BookTablePage.jsx';
import SpecialMenuSelectionPage from './pages/SpecialMenuSelection/SpecialMenuSelectionPage.jsx';
import EmailVerificationPage from './pages/EmailVerification/EmailVerificationPage.jsx';
import MyReservationPage from './pages/MyReservation/MyReservationPage.jsx';
import ContactPage from './pages/Contact/ContactPage.jsx';

const App = () => {
  return (
    <div
      data-theme="cupcake"
      className="min-h-screen flex flex-col justify-between min-w-screen bg-cover bg-fixed bg-center bg-no-repeat relative bg-[#c93400]"
    >
      <Header />

      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="text-neutral-content text-center w-full max-w-7xl mx-auto px-4 py-8 isolate">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route element={<ContextLayout />}>
              {/* <Route path="/book-table" element={<BookTablePage />} /> */}
              <Route
                path="/location-date-time"
                element={<LocationDateTimePage />}
              />
              {/* <Route path="/my-reservation" element={<MyReservationPage />} />
              <Route
                path="/special-menu-selection"
                element={<SpecialMenuSelectionPage />}
              />
              <Route
                path="/email-verification"
                element={<EmailVerificationPage />}
              /> */}
            </Route>
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
