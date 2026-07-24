# Escopo — SSR AstroFactory

## Problema e objetivo
Centralizar dados industriais antes dispersos em planilhas, permitindo acompanhar máquinas, produção, produtividade e riscos de SST em uma interface responsiva.

## Público
Supervisores, operadores, manutenção e profissionais de segurança da indústria fictícia.

## Funcionalidades
- CRUD completo de máquinas;
- cadastro, consulta e exclusão de produções;
- dashboard calculado com dados da API;
- CRUD de ocorrências de SST;
- validação no navegador, na API e no PostgreSQL.

## Arquitetura e tecnologias
Interface HTML/CSS/JavaScript responsiva → API REST Node.js/Express → MySQL. Git é usado para versionamento e `node:test` para testes automatizados.
