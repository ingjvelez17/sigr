import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import { useAuth } from './services/AuthContext.jsx';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/orders" element={
            <PrivateRoute><OrdersPage /></PrivateRoute>
          } />
          <Route path="/reservations" element={
            <PrivateRoute><ReservationsPage /></PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute roles={['admin']}><ReportsPage /></PrivateRoute>
          } />
        </Routes>
      </main>
    </>
  );
}
