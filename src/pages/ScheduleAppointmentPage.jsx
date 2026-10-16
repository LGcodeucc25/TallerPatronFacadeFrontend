import { useEffect, useState } from 'react';
import { getDoctorsBySpecialty, scheduleAppointment } from '../api/clinicApi';
import { SPECIALTIES, formatDateTime, specialtyLabel } from '../constants';
import { getSessionPatient } from '../session';

export default function ScheduleAppointmentPage() {
  const patient = getSessionPatient();
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setDoctors([]);
    setDoctorId('');
    setDateTime('');
    if (!specialty) return;

    let cancelled = false;
    getDoctorsBySpecialty(specialty)
      .then((data) => {
        if (!cancelled) setDoctors(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [specialty]);

  const selectedDoctor = doctors.find((d) => String(d.id) === doctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await scheduleAppointment({
        patientId: patient.id,
        specialty,
        doctorId: selectedDoctor.id,
        dateTime,
      });
      setResult(response);
      setSpecialty('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Agendar cita</h1>

      {result && (
        <div className="card">
          <p className="success">Cita agendada correctamente</p>
          <p>
            <strong>{formatDateTime(result.appointment.dateTime)}</strong> con{' '}
            {result.appointment.doctorName} ({specialtyLabel(result.appointment.specialty)})
          </p>
          {result.reminder && <p className="muted">{result.reminder}</p>}
        </div>
      )}

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Especialidad
          <select
            value={specialty}
            onChange={(e) => {
              setError('');
              setResult(null);
              setSpecialty(e.target.value);
            }}
            required
          >
            <option value="">Selecciona una especialidad</option>
            {SPECIALTIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Médico
          <select
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setDateTime('');
            }}
            disabled={doctors.length === 0}
            required
          >
            <option value="">Selecciona un médico</option>
            {doctors.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.fullName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Horario
          <select
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            disabled={!selectedDoctor}
            required
          >
            <option value="">Selecciona un horario</option>
            {(selectedDoctor?.availableSlots || []).map((slot) => (
              <option key={slot} value={slot}>
                {formatDateTime(slot)}
              </option>
            ))}
          </select>
        </label>

        {selectedDoctor && selectedDoctor.availableSlots.length === 0 && (
          <p className="muted">Este médico no tiene horarios disponibles.</p>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading || !dateTime}>
          {loading ? 'Agendando...' : 'Agendar'}
        </button>
      </form>
    </main>
  );
}
