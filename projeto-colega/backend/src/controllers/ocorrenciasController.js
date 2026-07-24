const pool = require('../config/database');
const riscos = ['Baixo', 'Médio', 'Alto', 'Crítico'];
function validar(body = {}) {
  const erros = [];
  if (!body.tipo?.trim()) erros.push('tipo é obrigatório');
  if (!body.local?.trim()) erros.push('local é obrigatório');
  if (!body.descricao?.trim()) erros.push('descrição é obrigatória');
  if (!riscos.includes(body.nivel_risco)) erros.push('nível de risco é inválido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.data || '')) erros.push('data deve usar AAAA-MM-DD');
  if (!body.medida_preventiva?.trim()) erros.push('medida preventiva é obrigatória');
  return erros;
}
async function listar(req, res, next) {
  try { const [rows] = await pool.query('SELECT * FROM ocorrencias ORDER BY data DESC,id DESC'); res.json(rows); }
  catch (error) { next(error); }
}
async function buscarPorId(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM ocorrencias WHERE id=?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ erro: 'Ocorrência não encontrada' });
    res.json(rows[0]);
  } catch (error) { next(error); }
}
async function salvar(req, res, next, id) {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  const b = req.body;
  const valores = [b.tipo.trim(), b.descricao.trim(), b.nivel_risco, b.local.trim(), b.data, b.medida_preventiva.trim()];
  try {
    if (id) {
      const [result] = await pool.execute('UPDATE ocorrencias SET tipo=?,descricao=?,nivel_risco=?,local=?,data=?,medida_preventiva=? WHERE id=?', [...valores, id]);
      if (!result.affectedRows) return res.status(404).json({ erro: 'Ocorrência não encontrada' });
      const [rows] = await pool.execute('SELECT * FROM ocorrencias WHERE id=?', [id]);
      return res.json(rows[0]);
    }
    const [result] = await pool.execute('INSERT INTO ocorrencias(tipo,descricao,nivel_risco,local,data,medida_preventiva) VALUES(?,?,?,?,?,?)', valores);
    const [rows] = await pool.execute('SELECT * FROM ocorrencias WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
}
const criar = (req, res, next) => salvar(req, res, next);
const atualizar = (req, res, next) => salvar(req, res, next, req.params.id);
async function excluir(req, res, next) {
  try {
    const [result] = await pool.execute('DELETE FROM ocorrencias WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Ocorrência não encontrada' });
    res.status(204).send();
  } catch (error) { next(error); }
}
module.exports = { validar, listar, buscarPorId, criar, atualizar, excluir };
