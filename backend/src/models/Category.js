const { query } = require('../config/database');

const Category = {
  async create({ name, description = null }) {
    const result = await query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async update(id, { name, description }) {
    const result = await query(
      `UPDATE categories SET name = COALESCE($1, name),
                            description = COALESCE($2, description),
                            updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name, description, id]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }
};

module.exports = Category;
