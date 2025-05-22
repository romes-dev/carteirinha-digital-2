// server/db.js
const { Pool } = require('pg');

const pool = new Pool({

  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port:     process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// DEBUG: imprime database e schema ao conectar
pool
  .query(`SELECT current_database() AS db, current_schema() AS schema;`)
  .then(res => console.log('🔍 Conectado em:', res.rows[0]))
  .catch(err => console.error('‼️ Erro debug DB:', err));

pool.on('connect', client => {
  // se quiser, setar explicitamente o schema
  client.query('SET search_path TO public');
});

module.exports = pool;
