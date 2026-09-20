export const validateContactDetails = ({ name, email, phone }) => {
  const nameTrimmed = (name || '').trim()
  const emailTrimmed = (email || '').trim()
  const phoneTrimmed = (phone || '').trim()

  const nameRegex = /^[A-Za-z\s]{2,50}$/
  if (!nameRegex.test(nameTrimmed)) {
    return 'Please enter a valid Full Name (letters and spaces only, at least 2 characters).'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailTrimmed)) {
    return 'Please enter a valid Email Address (e.g., name@example.com).'
  }

  const phoneRegex = /^\+?[0-9]{7,15}$/
  if (!phoneRegex.test(phoneTrimmed)) {
    return 'Please enter a valid Phone Number (7 to 15 digits, optional + prefix).'
  }

  return null
}