# Tasks: Informações globais — WEBFIT-6

**Input**: [plan.md](plan.md), [spec.md](spec.md), research/data-model/contracts/quickstart nesta pasta.
**Status**: não iniciadas; validar D-INFO-001 e Implementation Approval antes de T001.
**Branch**: main, sob DEC-054; sem operação Git mutável pelo agente.

## Phase 1: Setup

- [ ] T001 Conferir aprovação de D-INFO-001/execução em specs/004-webfit-6-informacoes-globais/spec.md e docs/project/decision-log.md; conferir Git somente leitura e ler craft-floor Impeccable antes de UI.

## Phase 2: Foundational

- [ ] T002 Confirmar montagem/layout vigentes em src/App.tsx, src/LoginInfo.tsx e src/style.css, preservando alterações posteriores ao planejamento.

## Phase 3: User Story 1 — Consultar informações (P1)

**Goal**: consultar informações em qualquer tela sem abandonar o trabalho.
**Independent test**: TA-INFO-001..006 e regressão TA-UX-002 pelo quickstart.md.

- [ ] T003 [US1] Tornar callback administrativo opcional em src/LoginInfo.tsx e condicionar seção/ação à sua presença, preservando versão/falha e diálogo nativo (FR-002/003/005).
- [ ] T004 [US1] Montar informações no shell autenticado de src/App.tsx sem callback administrativo, fora das páginas e dos formulários, incluindo troca obrigatória de senha (FR-001/004/005).
- [ ] T005 [US1] Ajustar src/style.css para canto fixo compartilhado, espaço inferior nos shells/media queries e camada abaixo de tutorial/modal (FR-001/003/004).
- [ ] T006 [US1] Executar TA-INFO-001..006 e regressão TA-UX-002 conforme specs/004-webfit-6-informacoes-globais/quickstart.md; registrar UI/teclado/zoom/formulários/versão/falha e limites em .harness/evidence/webfit-6/verification.md (FR-001..005, SC-001..003).

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T007 Atualizar docs/requirements/functional-requirements.md, acceptance-criteria.md, traceability.md e DESIGN.md com escopo aprovado; executar format/check frontend, Rust/SQLite/Clippy e build Tauri aplicável, detector Impeccable uma vez; registrar comandos/resultados em .harness/evidence/webfit-6/verification.md.
- [ ] T008 Executar speckit-converge; consolidar Review independente e Evidence em .harness/evidence/webfit-6/review.md e evidence.md, atualizar docs/project/status.md e somente WEBFIT-6 no Plane; solicitar aceite final sem Git/publicação.

## Dependencies

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008. US1 é o único incremento e MVP inteiro.

## Parallel opportunities

Sem tarefa de implementação marcada [P]: montagem e layout dependem do contrato final do componente. Após implementação, os checks independentes de T007 podem rodar em paralelo; isso não dispensa Review independente nem autoriza agentes extras fora da skill aplicável.

## Implementation strategy

Um incremento completo: componente/layout, preservação dos fluxos, ensaio, documentação/checks e gates. Não criar testes que apenas espelhem JSX; os ensaios verificam comportamento observável e regressões existentes. Sem novas dependências, migração, alteração de banco, instalador local ou release. Se a opção administrativa dentro da sessão for escolhida, revisar scope/spec/plan/tasks antes da execução.
