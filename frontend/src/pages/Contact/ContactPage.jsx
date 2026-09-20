import HeroHeading from '../../components/ui/HeroHeading.jsx'
import NextPageButton from '../../components/navigation/NextPageButton.jsx'

import ContactUsMainContent from './ContactUsMainContent.jsx'
import ContactUsEnd from './ContactUsEnd.jsx'

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-3xl bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        <HeroHeading heading='Get in Touch' paragraph='Have questions about reservations, private events, or catering? We are here to help!' />  
        <ContactUsMainContent />
        <ContactUsEnd />
      </div>
      
      <NextPageButton to="/menu" name="Explore Menu" />
    </div>
  )
}

export default ContactPage
