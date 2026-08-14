# Modelo de dados

**Status:** não projetado. Não existe schema SQLite aprovado.

## Convenções candidatas a validar

As fontes propõem UUIDs, instantes em UTC, valores monetários em centavos, foreign keys ativas, migrações transacionais e arquivos fora do banco. Essas escolhas precisam ser testadas e registradas antes de uso em produção.

## Lacunas

- Modelo conceitual derivado de requisitos aprovados.
- Entidades, relacionamentos, cardinalidades e invariantes.
- Política de identidade, nulabilidade, datas civis e instantes.
- Retenção, arquivamento, restauração e eliminação.
- Estratégia de migração, integridade, backup e rollback.
- Volume e limites de capacidade esperados.

Migrações PostgreSQL legadas são apenas fonte de descoberta; não são schema do Desktop.
