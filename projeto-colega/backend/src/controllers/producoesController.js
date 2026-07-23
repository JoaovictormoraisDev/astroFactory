const pool = require('../config/database');

function validar(body) {
  const erros = [];
  if (!body.produto?.trim()) erros.push('produto é obrigatório');
  if (!Number.isInteger(Number(body.quantidade_produzida)) || Number(body.quantidade_produzida) < 0) erros.push('quantidade_produzida é inválida');
  if (!Number.isInteger(Number(body.quantidade_esperada)) || Number(body.quantidade_esperada) <= 0) erros.push('quantidade_esperada é inválida');
  if (!Number.isInteger(Number(body.maquina_id)) || Number(body.maquina_id) <= 0) erros.push('maquina_id é inválido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.data || '')) erros.push('data deve usar AAAA-MM-DD');
  return erros;
}

const selectBase = `SELECT p.*, m.nome AS maquina_nome,
  ROUND(p.quantidade_produzida / p.quantidade_esperada * 100, 2) AS produtividade
  FROM producoes p JOIN maquinas m ON m.id=p.maquina_id`;

async function listar(req, res, next) {
  try { const [rows] = await pool.query(`${selectBase} ORDER BY p.data DESC, p.id DESC`); res.json(rows); }
  catch (error) { next(error); }
}

async function buscarPorId(req, res, next) {
  try {
    const [rows] = await pool.execute(`${selectBase} WHERE p.id=?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ erro: 'Produção não encontrada' });
    res.json(rows[0]);
  } catch (error) { next(error); }
}

async function criar(req, res, next) {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  const { produto, quantidade_produzida, quantidade_esperada, data, maquina_id } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO producoes (produto,quantidade_produzida,quantidade_esperada,data,maquina_id)
       VALUES (?,?,?,?,?)`,
      [produto.trim(), Number(quantidade_produzida), Number(quantidade_esperada), data, Number(maquina_id)]
    );
    const [rows] = await pool.execute('SELECT * FROM producoes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ erro: 'Máquina informada não existe' });
    next(error);
  }
}

async function atualizar(req, res, next) {
  const erros = validar(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  const { produto, quantidade_produzida, quantidade_esperada, data, maquina_id } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE producoes SET produto=?,quantidade_produzida=?,quantidade_esperada=?,data=?,maquina_id=?
       WHERE id=?`,
      [produto.trim(), Number(quantidade_produzida), Number(quantidade_esperada), data, Number(maquina_id), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Produção não encontrada' });
    const [rows] = await pool.execute('SELECT * FROM producoes WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ erro: 'Máquina informada não existe' });
    next(error);
  }
}

async function excluir(req, res, next) {
  try {
    const [result] = await pool.execute('DELETE FROM producoes WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Produção não encontrada' });
    res.status(204).send();
  } catch (error) { next(error); }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
