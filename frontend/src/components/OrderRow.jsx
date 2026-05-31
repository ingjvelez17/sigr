export default function OrderRow({ order, onChangeStatus }) {
  const transitions = {
    pendiente: 'en_preparacion',
    en_preparacion: 'listo',
    listo: 'entregado'
  };
  const nextStatus = transitions[order.status];

  return (
    <tr>
      <td>#{order.id}</td>
      <td>{order.customer_name || 'Mesa ' + order.table_number}</td>
      <td>{order.items?.length || 0} item(s)</td>
      <td>${parseFloat(order.total).toLocaleString('es-CO')}</td>
      <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
      <td>
        {nextStatus && onChangeStatus && (
          <button className="btn" onClick={() => onChangeStatus(order.id, nextStatus)}>
            Marcar como {nextStatus}
          </button>
        )}
      </td>
    </tr>
  );
}
