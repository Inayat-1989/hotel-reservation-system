import HeroHeading from '../../components/ui/HeroHeading.jsx';
import NextPageButton from '../../components/navigation/NextPageButton.jsx';

import SelectedLocationDetail from './SelectedLocationDetail.jsx';
import ContactForm from './ContactForm.jsx';

import { useBookTable } from '../../hooks/useBookTable.js';

const BookTablePage = () => {
  const { state, actions } = useBookTable();
  const { targetId, errorMessage } = state;
  const { handleChange, handleProceed, navigate } = actions;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in relative">
      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading
          heading="Book a Table"
          paragraph="Complete your contact details to reserve your dining experience."
        />

        <form onSubmit={handleProceed} className="space-y-6" noValidate>
          {errorMessage && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-xs md:text-sm text-center font-medium animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          <SelectedLocationDetail
            targetId={targetId}
            onChangeDetails={() => navigate(-1)}
          />

          <ContactForm handleChange={handleChange} targetId={targetId} />

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Booking
            </button>
          </div>
        </form>
      </div>

      <NextPageButton to="/my-reservation" name="Reservations" />
    </div>
  );
};

export default BookTablePage;
