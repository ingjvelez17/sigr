const { query } = require('../config/database');

const MenuItem = {
  async create({ name, description = null, price, categoryId, available = true, imageUrl = null }) {
    if (price < 0) throw new Error('El precio no puede ser negativo');
    const result = await query(
      `INSERT INTO menu_items (name, description, price, category_id, available, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, categoryId, available, imageUrl]
    );
    return result.rows[0];
  },

  async findAll({ available, categoryId } = {}) {
    const conditions = [];
    const params = [];

    if (available !== undefined) {
      params.push(available);
      conditions.push(`m.available = $${params.length}`);
    }
    if (categoryId) {
      params.push(categoryId);
      conditions.push(`m.category_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON c.id = m.category_id
       ${where}
       ORDER BY m.name ASC`,
      params
    );
    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON c.id = m.category_id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id, { name, description, price, categoryId, available, imageUrl }) {
    const result = await query(
      `UPDATE menu_items
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             category_id = COALESCE($4, category_id),
             available = COALESCE($5, available),
             image_url = COALESCE($6, image_url),
             updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, price, categoryId, available, imageUrl, id]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }
};

module.exports = MenuItem;
