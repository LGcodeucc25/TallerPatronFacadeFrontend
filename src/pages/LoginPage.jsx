import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPatientByDocument } from '../api/clinicApi';
import { saveSessionPatient } from '../session';

export default function LoginPage() {
  const navigate = useNavigate();
  const [documentNumber, setDocumentNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const patient = await getPatientByDocument(documentNumber.trim());
      saveSessionPatient(patient);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Iniciar sesión</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Número de documento
          <input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Ingresar'}
        </button>
        <p>
          ¿No estás registrado? <Link to="/register">Crea tu cuenta</Link>
        </p>
      </form>
    </main>
  );
}
