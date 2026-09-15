import { Link } from 'react-router-dom';

// Shared utility strings
const sharedLinkClass = "group relative z-10 overflow-hidden px-4 py-2 text-2xl underline decoration-[#c93400] transition-colors duration-700 hover:text-white hover:decoration-white";
const slideBgSpan = <span className="absolute inset-0 -z-10 translate-y-full bg-[#c93400] transition-transform duration-700 ease-in-out group-hover:translate-y-0"></span>;

export const NavBarLink = ({ to, name, onClick }) => {
  return (
    <li>
      <Link 
        to={to} 
        onClick={onClick} 
        className={`${sharedLinkClass} rounded-none block`}
      >
        {slideBgSpan}
        {name}
      </Link>
    </li>
  )
}

export const NavBarButton = ({ to, name, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`border-[#c93400] rounded-full text-[#c93400] text-3xl ${sharedLinkClass}`}
    >
      {slideBgSpan}
      {name}
    </Link>
  )
}