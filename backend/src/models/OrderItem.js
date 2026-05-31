const { query } = require('../config/database');

const OrderItem = {
  async findByOrderId(orderId) {
    const result = await query(
      `SELECT oi.*, m.name AS menu_item_name, m.description AS menu_item_description
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       WHERE oi.order_id = $1
       ORDER BY oi.id ASC`,
      [orderId]
    );
    return result.rows;
  },

  async findTopSelling(limit = 10, from = null, to = null) {
    const params = [];
    let dateFilter = '';
    if (from && to) {
      params.push(from, to);
      dateFilter = `AND o.created_at BETWEEN $${params.length - 1} AND $${params.length}`;
    }
    params.push(limit);
    const result = await query(
      `SELECT m.id, m.name, SUM(oi.quantity)::int AS total_sold, SUM(oi.subtotal)::numeric AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN menu_items m ON m.id = oi.menu_item_id
       WHERE o.status = 'entregado' ${dateFilter}
       GROUP BY m.id, m.name
       ORDER BY total_sold DESC
       LIMIT $${params.length}`,
      params
    );
    return result.rows;
  }
};

module.exports = OrderItem;
