# Projeto João — SSR AstroFactory

Aplicação de monitoramento industrial organizada como entrega dos encontros 6, 7 e 8.

## Estrutura

- `index.html`, `style.css`, `script.js` e temas: interface do usuário
- `database/`: DER, dicionário, criação das tabelas e dados de exemplo
- `backend/src/config`: conexão com o MySQL
- `backend/src/controllers`: regras e operações no banco de dados
- `backend/src/routes`: rotas da API REST

## Como executar

1. Instale Node.js 18+ e MySQL 8+.
2. Crie o banco e as tabelas: `mysql -u root -p < database/schema.sql`.
3. Opcional: carregue exemplos com `mysql -u root -p astrofactory_joao < database/seed.sql`.
4. Copie `.env.example` para `.env` e ajuste usuário e senha do MySQL.
5. Execute `npm install` e `npm start`.

Também é possível usar `npm start` ou `npm run dev`.

## API

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/saude` | Verificar a API |
| GET | `/api/maquinas` | Listar máquinas |
| GET | `/api/maquinas/:id` | Consultar máquina |
| POST | `/api/maquinas` | Cadastrar máquina |
| PUT | `/api/maquinas/:id` | Atualizar máquina |
| DELETE | `/api/maquinas/:id` | Excluir máquina |
| GET | `/api/producoes` | Listar produções com produtividade |
| GET | `/api/producoes/:id` | Consultar produção |
| POST | `/api/producoes` | Cadastrar produção |
| PUT | `/api/producoes/:id` | Atualizar produção |
| DELETE | `/api/producoes/:id` | Excluir produção |

O Front-End consome a API, lista dados persistidos e cadastra máquinas com feedback de carregamento, sucesso e erro.

A API utiliza `http://localhost:3002/api` para não conflitar com servidores de arquivos do VS Code.
O site completo fica disponível em `http://localhost:3002`.
