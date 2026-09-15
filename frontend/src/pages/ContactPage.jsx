import React from 'react'
import NextPageButton from '../components/common/NextPageButton.jsx'

const ContactPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      
      <div className="w-full max-w-3xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#c93400] mb-3">
          Get in Touch
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base max-w-lg mx-auto mb-8">
          Have questions about reservations, private events, or catering? We're here to help!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-[#c93400]/50 transition-colors">
            <h2 className="text-xl font-semibold text-[#c93400] mb-3 flex items-center gap-2">
              📍 Visit & Reserve
            </h2>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <strong className="text-white">Address:</strong> 100 Culinary Way, Suite 400
              </li>
              <li>
                <strong className="text-white">Hours:</strong> Mon–Sun (11:00 AM – 11:00 PM)
              </li>
              <li className="pt-2">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#c93400] underline font-medium hover:text-white transition-colors"
                >
                  View on Google Maps →
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-[#c93400]/50 transition-colors">
            <h2 className="text-xl font-semibold text-[#c93400] mb-3 flex items-center gap-2">
              ✉️ Direct Lines
            </h2>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <strong className="text-white">Email: </strong>
                <a href="mailto:support@restaurant.com" className="underline hover:text-[#c93400] transition-colors">
                  support@restaurant.com
                </a>
              </li>
              <li>
                <strong className="text-white">Phone: </strong>
                <a href="tel:+1234567890" className="underline hover:text-[#c93400] transition-colors">
                  +1 (555) 019-2834
                </a>
              </li>
              <li>
                <strong className="text-white">Events: </strong>
                <a href="mailto:events@restaurant.com" className="underline hover:text-[#c93400] transition-colors">
                  events@restaurant.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-4">Follow us or join our community online</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <a 
              href="#" 
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c93400] text-white transition-all duration-300 shadow-sm"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c93400] text-white transition-all duration-300 shadow-sm"
            >
              Facebook
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c93400] text-white transition-all duration-300 shadow-sm"
            >
              Twitter / X
            </a>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <NextPageButton to="/menu" name="Explore Menu" />
      </div>

    </div>
  )
}

export default ContactPage