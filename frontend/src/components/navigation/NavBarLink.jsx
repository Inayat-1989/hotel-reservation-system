import { NavLink } from 'react-router-dom';

export const NavBarLink = ({ to, name, onClick }) => {
  return (
    <li className="list-none">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `group relative z-10 px-4 py-2 text-2xl hover:underline hover:decoration-[#c93400] block transition-colors duration-200 ${
            isActive
              ? 'text-[#c93400] font-bold underline decoration-[#c93400]'
              : 'text-base-content'
          }`
        }
      >
        {name}
      </NavLink>
    </li>
  );
};

export default NavBarLink;
