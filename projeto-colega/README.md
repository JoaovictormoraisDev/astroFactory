# PitecoFlow

Aplicação Full Stack industrial com interface responsiva, API Node.js/Express e MySQL. Integra máquinas, produção, indicadores e saúde e segurança do trabalho.

## Execução

1. Instale Node.js 18+ e MySQL 8+.
2. Execute `mysql -u root -p < database/schema.sql`.
3. Opcional: `mysql -u root -p pitecoflow < database/seed.sql`.
4. Copie `.env.example` para `.env`, ajuste a senha e rode `npm install`.
5. Use `npm start` e acesse `http://localhost:3003`.

Testes: `npm test`.

## API e documentação

Há CRUD REST em `/api/maquinas`, `/api/producoes` e `/api/ocorrencias`, além de `/api/saude`.

- [Escopo](documentacao/ESCOPO.md)
- [Protótipo](documentacao/PROTOTIPO.md)
- [DER](database/DER.md) e [dicionário](database/DICIONARIO.md)
- [Checklist de qualidade](documentacao/CHECKLIST_QUALIDADE.md)
