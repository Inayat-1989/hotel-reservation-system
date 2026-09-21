import { Link } from 'react-router-dom';

import { NavBarLink } from '../navigation/NavBarLink.jsx';
import cartIcon from '../../assets/icons/cart-icon.png';

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="navbar-start">
        <Link
          to="/"
          className="text-4xl font-bold text-[#c93400] hover:underline"
        >
          Yummy.
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <NavBarLink to="/menu" name="Menu" />
          <NavBarLink to="/location-date-time" name="Location & Date Time" />
          <NavBarLink to="/contact" name="Contact Us" />
          <NavBarLink to="/my-reservation" name="My Reservations" />
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

export default Header;
