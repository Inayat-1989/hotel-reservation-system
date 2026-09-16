import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBarLink from './NavBarLinkAndButton';
import cartIcon from '../../assets/cart-icon.png';

const startBtn = "text-4xl font-bold text-[#c93400] hover:underline";

const NavBar = () => {
  const navigate = useNavigate();
  const [reservationCount, setReservationCount] = useState(0);

  // Sync reservation list length
  useEffect(() => {
    const updateCount = () => {
      const savedReservations = localStorage.getItem('myReservations') || sessionStorage.getItem('pendingReservation');
      if (savedReservations) {
        try {
          const parsed = JSON.parse(savedReservations);
          setReservationCount(Array.isArray(parsed) ? parsed.length : 1);
        } catch {
          setReservationCount(0);
        }
      } else {
        setReservationCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  const handleBookingNavigation = (e) => {
    e.preventDefault();
    
    const savedExpiry = sessionStorage.getItem('pendingHoldExpiry');
    const savedBooking = sessionStorage.getItem('pendingReservation');

    if (savedExpiry && savedBooking) {
      const remainingTime = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);

      if (remainingTime > 0) {
        navigate('/email-verification', {
          state: { booking: JSON.parse(savedBooking) }
        });
        return;
      }
    }

    navigate('/location-date-time');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="navbar-start">
        <Link to="/" className={`${startBtn}`}>
          Yummy.
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <NavBarLink 
            to="/menu" 
            name="Menu" 
          />
          <NavBarLink 
            to="/location-date-time" 
            name="Location & Date Time" 
            onClick={handleBookingNavigation} 
          />
          <NavBarLink 
            to="/contact" 
            name="Contact Us" 
          />
          <NavBarLink 
            to="/my-reservation" 
            name="My Reservations" 
          />
        </ul>
      </div>  

      <div className="navbar-end flex items-center gap-4">
        <NavBarLink 
          to="/location-date-time" 
          name={
            <img 
              src={cartIcon} 
              alt="Cart Icon" 
              className="w-7 h-7 object-contain inline-block" 
            />
          } 
        />
      </div>
    </div>
  );
};

export default NavBar;