import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPatient } from '../api/clinicApi';
import { saveSessionPatient } from '../session';

const EMPTY_FORM = {
  documentNumber: '',
  fullName: '',
  birthDate: '',
  email: '',
  phone: '',
  allergies: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const patient = await registerPatient({
        ...form,
        allergies: form.allergies
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      });
      saveSessionPatient(patient);
      navigate('/');
    } catch (err) {
      setError(err.status === 409 ? 'Documento ya registrado' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Registro de paciente</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Número de documento
          <input name="documentNumber" value={form.documentNumber} onChange={handleChange} required />
        </label>
        <label>
          Nombre completo
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Fecha de nacimiento
          <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
        </label>
        <label>
          Correo electrónico
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Teléfono
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Alergias (separadas por comas)
          <input name="allergies" value={form.allergies} onChange={handleChange} placeholder="penicillin, ibuprofen" />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
