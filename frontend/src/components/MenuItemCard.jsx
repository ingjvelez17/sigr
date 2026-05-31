export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p style={{ color: '#6b7280' }}>{item.description}</p>
      <p><strong>${parseFloat(item.price).toLocaleString('es-CO')}</strong></p>
      <small>Categoria: {item.category_name}</small>
      {onAdd && (
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => onAdd(item)} disabled={!item.available}>
            {item.available ? 'Agregar al pedido' : 'No disponible'}
          </button>
        </div>
      )}
    </div>
  );
}
