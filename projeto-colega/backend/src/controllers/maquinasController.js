const pool = require('../config/database');
const statuses = ['Em operação', 'Em manutenção', 'Parada', 'Desativada'];

function validar(body) {
  const erros = [];
  if (!body.nome?.trim()) erros.push('nome é obrigatório');
  if (!body.setor?.trim()) erros.push('setor é obrigatório');
  if (!body.tipo?.trim()) erros.push('tipo é obrigatório');
  if (!statuses.includes(body.status)) erros.push('status é inválido');
  if (body.consumo_energia === '' || !Number.isFinite(Number(body.consumo_energia)) || Number(body.consumo_energia) < 0) erros.push('consumo_energia é inválido');
  if (![undefined, null, ''].includes(body.temperatura) && !Number.isFinite(Number(body.temperatura))) erros.push('temperatura é inválida');
  return erros;
}

async function listar(req, res, next) {
  try { const [rows] = await pool.query('SELECT * FROM maquinas ORDER BY id'); res.json(rows); }
  catch (error) { next(error); }
}

async function buscarPorId(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM maquinas WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ erro: 'Máquina não encontrada' });
    res.json(rows[0]);
  } catch (error) { next(error); }
}

async function criar(req, res, next) {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO maquinas (nome,setor,tipo,status,consumo_energia,temperatura)
       VALUES (?,?,?,?,?,?)`,
      [nome.trim(), setor.trim(), tipo.trim(), status, Number(consumo_energia), temperatura === '' ? null : temperatura]
    );
    const [rows] = await pool.execute('SELECT * FROM maquinas WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
}

async function atualizar(req, res, next) {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE maquinas SET nome=?,setor=?,tipo=?,status=?,consumo_energia=?,
       temperatura=? WHERE id=?`,
      [nome.trim(), setor.trim(), tipo.trim(), status, Number(consumo_energia), temperatura === '' ? null : temperatura, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Máquina não encontrada' });
    const [rows] = await pool.execute('SELECT * FROM maquinas WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
}

async function excluir(req, res, next) {
  try {
    const [result] = await pool.execute('DELETE FROM maquinas WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Máquina não encontrada' });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ erro: 'A máquina possui produções vinculadas' });
    next(error);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
