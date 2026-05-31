import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div>
        <Link to="/"><strong>SIGR</strong></Link>
        <Link to="/menu">Menu</Link>
        {user && <Link to="/orders">Pedidos</Link>}
        {user && <Link to="/reservations">Reservas</Link>}
        {user?.role === 'admin' && <Link to="/reports">Reportes</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>
              {user.name} ({user.role})
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesion</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}
