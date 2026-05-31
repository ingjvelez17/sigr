import { useEffect, useState } from 'react';
import { menuService } from '../services/menuService.js';
import { orderService } from '../services/orderService.js';
import { useAuth } from '../services/AuthContext.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';

export default function MenuPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    menuService.listItems({ available: true }).then(setItems).catch(console.error);
  }, []);

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find(i => i.menuItemId === item.id);
      if (found) {
        return prev.map(i => i.menuItemId === item.id
          ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  async function placeOrder() {
    setError(''); setSuccess('');
    try {
      const order = await orderService.create({
        items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity }))
      });
      setSuccess(`Pedido #${order.id} creado por $${order.total}`);
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el pedido');
    }
  }

  return (
    <div>
      <h1>Menu del dia</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {items.map((it) => (
          <MenuItemCard key={it.id} item={it} onAdd={user ? addToCart : null} />
        ))}
      </div>

      {user && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2>Mi pedido ({cart.length})</h2>
          {cart.length === 0 ? (
            <p>Aun no has agregado items.</p>
          ) : (
            <>
              <ul>
                {cart.map(c => (
                  <li key={c.menuItemId}>
                    {c.name} x {c.quantity} = ${(c.price * c.quantity).toLocaleString('es-CO')}
                  </li>
                ))}
              </ul>
              <button className="btn" onClick={placeOrder}>Confirmar pedido</button>
            </>
          )}
          {error && <div className="error">{error}</div>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      )}
    </div>
  );
}
