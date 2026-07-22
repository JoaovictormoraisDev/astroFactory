const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const app = require('./app');
const pool = require('./config/database');
const port = Number(process.env.PORT) || 3002;

async function iniciar() {
  if (!process.env.DB_NAME) {
    console.error('Defina as variáveis DB_* no arquivo .env.');
    process.exit(1);
  }
  try {
    await pool.query('SELECT 1');
    const servidor = app.listen(port, () => {
      console.log(`Site AstroFactory em http://localhost:${port}`);
      console.log(`API AstroFactory em http://localhost:${port}/api`);
    });
    servidor.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`A porta ${port} já está em uso. Encerre o servidor anterior com Ctrl+C e tente novamente.`);
        return;
      }
      console.error('Erro ao iniciar o servidor:', error.message);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao MySQL:', error.message);
    process.exit(1);
  }
}
iniciar();
