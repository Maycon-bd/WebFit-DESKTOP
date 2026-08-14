# Estratégia de testes

**Status:** proposta inicial; depende de requisitos e arquitetura validados.

## Níveis candidatos

- Unidade para regras, validações e componentes.
- Integração para SQLite, migrações, transações, autorização e arquivos.
- Contrato para comandos frontend/backend.
- Aceite para jornadas aprovadas.
- Recuperação para backup, corrupção, falha de escrita e restauração.
- Instalação para instalação limpa, atualização e preservação de dados.
- Acessibilidade e usabilidade para fluxos críticos.

## Princípios

Testes usam dados sintéticos, são ligados a IDs e produzem evidências reproduzíveis. A pirâmide, ferramentas, ambientes, metas de cobertura e critérios de bloqueio ainda serão definidos.
