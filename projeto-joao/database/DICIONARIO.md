# Dicionário de dados

| Tabela | Campos | Regras principais |
|---|---|---|
| maquinas | id, nome, setor, tipo, status, consumo_energia, temperatura | ID automático; campos textuais obrigatórios; status controlado; consumo não negativo |
| producoes | id, produto, quantidade_produzida, quantidade_esperada, data, maquina_id | Quantidades válidas; `maquina_id` referencia máquinas |
| sustentabilidade | id, consumo_energia, consumo_agua, residuos, quantidade_reciclada, data | Valores não negativos; reciclado não pode superar resíduos |
| ocorrencias | id, tipo, descricao, nivel_risco, local, data, medida_preventiva | Risco controlado; descrição e medida preventiva obrigatórias |

As colunas de energia usam kWh, água usa litros, resíduos usam kg e temperatura usa °C. `criado_em` e `atualizado_em` registram auditoria quando aplicável.
