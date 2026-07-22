const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const pastaDoProjeto = path.resolve(__dirname, '../..');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.sendFile(path.join(pastaDoProjeto, 'index.html')));
app.get(['/style.css', '/script.js'], (req, res) => {
  res.sendFile(path.join(pastaDoProjeto, path.basename(req.path)));
});
app.get('/api', (req, res) => res.json({
  projeto: 'PitecoFlow',
  situacao: 'API funcionando',
  rotas: {
    saude: 'GET /api/saude',
    listar_maquinas: 'GET /api/maquinas',
    consultar_maquina: 'GET /api/maquinas/:id',
    cadastrar_maquina: 'POST /api/maquinas',
    atualizar_maquina: 'PUT /api/maquinas/:id',
    excluir_maquina: 'DELETE /api/maquinas/:id',
    listar_producoes: 'GET /api/producoes',
    cadastrar_producao: 'POST /api/producoes',
  },
}));
app.get('/api/saude', (req, res) => res.json({ situacao: 'funcionando' }));
app.use('/api/maquinas', require('./routes/maquinas'));
app.use('/api/producoes', require('./routes/producoes'));
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
