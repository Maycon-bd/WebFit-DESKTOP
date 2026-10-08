# Tasks: WEBFIT-9

**Input**: [spec.md](spec.md), [plan.md](plan.md), research/data-model/contracts.
**Authority**: implementação autorizada por Maycon em 2026-10-08; Git permanece humano. Tests obrigatórios pela spec.

## Phase 1: Setup

- [x] T001 Conferir branch e alterações preexistentes e registrar autorização em docs/project/decision-log.md e specs/006-webfit-9-faixa-atualizacao/spec.md.

## Phase 2: Foundation

- [x] T002 Vincular RF-UPD-001 e TA-UPD-UI-003..006 à demanda em docs/requirements/{functional-requirements,acceptance-criteria,traceability}.md.

## Phase 3: US1 — detecção durante uso

Teste independente: relógio/eventos fictícios após login sem versão; próxima tentativa detecta publicação.

- [x] T003 [US1] Testar TTL, retorno/cooldown, offline/retry, StrictMode, sessão, cleanup e pausa em tests/unit/update-check.test.ts (FR-001/002, SC-001/003).
- [x] T004 [US1] Implementar checker por sessão e subscription com cleanup/pausa em src/update-check.ts; token somente memória e cooldown um minuto (FR-001/002).
- [x] T005 [US1] Integrar agendamento silencioso e pausa durante instalação em src/UpdatePanel.tsx (FR-001/002/004).

## Phase 4: US2 — faixa compacta global

Teste independente: fixture disponível, lista/formulário, teclado e zoom 200%; nenhuma perda de campos/foco.

- [x] T006 [US2] Compactar copy/detalhes, adiamento por versão, motivo de bloqueio e progresso em src/UpdatePanel.tsx (FR-003/004/005).
- [x] T007 [US2] Mover faixa acima de toda a shell preservando montagem de conteúdo em src/App.tsx e ajustar layout/scroll/quebra em src/style.css (FR-003/004, SC-002/003).

## Phase 5: Validation and Evidence

- [x] T008 Executar checks e inspeção visual proporcional, Converge e Review independente; registrar evidências/limites em .harness/evidence/webfit-9/.
- [x] T009 Atualizar docs/project/status.md com data/branch/commit/sincronização/próxima ação/checklist, preservando checkpoints de outras demandas; sincronizar somente WEBFIT-9 no Plane sem Done automático.

Limite de T008: inspeção visual tentada, browser indisponível; estrutura/copy/CSS revisados estaticamente, sem PASS de layout/zoom/teclado Windows. Ensaio permanece no Gate e em quickstart/evidence, não é requisito implementado omitido nem aceite inferido.

## Dependencies and Parallelism

T001 -> T002 -> T003 -> T004 -> T005 -> T006/T007 -> T008 -> T009. T006/T007 compartilham UI, executar sequencialmente para preservar edições concorrentes. Checks frontend/backend independentes podem executar em paralelo. MVP: US1; entrega autorizada inclui US1 e US2.
