const { query, pool } = require('../config/database');

const VALID_STATUS = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

const Order = {
  VALID_STATUS,

  async create({ customerId = null, waiterId = null, tableNumber = null, notes = null, items = [] }) {
    if (!items.length) throw new Error('El pedido debe tener al menos un item');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `INSERT INTO orders (customer_id, waiter_id, table_number, status, notes, total)
         VALUES ($1, $2, $3, 'pendiente', $4, 0)
         RETURNING *`,
        [customerId, waiterId, tableNumber, notes]
      );
      const order = orderResult.rows[0];

      let total = 0;
      for (const item of items) {
        const menuRes = await client.query(
          'SELECT price FROM menu_items WHERE id = $1 AND available = TRUE',
          [item.menuItemId]
        );
        if (!menuRes.rows[0]) {
          throw new Error(`Plato ${item.menuItemId} no disponible`);
        }
        const unitPrice = parseFloat(menuRes.rows[0].price);
        const subtotal = unitPrice * item.quantity;
        total += subtotal;

        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.menuItemId, item.quantity, unitPrice, subtotal, item.notes || null]
        );
      }

      const updated = await client.query(
        'UPDATE orders SET total = $1 WHERE id = $2 RETURNING *',
        [total, order.id]
      );

      await client.query('COMMIT');
      return updated.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async findAll({ status } = {}) {
    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = 'WHERE o.status = $1';
    }
    const result = await query(
      `SELECT o.*, u.name AS customer_name, w.name AS waiter_name
       FROM orders o
       LEFT JOIN users u ON u.id = o.customer_id
       LEFT JOIN users w ON w.id = o.waiter_id
       ${where}
       ORDER BY o.created_at DESC`,
      params
    );

    const orders = result.rows;
    for (const order of orders) {
      const items = await query(
        `SELECT oi.*, m.name AS menu_item_name
         FROM order_items oi
         JOIN menu_items m ON m.id = oi.menu_item_id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = items.rows;
    }
    return orders;
  },

  async findById(id) {
    const result = await query(
      `SELECT o.*, u.name AS customer_name, w.name AS waiter_name
       FROM orders o
       LEFT JOIN users u ON u.id = o.customer_id
       LEFT JOIN users w ON w.id = o.waiter_id
       WHERE o.id = $1`,
      [id]
    );
    const order = result.rows[0];
    if (!order) return null;

    const items = await query(
      `SELECT oi.*, m.name AS menu_item_name
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       WHERE oi.order_id = $1`,
      [id]
    );
    order.items = items.rows;
    return order;
  },

  async updateStatus(id, status) {
    if (!VALID_STATUS.includes(status)) {
      throw new Error(`Estado invalido. Debe ser: ${VALID_STATUS.join(', ')}`);
    }
    const result = await query(
      `UPDATE orders
         SET status = $1,
             updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(
      'DELETE FROM orders WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }
};

module.exports = Order;
