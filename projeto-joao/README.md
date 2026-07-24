# SSR AstroFactory

Aplicação Full Stack de monitoramento industrial com Front-End responsivo, API REST Express e MySQL. Contém CRUD de máquinas, produção com produtividade, dashboard dinâmico e ocorrências de SST.

## Execução

Pré-requisitos: Node.js 18+ e MySQL 8+.

1. Crie o banco e as tabelas: `mysql -u root -p < database/schema.sql`.
2. Opcionalmente carregue exemplos: `mysql -u root -p astrofactory_joao < database/seed.sql`.
3. Copie `.env.example` para `.env` e informe a senha.
4. Execute `npm install` e `npm start`.
5. Acesse `http://localhost:3002`.

Execute os testes com `npm test`.

## API

CRUD completo em `/api/maquinas`, `/api/producoes` e `/api/ocorrencias`. O endpoint `/api/saude` verifica a aplicação.

## Documentação

- [Escopo](documentacao/ESCOPO.md)
- [Protótipo e UI/UX](documentacao/PROTOTIPO.md)
- [DER](database/DER.md) e [dicionário](database/DICIONARIO.md)
- [Checklist do Encontro 9](documentacao/CHECKLIST_QUALIDADE.md)
