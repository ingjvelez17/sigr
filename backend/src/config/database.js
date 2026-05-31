const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'sigr_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('[DB] Error inesperado en el cliente:', err);
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    console.log(`[DB] Conexion OK - ${result.rows[0].now}`);
    return true;
  } catch (err) {
    console.error('[DB] Error al conectar:', err.message);
    return false;
  }
}

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB] Query (${duration}ms): ${text.substring(0, 80)}`);
  }
  return result;
}

module.exports = { pool, query, testConnection };
