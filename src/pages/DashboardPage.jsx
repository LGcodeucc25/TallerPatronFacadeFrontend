import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPrescription, getMedicalHistory, requestLabExams } from '../api/clinicApi';
import LabResultBadge from '../components/LabResultBadge';
import { LAB_EXAMS, formatDateTime, specialtyLabel } from '../constants';
import { getSessionPatient } from '../session';

const RECENT_LAB_LIMIT = 5;
const EMPTY_MEDICATION = { name: '', dose: '', durationDays: '' };

function LabRequestForm({ patientId, onDone }) {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleExam = (value) =>
    setExams((current) =>
      current.includes(value) ? current.filter((e) => e !== value) : [...current, value],
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exams.length === 0) {
      setError('Selecciona al menos un examen');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await requestLabExams({ patientId, exams });
      onDone('Exámenes solicitados correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Solicitar exámenes</h3>
      {LAB_EXAMS.map((exam) => (
        <label key={exam.value} className="checkbox">
          <input
            type="checkbox"
            checked={exams.includes(exam.value)}
            onChange={() => toggleExam(exam.value)}
          />
          {exam.label}
        </label>
      ))}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Solicitar'}
      </button>
    </form>
  );
}

function PrescriptionForm({ patientId, onDone }) {
  const [medications, setMedications] = useState([{ ...EMPTY_MEDICATION }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateMedication = (index, field, value) =>
    setMedications((current) =>
      current.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
    );

  const addMedication = () => setMedications((current) => [...current, { ...EMPTY_MEDICATION }]);

  const removeMedication = (index) =>
    setMedications((current) => current.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createPrescription({
        patientId,
        medications: medications.map((med) => ({
          name: med.name.trim(),
          dose: med.dose.trim(),
          durationDays: Number(med.durationDays),
        })),
      });
      onDone('Prescripción creada correctamente');
    } catch (err) {
      // 422 carries the allergy conflict message from the backend
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Nueva prescripción</h3>
      {medications.map((med, index) => (
        <div key={index} className="medication-row">
          <input
            placeholder="Medicamento"
            value={med.name}
            onChange={(e) => updateMedication(index, 'name', e.target.value)}
            required
          />
          <input
            placeholder="Dosis"
            value={med.dose}
            onChange={(e) => updateMedication(index, 'dose', e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Días"
            value={med.durationDays}
            onChange={(e) => updateMedication(index, 'durationDays', e.target.value)}
            required
          />
          {medications.length > 1 && (
            <button type="button" className="secondary" onClick={() => removeMedication(index)}>
              Quitar
            </button>
          )}
        </div>
      ))}
      <button type="button" className="secondary" onClick={addMedication}>
        + Agregar medicamento
      </button>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Crear prescripción'}
      </button>
    </form>
  );
}

export default function DashboardPage() {
  const patient = getSessionPatient();
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const [notice, setNotice] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await getMedicalHistory(patient.id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [patient.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleFormDone = (message) => {
    setActiveForm(null);
    setNotice(message);
    loadHistory();
  };

  const toggleForm = (name) => {
    setNotice('');
    setActiveForm((current) => (current === name ? null : name));
  };

  const now = new Date();
  const upcomingAppointments = (history?.appointments || [])
    .filter((a) => a.status === 'SCHEDULED' && new Date(a.dateTime) > now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  const recentLabResults = [...(history?.labResults || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, RECENT_LAB_LIMIT);

  return (
    <main className="container">
      <h1>Hola, {patient.fullName}</h1>

      <div className="actions">
        <button type="button" onClick={() => toggleForm('lab')}>
          Solicitar exámenes
        </button>
        <button type="button" onClick={() => toggleForm('prescription')}>
          Nueva prescripción
        </button>
        <Link to="/schedule" className="button-link">
          Agendar cita
        </Link>
      </div>

      {notice && <p className="success">{notice}</p>}
      {activeForm === 'lab' && <LabRequestForm patientId={patient.id} onDone={handleFormDone} />}
      {activeForm === 'prescription' && (
        <PrescriptionForm patientId={patient.id} onDone={handleFormDone} />
      )}

      {error && <p className="error">{error}</p>}
      {!history && !error && <p className="muted">Cargando...</p>}

      {history && (
        <div className="grid">
          <section className="card">
            <h2>Próximas citas</h2>
            {upcomingAppointments.length === 0 ? (
              <p className="muted">No tienes citas próximas.</p>
            ) : (
              <ul className="list">
                {upcomingAppointments.map((a) => (
                  <li key={a.id}>
                    <strong>{formatDateTime(a.dateTime)}</strong>
                    <div>
                      {a.doctorName} · {specialtyLabel(a.specialty)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2>Últimos resultados de laboratorio</h2>
            {recentLabResults.length === 0 ? (
              <p className="muted">No hay resultados de laboratorio.</p>
            ) : (
              recentLabResults.map((r) => <LabResultBadge key={r.id} result={r} />)
            )}
          </section>
        </div>
      )}
    </main>
  );
}
