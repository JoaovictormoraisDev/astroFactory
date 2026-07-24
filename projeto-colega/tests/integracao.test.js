const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const maquinas = require('../backend/src/controllers/maquinasController');
const producoes = require('../backend/src/controllers/producoesController');
const ocorrencias = require('../backend/src/controllers/ocorrenciasController');
const app = require('../backend/src/app');
test('máquina válida e campos obrigatórios', () => {
  assert.deepEqual(maquinas.validar({ nome:'CNC', setor:'Usinagem', tipo:'Torno', status:'Em operação', consumo_energia:10 }), []);
  assert.ok(maquinas.validar({}).length >= 4);
});
test('produção valida quantidades, data e máquina', () => {
  assert.deepEqual(producoes.validar({ produto:'Peça', quantidade_produzida:8, quantidade_esperada:10, maquina_id:1, data:'2026-07-24' }), []);
  assert.ok(producoes.validar({ quantidade_produzida:-1, quantidade_esperada:0 }).length >= 4);
});
test('SST valida risco e prevenção', () => {
  const dado = { tipo:'Incidente', local:'Linha B', descricao:'Teste', nivel_risco:'Médio', data:'2026-07-24', medida_preventiva:'Treinamento' };
  assert.deepEqual(ocorrencias.validar(dado), []);
  assert.ok(ocorrencias.validar({}).length >= 6);
});
test('interface contém máquinas, produção e SST', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  assert.match(html, /data-machine-table/); assert.match(html, /production-form/); assert.match(html, /occurrence-form/);
});
test('API informa saúde', async t => {
  const server = app.listen(0); t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/saude`);
  assert.equal(response.status, 200);
});
