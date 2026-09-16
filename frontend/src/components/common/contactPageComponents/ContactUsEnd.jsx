import React from 'react'
import ContactUs from './ContactUs'

const ContactUsEnd = () => {
  return (
    <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-gray-400 mb-4">Follow us or join our community online</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <ContactUs account='Instagram' url='' />
            <ContactUs account='Facebook' url='' />
            <ContactUs account='Twitter / X' url='' />
        </div>
    </div>
  )
}

export default ContactUsEnd