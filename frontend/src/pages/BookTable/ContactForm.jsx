import { useBookTable } from '../../hooks/useBookTable.js';

const ContactForm = () => {
  const { state, actions } = useBookTable();
  const { name, email, phone, note } = state;

  // Destructure handlers properly from your hook
  const { handleChange, handleProceed } = actions;

  const handleSubmit = (event) => {
    event.preventDefault();
    handleProceed();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-t border-white/10 pt-6 space-y-4 text-left">
        <h3 className="text-base font-semibold text-[#c93400]">
          Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name || ''}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email || ''}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g. +1234567890)"
              value={phone || ''}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
        </div>

        <textarea
          name="note"
          rows="2"
          placeholder="Special requests, dietary restrictions, or anniversary notes (optional)"
          value={note || ''}
          onChange={handleChange}
          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
        />
      </div>

      <div className="pt-4 text-center">
        <button
          type="submit"
          className="w-full md:w-auto px-10 py-3.5 rounded-full bg-[#c93400] text-white text-lg font-bold shadow-lg hover:bg-white hover:text-[#c93400] transition-all duration-300 transform hover:scale-105"
        >
          Proceed to Booking
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
