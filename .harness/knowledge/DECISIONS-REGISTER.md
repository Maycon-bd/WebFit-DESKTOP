# Registro de decisões

Catálogo navegável e ledger do harness. O registro canônico de produto/processo continua em `docs/project/decision-log.md`; ADRs detalham decisões arquiteturais. Este arquivo não cria uma fonte concorrente.

## Estados vigentes

- `ACCEPTED`: validada pelo responsável.
- `AGENT-PROVISIONAL`: selecionada pelo agente; validação humana pendente.
- `NEEDS-HUMAN-DECISION`: sem base suficiente, alternativas equilibradas ou condição ASK-FIRST.
- `REJECTED`: rejeitada explicitamente.
- `SUPERSEDED`: substituída por decisão posterior vinculada.

Não representar `AGENT-PROVISIONAL` como aprovação humana. Aplicar `.harness/AUTONOMY-POLICY.md`.

## Accepted

- DEC-001 a DEC-002: novo repositório e pausa do WebFit Web.
- DEC-003 a DEC-006: Tauri 2, React/TypeScript/Vite, SQLite e Rust, aceitos somente para o spike do ADR-0001.
- DEC-007 a DEC-010: curadoria documental, requisitos rastreáveis, gates e Git Flow.
- DEC-013 a DEC-021: MVP Saúde, papéis, primeiro incremento, backup e prescrição/cardápio.
- DEC-022 a DEC-027: regras clínicas, rascunho automático, auditoria e planejamento de arquivos.
- DEC-028 a DEC-037: consulta de auditoria, filtros, ordenação, paginação, período, catálogos, entidade, detalhe, meta-auditoria e estados.
- DEC-038: adotar `AUTONOMOUS DECISION WITH HUMAN VALIDATION` no harness.

## Agent-provisional ledger

Nenhuma decisão `AGENT-PROVISIONAL` foi criada por esta alteração. A política foi determinada diretamente pelo responsável e registrada como `ACCEPTED`.

Cada futura decisão autônoma deve usar:

- ID;
- título;
- status `AGENT-PROVISIONAL`;
- categoria;
- problema;
- alternativas consideradas;
- alternativa escolhida;
- justificativa;
- evidências;
- requisitos relacionados;
- decisões relacionadas;
- confiança `ALTA`, `MÉDIA` ou `BAIXA`;
- impacto `BAIXO`, `MÉDIO` ou `ALTO`;
- reversibilidade `FÁCIL`, `MODERADA` ou `DIFÍCIL`;
- risco;
- consequências;
- validação humana `PENDENTE`.

Ao validar, rejeitar ou substituir, atualizar o estado, autoridade, data, motivo quando disponível e vínculo sucessor, sem apagar o registro anterior.

## Needs-human-decision / abertas

- Proteção local, chaves e backup.
- Representação técnica de atores sem usuário autenticado, como sistema e tentativa de login desconhecida.
- Retenção clínica, backup externo, documentos e migração.

Cada item aberto deve ser avaliado pela matriz antes de interromper o usuário. Permanecerá `NEEDS-HUMAN-DECISION` quando for ASK-FIRST ou quando faltar evidência essencial.