INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura)
VALUES
  ('Torno CNC 01', 'Usinagem', 'Torno CNC', 'Em operação', 36.50, 41.00),
  ('Robô de Solda 02', 'Montagem', 'Braço robótico', 'Em operação', 25.20, 37.50),
  ('Prensa 03', 'Prensagem', 'Prensa hidráulica', 'Em manutenção', 58.40, 72.00);

INSERT INTO producoes (produto, quantidade_produzida, quantidade_esperada, data, maquina_id)
SELECT 'Peça industrial A', 850, 1000, CURRENT_DATE, id
FROM maquinas WHERE nome = 'Torno CNC 01';

INSERT INTO ocorrencias (tipo, descricao, nivel_risco, local, data, medida_preventiva)
VALUES ('Vazamento de óleo', 'Óleo identificado próximo ao equipamento', 'Alto', 'Prensagem', CURRENT_DATE, 'Isolar o local, conter o vazamento e inspecionar a prensa');
