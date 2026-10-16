const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/clinica`;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || `Error ${response.status}`;
    throw new ApiError(message, response.status);
  }
  return data;
}

export function registerPatient(patient) {
  return request('/paciente', { method: 'POST', body: JSON.stringify(patient) });
}

export function getPatientByDocument(documentNumber) {
  return request(`/paciente/${encodeURIComponent(documentNumber)}`);
}

export function getDoctorsBySpecialty(specialty) {
  return request(`/medicos?especialidad=${encodeURIComponent(specialty)}`);
}

export function scheduleAppointment(appointment) {
  return request('/cita', { method: 'POST', body: JSON.stringify(appointment) });
}

export function getMedicalHistory(patientId) {
  return request(`/historia/${encodeURIComponent(patientId)}`);
}

export function createPrescription(prescription) {
  return request('/prescripcion', { method: 'POST', body: JSON.stringify(prescription) });
}

export function requestLabExams(labRequest) {
  return request('/laboratorio', { method: 'POST', body: JSON.stringify(labRequest) });
}
