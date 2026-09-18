export const HOLD_DURATION_MS = 15 * 60 * 1000

export const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const getRemainingHoldSeconds = () => {
  const savedExpiry = sessionStorage.getItem('pendingHoldExpiry')
  if (savedExpiry) {
    const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000)
    return remaining > 0 ? remaining : 0
  }

  const newExpiry = Date.now() + HOLD_DURATION_MS
  sessionStorage.setItem('pendingHoldExpiry', newExpiry.toString())
  return 900
}