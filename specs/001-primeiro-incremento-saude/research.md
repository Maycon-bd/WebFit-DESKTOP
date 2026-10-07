# Research: Primeiro incremento de Saúde

**Feature**: 001-primeiro-incremento-saude
**Status**: consolidado para planejamento; decisões técnicas de produção continuam pendentes

## Decision 1 — Manter o MVP local e offline

**Decision**: manter Saúde em um computador por instalação, sem servidor, nuvem ou sincronização.

**Rationale**: corresponde ao escopo aprovado, reduz superfície de exposição de dados sensíveis e resolve o objetivo atual da nutricionista. A necessidade futura de dois computadores pertence à Educação, que está isolada.

**Alternatives considered**: colaboração por rede, backend remoto e sincronização entre instalações. Foram mantidas fora porque ampliam arquitetura, segurança, operação e requisitos sem necessidade do MVP.

## Decision 2 — Validar Tauri/Rust/SQLite somente por spike

**Decision**: usar a composição do ADR-0001 como hipótese de G4, não como arquitetura de produção.

**Rationale**: atende potencialmente ao uso local/offline, mas proteção de banco/chaves, empacotamento, migrações e recuperação ainda não têm evidência.

**Alternatives considered**: outro shell desktop com banco embarcado e backend remoto com banco servidor. A comparação deve ser baseada nos critérios do ADR-0001, não em preferência.

## Decision 3 — Não compartilhar o banco por rede

**Decision**: cada instalação mantém seu próprio armazenamento local; uma futura solução multi-máquina deve usar arquitetura de serviço/sincronização desenhada separadamente.

**Rationale**: pasta compartilhada ou sincronizada não é colaboração segura nem base adequada para SQLite; cria risco de corrupção, conflito e exposição de dados.

**Alternatives considered**: colocar o arquivo SQLite em compartilhamento de rede ou sincronizador de arquivos. Rejeitadas para este MVP.

## Decision 4 — Auditoria determinística e sem conteúdo clínico

**Decision**: usar metadados mínimos, janela UTC semiaberta, ordenação total por instante/ID, páginas de 50 e cursor vinculado à consulta.

**Rationale**: mantém paginação estável sem carregar a trilha inteira e evita armazenar senha, CPF completo, prontuário ou snapshots.

**Open gate**: D-AUTO-001 e D-AUTO-002 ainda são AGENT-PROVISIONAL e precisam de validação humana antes do modelo de dados definitivo.

## Decision 5 — Backup por snapshot validado

**Decision**: backup automático no primeiro uso diário e manual, com pacote consistente, manifesto, checksums, retenção de 60 dias, validação antes da rotação e restauração com confirmação explícita.

**Rationale**: satisfaz RPO de 24 horas e RTO até o próximo dia útil sem copiar diretamente o banco ativo.

**Open gate**: proteção criptográfica, destino definitivo no Windows, mídia externa e ensaio operacional serão resolvidos no spike/procedimento.

## Decision 6 — Dados fictícios e gates STRICT

**Decision**: nenhuma implementação ou teste usa dados reais; autenticação, schema, migrações, dependências, proteção e backup exigem gate sensível.

**Rationale**: dados de saúde são sensíveis e o repositório ainda não tem aplicação executável nem evidência operacional.

## Research conclusion

O escopo está suficientemente definido para Plan e Tasks, mas não para implementação. O próximo bloqueio correto é G4: spike arquitetural e validação humana das decisões pendentes.
## Atualização de autoridade — 2026-10-06

As hipóteses de G3 acima são registros históricos. G4/ADR-0001 foram aceitos por DEC-042 em 2026-09-21; SQLCipher Community/DPAPI, pacote portátil, credencial offline e NSIS são a direção aprovada. DEC-045 autoriza a implementação e alterações sensíveis previstas em ambiente de teste; DEC-044 adia updater. Validação operacional no Windows 10 alvo, revisão independente e G6/G7 permanecem pendentes. Não existe novo bloqueio de autorização para executar o trabalho coberto pela DEC-045.
