import { NavLink } from 'react-router-dom';

// Shared utility strings
const sharedLinkClass = "group relative z-10 px-4 py-2 text-2xl hover:underline hover:decoration-[#c93400] block transition-colors duration-200";

export const NavBarLink = ({ to, name, onClick }) => {
  return (
    <li className="list-none">
      <NavLink 
        to={to} 
        onClick={onClick} 
        className={({ isActive }) =>
          `${sharedLinkClass} ${
            isActive 
              ? "text-[#c93400] font-bold underline decoration-[#c93400]" 
              : "text-base-content"
          }`
        }
      >
        {name}
      </NavLink>
    </li>
  );
};

export default NavBarLink;