INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura)
VALUES
  ('CNC Orion 01', 'Usinagem', 'Torno CNC', 'Em operação', 42.50, 42.00),
  ('Robô Atlas 08', 'Montagem', 'Braço robótico', 'Em operação', 28.10, 38.00),
  ('Prensa Titan 02', 'Prensagem', 'Prensa hidráulica', 'Em manutenção', 65.80, 76.00);

INSERT INTO producoes (produto, quantidade_produzida, quantidade_esperada, data, maquina_id)
SELECT 'Componente orbital', 850, 1000, CURRENT_DATE, id
FROM maquinas WHERE nome = 'CNC Orion 01';

