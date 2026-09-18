import React from 'react'
import ContactUsMainContentCard from './ContactUsMainContentCard'

const ContactUsMainContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
      <ContactUsMainContentCard symbol='📍' heading='Visit & Reserve' listOfItems={{'Address': 'Pinnacloid Gulberg III, Lahore', 'Hours': 'Mon–Sun (11:00 AM – 11:00 PM)'}} />
      <ContactUsMainContentCard symbol='✉️' heading='Direct Lines' listOfItems={{'Email': 'inayat2291@gmail.com', 'Phone': '+92 313 8393061', 'Github': 'Inayat-1989'}} />
    </div>
  )
}

export default ContactUsMainContent