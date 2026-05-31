const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const VALID_ROLES = ['cliente', 'mesero', 'admin'];
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

const User = {
  async create({ name, email, password, role = 'cliente', phone = null }) {
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Rol invalido. Debe ser uno de: ${VALID_ROLES.join(', ')}`);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, phone, created_at`,
      [name, email.toLowerCase(), passwordHash, role, phone]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query(
      `SELECT id, name, email, role, phone, created_at
       FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findAll() {
    const result = await query(
      `SELECT id, name, email, role, phone, created_at
       FROM users ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async verifyPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  },

  VALID_ROLES
};

module.exports = User;
