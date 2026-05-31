import { useEffect, useState } from 'react';
import { reservationService } from '../services/reservationService.js';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({
    reservationDate: '',
    reservationTime: '',
    tableNumber: '',
    partySize: '',
    notes: ''
  });
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await reservationService.listMine();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await reservationService.create(form);
      setForm({ reservationDate: '', reservationTime: '', tableNumber: '', partySize: '', notes: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
    }
  }

  return (
    <div>
      <h1>Mis reservas</h1>
      <div className="card">
        <h3>Nueva reserva</h3>
        <form onSubmit={submit}>
          <label>Fecha</label>
          <input type="date" value={form.reservationDate}
            onChange={(e) => setForm({ ...form, reservationDate: e.target.value })} required />
          <label>Hora</label>
          <input type="time" value={form.reservationTime}
            onChange={(e) => setForm({ ...form, reservationTime: e.target.value })} required />
          <label>Numero de mesa</label>
          <input type="number" min="1" value={form.tableNumber}
            onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} required />
          <label>Personas</label>
          <input type="number" min="1" value={form.partySize}
            onChange={(e) => setForm({ ...form, partySize: e.target.value })} required />
          <label>Notas</label>
          <textarea value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">Reservar</button>
        </form>
      </div>

      <div className="card">
        <h3>Historial</h3>
        {reservations.length === 0 ? <p>Sin reservas.</p> : (
          <table>
            <thead>
              <tr>
                <th>#</th><th>Fecha</th><th>Hora</th>
                <th>Mesa</th><th>Personas</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{new Date(r.reservation_date).toLocaleDateString('es-CO')}</td>
                  <td>{r.reservation_time}</td>
                  <td>{r.table_number}</td>
                  <td>{r.party_size}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
