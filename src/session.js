const SESSION_KEY = 'clinicPatient';

export function getSessionPatient() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionPatient(patient) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(patient));
  } catch {
    // Storage unavailable: session will not persist across reloads
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable: nothing to clear
  }
}
