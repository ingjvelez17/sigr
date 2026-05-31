import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { orderService } from '../services/orderService.js';
import { useAuth } from '../services/AuthContext.jsx';
import OrderRow from '../components/OrderRow.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  async function load() {
    const data = await orderService.list();
    setOrders(data);
  }

  useEffect(() => {
    load();
    const socket = io(SOCKET_URL);
    socket.emit(user?.role === 'mesero' ? 'join:waiter' : 'join:kitchen');
    socket.on('order:new', load);
    socket.on('order:updated', load);
    return () => socket.disconnect();
  }, [user]);

  async function changeStatus(id, status) {
    await orderService.updateStatus(id, status);
    load();
  }

  return (
    <div>
      <h1>Pedidos</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente / Mesa</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} onChangeStatus={changeStatus} />
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p>Sin pedidos aun.</p>}
      </div>
    </div>
  );
}
