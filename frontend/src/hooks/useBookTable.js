import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { updateReservation, findForm } from '../services/form-data.js'
import { validateContactDetails } from '../utils/validationUtils.js'
import { addPersonToList } from '../services/person-date.js'

export const useBookTable = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const targetId = location?.state?.targetId

  const bookingData = findForm(targetId)

  const [errorMessage, setErrorMessage] = useState(bookingData?.message)

  const handleChange = (e) => {
    const { name, value } = e.target
    if(name === 'email') {
      updateReservation({[name]: value})
    }
  }


  const handleProceed = (e) => {
    e.preventDefault()

    const personFormData = new FormData(e.currentTarget)
    const name = personFormData.get('name')
    const email = personFormData.get('email')
    const phone = personFormData.get('phone')
    const note = personFormData.get('note')

    const validationError = validateContactDetails({name, email, phone})
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    addPersonToList({'name': name, 'email': email, 'phone': phone})

    const updatedData = {
      id: targetId,
      email: email,
      note: note,
      message: '',
    }

    updateReservation(updatedData)
    if(bookingData?.hasSpecialMenu) {
      navigate('/special-menu-selection', { state: { targetId }})
      return
    }

    const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
    sessionStorage.setItem('pendingHoldExpiry', (Date.now() + FIFTEEN_MINUTES_IN_MS).toString());

    navigate('/email-verification', { state: { targetId }})
  }

  return {
    state: {
      targetId,
      errorMessage,
    },
    actions: {
      handleChange,
      handleProceed,
      navigate,
    },
  }
}