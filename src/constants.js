export const SPECIALTIES = [
  { value: 'GENERAL_MEDICINE', label: 'Medicina general' },
  { value: 'CARDIOLOGY', label: 'Cardiología' },
  { value: 'PEDIATRICS', label: 'Pediatría' },
];

export const LAB_EXAMS = [
  { value: 'HEMOGRAM', label: 'Hemograma' },
  { value: 'GLUCOSE', label: 'Glucosa' },
  { value: 'LIPID_PROFILE', label: 'Perfil lipídico' },
];

export function specialtyLabel(value) {
  return SPECIALTIES.find((s) => s.value === value)?.label || value;
}

export function examLabel(value) {
  return LAB_EXAMS.find((e) => e.value === value)?.label || value;
}

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-CO');
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-CO');
}
