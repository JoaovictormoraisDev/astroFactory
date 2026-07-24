# Dicionário de dados

| Tabela | Campo | Tipo | Regra |
|---|---|---|---|
| maquinas | id | integer | Chave primária automática |
| maquinas | nome, setor, tipo | varchar | Campos obrigatórios |
| maquinas | status | varchar(20) | Operação, manutenção, parada ou desativada |
| maquinas | consumo_energia | numeric(10,2) | kWh, não negativo |
| maquinas | temperatura | numeric(6,2) | °C, opcional |
| producoes | id | integer | Chave primária automática |
| producoes | produto | varchar(120) | Obrigatório |
| producoes | quantidade_produzida | integer | Não negativa |
| producoes | quantidade_esperada | integer | Maior que zero |
| producoes | data | date | Data da produção |
| producoes | maquina_id | integer | FK para maquinas; exclusão restrita |
| sustentabilidade | consumo_energia, consumo_agua | numeric | Valores não negativos |
| sustentabilidade | residuos | numeric | Total de resíduos em kg |
| sustentabilidade | quantidade_reciclada | numeric | Entre zero e o total de resíduos |
| sustentabilidade | data | date | Data do registro |
| ocorrencias | tipo, local | varchar | Obrigatórios |
| ocorrencias | descricao | text | Obrigatório |
| ocorrencias | nivel_risco | varchar | Baixo, Médio, Alto ou Crítico |
| ocorrencias | data | date | Data da ocorrência |
| ocorrencias | medida_preventiva | text | Obrigatória |
