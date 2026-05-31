const { query } = require('../config/database');

const VALID_STATUS = ['confirmada', 'cancelada', 'completada', 'no_show'];

const Reservation = {
  VALID_STATUS,

  async create({ customerId, reservationDate, reservationTime, tableNumber, partySize, notes = null }) {
    if (partySize <= 0) throw new Error('La cantidad de personas debe ser mayor a 0');

    const conflict = await query(
      `SELECT id FROM reservations
       WHERE table_number = $1
         AND reservation_date = $2
         AND reservation_time = $3
         AND status = 'confirmada'`,
      [tableNumber, reservationDate, reservationTime]
    );
    if (conflict.rows.length) {
      throw new Error('La mesa ya esta reservada en ese horario');
    }

    const result = await query(
      `INSERT INTO reservations
         (customer_id, reservation_date, reservation_time, table_number, party_size, status, notes)
       VALUES ($1, $2, $3, $4, $5, 'confirmada', $6)
       RETURNING *`,
      [customerId, reservationDate, reservationTime, tableNumber, partySize, notes]
    );
    return result.rows[0];
  },

  async findAll({ status, date } = {}) {
    const params = [];
    const conditions = [];
    if (status) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }
    if (date) {
      params.push(date);
      conditions.push(`r.reservation_date = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT r.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
       FROM reservations r
       LEFT JOIN users u ON u.id = r.customer_id
       ${where}
       ORDER BY r.reservation_date ASC, r.reservation_time ASC`,
      params
    );
    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `SELECT r.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
       FROM reservations r
       LEFT JOIN users u ON u.id = r.customer_id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findByCustomer(customerId) {
    const result = await query(
      `SELECT * FROM reservations
       WHERE customer_id = $1
       ORDER BY reservation_date DESC`,
      [customerId]
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    if (!VALID_STATUS.includes(status)) {
      throw new Error(`Estado invalido. Debe ser: ${VALID_STATUS.join(', ')}`);
    }
    const result = await query(
      `UPDATE reservations
         SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(
      'DELETE FROM reservations WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }
};

module.exports = Reservation;
