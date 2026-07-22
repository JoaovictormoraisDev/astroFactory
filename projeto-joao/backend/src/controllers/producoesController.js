const pool = require('../config/database');

async function listar(req, res, next) {
  try {
    const [rows] = await pool.query(`SELECT p.*, m.nome AS maquina_nome,
      ROUND(p.quantidade_produzida / p.quantidade_esperada * 100, 2) AS produtividade
      FROM producoes p JOIN maquinas m ON m.id=p.maquina_id ORDER BY p.data DESC, p.id DESC`);
    res.json(rows);
  } catch (error) { next(error); }
}

async function criar(req, res, next) {
  const { produto, quantidade_produzida, quantidade_esperada, data, maquina_id } = req.body;
  const erros = [];
  if (!produto?.trim()) erros.push('produto é obrigatório');
  if (!Number.isInteger(Number(quantidade_produzida)) || Number(quantidade_produzida) < 0) erros.push('quantidade_produzida é inválida');
  if (!Number.isInteger(Number(quantidade_esperada)) || Number(quantidade_esperada) <= 0) erros.push('quantidade_esperada é inválida');
  if (!Number.isInteger(Number(maquina_id)) || Number(maquina_id) <= 0) erros.push('maquina_id é inválido');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) erros.push('data deve usar AAAA-MM-DD');
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  try {
    const [result] = await pool.execute(
      `INSERT INTO producoes (produto,quantidade_produzida,quantidade_esperada,data,maquina_id) VALUES (?,?,?,?,?)`,
      [produto.trim(), Number(quantidade_produzida), Number(quantidade_esperada), data, Number(maquina_id)]
    );
    const [rows] = await pool.execute('SELECT * FROM producoes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ erro: 'Máquina informada não existe' });
    next(error);
  }
}

module.exports = { listar, criar };
