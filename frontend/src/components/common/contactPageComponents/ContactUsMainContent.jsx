import React from 'react'
import ContactUsMainContentCard from './ContactUsMainContentCard'

const ContactUsMainContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
      <ContactUsMainContentCard symbol='📍' heading='Visit & Reserve' listOfItems={{'Address': '100 Culinary Way, Suite 400', 'Hours': 'Mon–Sun (11:00 AM – 11:00 PM)'}} />
      <ContactUsMainContentCard symbol='✉️' heading='Direct Lines' listOfItems={{'Email': 'support@restaurant.com', 'Phone': '+92 313 8393061', 'Events': 'events@restaurant.com'}} />
    </div>
  )
}

export default ContactUsMainContent