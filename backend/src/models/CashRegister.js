const { query } = require('../config/database');

const CashRegister = {
  async open({ userId, openingAmount, notes = null }) {
    const opened = await query(
      `SELECT id FROM cash_registers WHERE status = 'abierta' LIMIT 1`
    );
    if (opened.rows.length) {
      throw new Error('Ya existe una caja abierta. Debe cerrarse antes de abrir otra.');
    }

    const result = await query(
      `INSERT INTO cash_registers
         (opened_by, opening_amount, opening_time, status, notes)
       VALUES ($1, $2, NOW(), 'abierta', $3)
       RETURNING *`,
      [userId, openingAmount, notes]
    );
    return result.rows[0];
  },

  async close({ id, userId, closingAmount, notes = null }) {
    const reg = await query('SELECT * FROM cash_registers WHERE id = $1', [id]);
    if (!reg.rows[0]) throw new Error('Caja no encontrada');
    if (reg.rows[0].status !== 'abierta') throw new Error('La caja ya esta cerrada');

    const sales = await query(
      `SELECT COALESCE(SUM(total), 0)::numeric AS total_sales,
              COUNT(*)::int AS total_orders
         FROM orders
        WHERE status = 'entregado'
          AND created_at >= $1`,
      [reg.rows[0].opening_time]
    );

    const totalSales = parseFloat(sales.rows[0].total_sales);
    const totalOrders = sales.rows[0].total_orders;

    const result = await query(
      `UPDATE cash_registers
          SET closed_by = $1,
              closing_amount = $2,
              closing_time = NOW(),
              total_sales = $3,
              total_orders = $4,
              status = 'cerrada',
              notes = COALESCE($5, notes)
        WHERE id = $6
        RETURNING *`,
      [userId, closingAmount, totalSales, totalOrders, notes, id]
    );
    return result.rows[0];
  },

  async findCurrent() {
    const result = await query(
      `SELECT * FROM cash_registers WHERE status = 'abierta' LIMIT 1`
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query('SELECT * FROM cash_registers WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findAll() {
    const result = await query(
      `SELECT * FROM cash_registers ORDER BY opening_time DESC`
    );
    return result.rows;
  }
};

module.exports = CashRegister;
