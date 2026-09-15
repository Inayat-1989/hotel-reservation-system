import { Link, useNavigate } from 'react-router-dom'
import { NavBarLink, NavBarButton } from './NavBarLinkAndButton'

const startBtn = "text-4xl font-bold text-[#c93400] underline"

const NavBar = () => {
  const navigate = useNavigate()

  const handleBookingNavigation = (e) => {
    e.preventDefault(); // Prevents standard <Link to="..."> behavior

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
  }

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
        </ul>
      </div>  

      <div className="navbar-end">
        <NavBarButton 
          to="/location-date-time" 
          name="Book a Table" 
          onClick={handleBookingNavigation} 
        />
      </div>
    </div>
  )
}

export default NavBar