# Tasks: Recuperação contextual de rascunhos (WEBFIT-7)

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/ui.md)

**Authority**: Maycon aprovou implementação em 2026-10-08. Execução permanece na branch `main` conforme DEC-054. Escopo de implementação e aceite permanece somente com dados fictícios.

**Tests**: Nenhuma tarefa de teste automatizado foi solicitada na especificação. Acceptance/Verification seguem TA-DRF-005..010 e o fluxo harness.

## Phase 1: Setup

- [x] T001 Conferir branch `main`, HEAD-base `e07cdc8300de0421dbdc7fd64aafe7d30a191e80` e preservar as alterações concorrentes em `src/App.tsx`, documentação, branding e atualização.
- [x] T002 Registrar RF-DRF-002 em `docs/requirements/functional-requirements.md`, RN-DRF-006/007 em `docs/requirements/business-rules.md`, TA-DRF-005..010 em `docs/requirements/acceptance-criteria.md`, UC-DRF-001 em `docs/requirements/use-cases.md`, rastreabilidade em `docs/requirements/traceability.md` e fluxo em `docs/ux/flows.md`.

## Phase 2: US1 — Restaurar no mesmo formulário (P1)

**Goal**: oferecer o rascunho somente quando a pessoa abre o contexto que originou aquele preenchimento e restaurar seus valores.

**Independent Acceptance**: TA-DRF-005/006. Rascunho fictício corresponde ao formulário, modal aparece nesse contexto e a restauração reaplica os valores.

- [x] T003 [US1] Derivar o contexto ativo para perfil, cadastro/edição de paciente e prescrição/cardápio; casar a chave local com o ID retornado `<user-id>:<context-key>` em `src/App.tsx`.
- [x] T004 [US1] Substituir a faixa global de rascunhos por estado modal condicionado ao contexto correspondente em `src/App.tsx`.
- [x] T005 [US1] Implementar o diálogo acessível com pergunta, data de salvamento e ações “Sim, restaurar”/“Não, descartar” em `src/DraftRecoveryDialog.tsx`.
- [x] T006 [US1] Ao restaurar, aplicar o payload ao formulário ativo e preservar o registro/contexto associado em `src/App.tsx`.

## Phase 3: US2 — Descartar apenas o rascunho correspondente (P1)

**Goal**: descartar o autosave selecionado sem apagar outros rascunhos ou dados persistidos.

**Independent Acceptance**: TA-DRF-007..009. Cadastro novo fica vazio; edição mantém valores persistidos; falha não simula sucesso.

- [x] T007 [US2] Conectar “Não, descartar” à operação autenticada de descarte para o ID correspondente e atualizar o estado apenas após sucesso em `src/App.tsx`.
- [x] T008 [US2] Após descarte, restaurar defaults de criação ou recarregar/retomar valores persistidos de edição sem excluir prescrição clínica em `src/App.tsx`.
- [x] T009 [US2] Preservar exibição segura de erro e os dados válidos se consulta/descarte falhar em `src/App.tsx`.

## Phase 4: Polish and cross-cutting behavior

- [x] T010 Garantir nomes acessíveis, operação por teclado, foco preso até escolha, Escape/clique externo sem descarte e retorno de foco conforme TA-DRF-010 em `src/DraftRecoveryDialog.tsx` e `src/style.css`.
- [x] T011 Preservar autosave periódico, save-before-navigation, fechamento, logout, expiração e limpeza após conclusão ao integrar em `src/App.tsx`.
- [x] T012 Manter RF/regras/TA/use case/matriz em `docs/requirements/functional-requirements.md`, `business-rules.md`, `acceptance-criteria.md`, `use-cases.md`, `traceability.md`, fluxo em `docs/ux/flows.md` e artifacts `spec.md`, `plan.md`, `tasks.md`, `data-model.md`, `contracts/ui.md`, `quickstart.md` no diretório da feature.

## Dependencies

`T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008/T009 → T010/T011 → T012`. T007 depende do modal de T005; T008/009 dependem de T007. Tasks T010 e T011 têm arquivos/efeitos próximos e devem ser integradas sequencialmente em `src/App.tsx`.

## Implementation Strategy

1. Reutilizar os dados de rascunho já carregados pela sessão e implementar a recuperação da US1.
2. Implementar o descarte da US2 respeitando separação autosave/persistência clínica.
3. Revisar acessibilidade e preservar autosave/navegação/encerramento antes dos checks e verificação do harness.

Não alterar banco, migrações, backend, autorização, dependências, backup ou infraestrutura.
