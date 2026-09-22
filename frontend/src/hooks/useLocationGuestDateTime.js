import { useContext } from 'react';
import { LocationGuestDateTimeContext } from '../context/LocationGuestDateTime';

const useLocationGuestDateTime = () => {
  const context = useContext(LocationGuestDateTimeContext);

  if (context === null) {
    throw new Error('Location Guest Date Time Context is null right now');
  }
  return context;
};

export default useLocationGuestDateTime;
