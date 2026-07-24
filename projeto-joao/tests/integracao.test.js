const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const maquinas = require('../backend/src/controllers/maquinasController');
const producoes = require('../backend/src/controllers/producoesController');
const ocorrencias = require('../backend/src/controllers/ocorrenciasController');
const app = require('../backend/src/app');

test('valida uma máquina correta e rejeita campos inválidos', () => {
  assert.deepEqual(maquinas.validar({ nome:'CNC', setor:'Usinagem', tipo:'Torno', status:'Em operação', consumo_energia:10, temperatura:30 }), []);
  assert.ok(maquinas.validar({}).length >= 4);
});
test('produção exige meta positiva, data e máquina', () => {
  assert.deepEqual(producoes.validar({ produto:'Peça', quantidade_produzida:8, quantidade_esperada:10, maquina_id:1, data:'2026-07-24' }), []);
  assert.ok(producoes.validar({ produto:'', quantidade_produzida:-1, quantidade_esperada:0 }).length >= 4);
});
test('ocorrência SST exige risco válido e medida preventiva', () => {
  const correta = { tipo:'Quase acidente', local:'Linha A', descricao:'Teste', nivel_risco:'Alto', data:'2026-07-24', medida_preventiva:'Isolar área' };
  assert.deepEqual(ocorrencias.validar(correta), []);
  assert.ok(ocorrencias.validar({ ...correta, nivel_risco:'Extremo', medida_preventiva:'' }).length === 2);
});
test('front-end contém os três módulos integrados', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  assert.match(html, /data-machine-table/); assert.match(html, /production-form/); assert.match(html, /occurrence-form/);
});
test('endpoint de saúde responde sem acessar o banco', async t => {
  const server = app.listen(0); t.after(() => server.close());
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/saude`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).situacao, 'funcionando');
});
