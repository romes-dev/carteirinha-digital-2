// server/server.js
require('dotenv').config();

const express = require('express');
const path    = require('path');
const db      = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Serve EVERYTHING in the real public/ directory:
app.use(express.static(path.join(__dirname, '../public')));

// 2) Then serve your SPA files:
app.use(express.static(path.join(__dirname, '../src')));

// 3) Your API:
app.get('/api/student/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT nome, curso, cpf, photo_url FROM students WHERE cpf = $1',
      [cpf]
    );
    if (!rows.length) return res.status(404).json({ error: 'Estudante não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao consultar DB:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 4) Fallback to index.html for all non-/api routes:
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
