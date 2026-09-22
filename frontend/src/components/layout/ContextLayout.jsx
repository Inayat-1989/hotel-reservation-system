import { Outlet } from 'react-router-dom';
import { BookingProvider } from '../../context/BookingContext.jsx';

const ContextLayout = () => {
  return (
    <BookingProvider>
      <Outlet />  
    </BookingProvider>
  );
};

export default ContextLayout;
