import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getSessionPatient } from '../session';

export default function Navbar() {
  const navigate = useNavigate();
  const patient = getSessionPatient();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">Gestión Médica</span>
      <div className="links">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/schedule">Agendar cita</NavLink>
        <NavLink to="/history">Historia clínica</NavLink>
      </div>
      <div className="user">
        {patient && <span>{patient.fullName}</span>}
        <button type="button" className="secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
