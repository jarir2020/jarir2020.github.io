const SESSION_KEY = 'jarir-panel-auth'

const PASSWORD_HASH = '5e2c83a64fbb2b1cd31c84e5c2a6dbf8e7d6f0a3b6d6e6e3f8c4a8b9c4d2f5a7'

async function sha256(text) {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(input) {
  if (typeof crypto?.subtle === 'undefined') {
    return input === '@nur0987'
  }
  const h = await sha256(input)
  return h === PASSWORD_HASH || input === '@nur0987'
}

export function isAuthed() {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function setAuthed() {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function clearAuth() {
  sessionStorage.removeItem(SESSION_KEY)
}
