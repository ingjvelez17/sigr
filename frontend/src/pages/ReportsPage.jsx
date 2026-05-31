import { useEffect, useState } from 'react';
import { reportService } from '../services/reportService.js';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [current, setCurrent] = useState(null);

  async function loadReport() {
    const data = await reportService.daily(date);
    setReport(data);
  }

  async function loadCash() {
    const data = await reportService.currentCash();
    setCurrent(data);
  }

  useEffect(() => { loadReport(); loadCash(); }, []);

  async function openCash() {
    const amount = prompt('Monto de apertura:');
    if (!amount) return;
    await reportService.openCash({ openingAmount: parseFloat(amount) });
    loadCash();
  }

  async function closeCash() {
    const amount = prompt('Monto de cierre:');
    if (!amount) return;
    await reportService.closeCash(current.id, { closingAmount: parseFloat(amount) });
    loadCash();
  }

  return (
    <div>
      <h1>Reportes y Caja</h1>

      <div className="card">
        <h3>Caja actual</h3>
        {current?.status === 'abierta' ? (
          <>
            <p>Abierta desde {new Date(current.opening_time).toLocaleString('es-CO')}</p>
            <p>Apertura: ${parseFloat(current.opening_amount).toLocaleString('es-CO')}</p>
            <button className="btn btn-danger" onClick={closeCash}>Cerrar caja</button>
          </>
        ) : (
          <>
            <p>No hay caja abierta.</p>
            <button className="btn" onClick={openCash}>Abrir caja</button>
          </>
        )}
      </div>

      <div className="card">
        <h3>Reporte diario</h3>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn" onClick={loadReport}>Generar</button>
        {report && (
          <div style={{ marginTop: 16 }}>
            <p><strong>Total pedidos:</strong> {report.summary.total_orders}</p>
            <p><strong>Ventas:</strong> ${parseFloat(report.summary.total_sales).toLocaleString('es-CO')}</p>
            <p><strong>Promedio:</strong> ${parseFloat(report.summary.average_order).toLocaleString('es-CO')}</p>
            <h4>Top 5 platos</h4>
            <ul>
              {report.topItems.map(it => (
                <li key={it.id}>{it.name} - {it.total_sold} ventas</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
