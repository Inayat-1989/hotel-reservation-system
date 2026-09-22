import { useNavigate } from 'react-router-dom';

import HeroHeading from '../../components/ui/HeroHeading.jsx';
import NextPageButton from '../../components/navigation/NextPageButton.jsx';

import SelectedLocationDetail from './SelectedLocationDetail.jsx';
import ContactForm from './ContactForm.jsx';

import useBooking from '../../hooks/useBooking.js';
import { useBookTable } from '../../hooks/useBookTable.js';

const BookTablePage = () => {
  const { errorMessage } = useBooking();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading
          heading="Book a Table"
          paragraph="Complete your contact details to reserve your dining experience."
        />

        <div className="space-y-6" noValidate>
          {errorMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-xs md:text-sm text-center font-medium animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          <SelectedLocationDetail onChangeDetails={() => navigate(-1)} />

          <ContactForm />
        </div>
      </div>

      <NextPageButton to="/my-reservation" name="Reservations" />
    </div>
  );
};

export default BookTablePage;
