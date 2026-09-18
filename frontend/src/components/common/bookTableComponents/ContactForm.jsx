import { findForm } from "../../data-storage/form-data"
import { findPerson, personList } from "../../data-storage/person-date"
const ContactForm = ({ targetId, onChange }) => {
  const form = findForm(targetId)
  const person = findPerson(form?.email)
  return (
    <div className="space-y-6">
      <div className="border-t border-white/10 pt-6 space-y-4 text-left">
        <h3 className="text-base font-semibold text-[#c93400]">Contact Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={person?.name}
              onChange={onChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={person?.email}
              onChange={onChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g. +1234567890)"
              value={person?.phone}
              onChange={onChange}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
            />
          </div>
        </div>

        <textarea
          name="note"
          rows="2"
          placeholder="Special requests, dietary restrictions, or anniversary notes (optional)"
          value={form?.note}
          onChange={onChange}
          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c93400] transition-colors"
        />
      </div>
    </div>
  )
}

export default ContactForm