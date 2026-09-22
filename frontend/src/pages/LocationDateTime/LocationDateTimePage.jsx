import { LocationGuestDateTimeProvider } from '../../context/LocationGuestDateTime.jsx';

import HeroHeading from '../../components/ui/HeroHeading.jsx';
import NextPageButton from '../../components/navigation/NextPageButton.jsx';

import LocationDateTimeSelect from './LocationDateTimeSelect.jsx';
import GuestDateTimeSelect from './GuestDateTimeSelect.jsx';
import IsCalenderOpen from './IsCalenderOpen.jsx';
import InsufficientSeats from './InsufficientSeats.jsx';

const LocationDateTimePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <LocationGuestDateTimeProvider>
        <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
          <HeroHeading
            heading={'Locations & Opening Hours'}
            paragraph={
              'Select a location and reserve your table for any available date and time slot.'
            }
          />
          <LocationDateTimeSelect />

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-[#c93400] mb-4">
              {' '}
              Plan Your Visit at our Restaurant
            </h3>
            <GuestDateTimeSelect />
          </div>
        </div>

        <NextPageButton to="/menu" name="Menu" />

        <IsCalenderOpen />

        <InsufficientSeats />
      </LocationGuestDateTimeProvider>
    </div>
  );
};

export default LocationDateTimePage;
