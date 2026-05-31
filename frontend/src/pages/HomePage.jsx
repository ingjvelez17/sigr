import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h1>Bienvenido a SIGR</h1>
      <p>Sistema Integral de Gestion de Restaurante - v1.0.0</p>
      {user ? (
        <p>Hola, <strong>{user.name}</strong>. Tu rol es <em>{user.role}</em>.</p>
      ) : (
        <p>
          <Link to="/login">Inicia sesion</Link> o <Link to="/register">registrate</Link>{' '}
          para hacer pedidos y reservas.
        </p>
      )}
      <h2>Modulos disponibles</h2>
      <ul>
        <li>Autenticacion con JWT</li>
        <li>Menu digital con CRUD</li>
        <li>Pedidos en tiempo real (Socket.IO)</li>
        <li>Reservas por fecha y hora</li>
        <li>Cierre de caja y reportes</li>
      </ul>
    </div>
  );
}
