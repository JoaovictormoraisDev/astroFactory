# PitecoFlow

Projeto de gestão industrial. Esta versão contém a modelagem MySQL do encontro 6 e a API REST Node.js/Express do encontro 7.

## Execução

Pré-requisitos: Node.js 18+ e MySQL 8+.

1. Execute `mysql -u root -p < database/schema.sql`.
2. Opcional: execute `mysql -u root -p pitecoflow < database/seed.sql`.
3. Copie `.env.example` para `.env` e ajuste usuário e senha do MySQL.
4. Execute `npm install` e `node server.js`.

Também é possível usar `npm start` ou `npm run dev`.

A API fica em `http://localhost:3003/api`. A integração da interface pertence ao encontro 8.
O site completo fica disponível em `http://localhost:3003`.

## Rotas

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/saude` | Estado da API |
| GET | `/api/maquinas` | Listar máquinas |
| GET | `/api/maquinas/:id` | Consultar máquina |
| POST | `/api/maquinas` | Cadastrar máquina |
| PUT | `/api/maquinas/:id` | Atualizar máquina |
| DELETE | `/api/maquinas/:id` | Excluir máquina |
| GET | `/api/producoes` | Listar produções e produtividade |
| POST | `/api/producoes` | Cadastrar produção |

Exemplo para cadastrar uma máquina:

```json
{
  "nome": "Torno CNC 04",
  "setor": "Usinagem",
  "tipo": "Torno CNC",
  "status": "Em operação",
  "consumo_energia": 32.5,
  "temperatura": 40
}
```

Documentação: [DER](database/DER.md), [dicionário](database/DICIONARIO.md) e [script SQL](database/schema.sql).
