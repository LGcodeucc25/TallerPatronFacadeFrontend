import { useEffect, useState } from 'react';
import { getMedicalHistory } from '../api/clinicApi';
import LabResultBadge from '../components/LabResultBadge';
import { formatDate } from '../constants';
import { getSessionPatient } from '../session';

const TABS = [
  { key: 'consultations', label: 'Consultas' },
  { key: 'prescriptions', label: 'Prescripciones' },
  { key: 'labResults', label: 'Laboratorios' },
];

function ConsultationsTab({ consultations }) {
  if (consultations.length === 0) return <p className="muted">No hay consultas registradas.</p>;
  return (
    <ul className="list">
      {consultations.map((c) => (
        <li key={c.id}>
          <strong>{formatDate(c.date)}</strong> · {c.doctorName}
          <div>
            <em>Diagnóstico:</em> {c.diagnosis}
          </div>
          {c.notes && <div className="muted">{c.notes}</div>}
        </li>
      ))}
    </ul>
  );
}

function PrescriptionsTab({ prescriptions }) {
  if (prescriptions.length === 0) return <p className="muted">No hay prescripciones registradas.</p>;
  return (
    <ul className="list">
      {prescriptions.map((p) => (
        <li key={p.id}>
          <strong>{formatDate(p.date)}</strong>
          <ul>
            {p.medications.map((m, index) => (
              <li key={index}>
                {m.name} — {m.dose} durante {m.durationDays} días
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function LabResultsTab({ labResults }) {
  if (labResults.length === 0) return <p className="muted">No hay resultados de laboratorio.</p>;
  return labResults.map((r) => <LabResultBadge key={r.id} result={r} />);
}

export default function MedicalHistoryPage() {
  const patient = getSessionPatient();
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('consultations');

  useEffect(() => {
    getMedicalHistory(patient.id)
      .then(setHistory)
      .catch((err) => setError(err.message));
  }, [patient.id]);

  return (
    <main className="container">
      <h1>Historia clínica</h1>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="card">
        {error && <p className="error">{error}</p>}
        {!history && !error && <p className="muted">Cargando...</p>}
        {history && activeTab === 'consultations' && (
          <ConsultationsTab consultations={history.consultations || []} />
        )}
        {history && activeTab === 'prescriptions' && (
          <PrescriptionsTab prescriptions={history.prescriptions || []} />
        )}
        {history && activeTab === 'labResults' && (
          <LabResultsTab labResults={history.labResults || []} />
        )}
      </section>
    </main>
  );
}
