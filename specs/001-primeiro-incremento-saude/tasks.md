---
description: "Task list for the first Health increment"
---

# Tasks: Primeiro incremento de Saúde

**Input**: Design documents from /specs/001-primeiro-incremento-saude/
**Status**: G4 concluído; T081 aprovado e preparação local do updater executada. DEC-044 adia atualizações automáticas e T082/T083; distribuição manual no MVP. Implementação G5 e mudanças sensíveis locais autorizadas em DEC-045; testes fictícios e instalador manual, sem publicação.

## Phase 1: Setup and architecture readiness

- [x] T001 Record G4 spike acceptance evidence and open decisions in docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md
- [x] T002 [P] Update RF/RNF/TA traceability in docs/requirements/traceability.md
- [x] T003 [P] Define approved quality commands in docs/quality/test-plan.md
- [x] T004 [P] Prepare candidate src/, src-tauri/ and tests/ directories only after G4 accepts the architecture
- [x] T005 Record implementation-approval and sensitive-change gates in docs/project/development-lifecycle.md

## Phase 2: Foundational prerequisites

**Purpose**: blocking work for every user story; no clinical story starts before this phase is approved.

- [ ] T006 Validate clean Windows installation and offline startup in tests/spike/desktop-shell.md
- [ ] T007 Validate local persistence, foreign keys, transactions, empty database and migration upgrade in tests/spike/sqlite-persistence.md
- [ ] T008 Validate the trusted command boundary and reject generic SQL/direct filesystem access in tests/security/command-boundary.md
- [x] T009 Define safe domain errors and diagnostics in src-tauri/src/shared/errors.rs
- [x] T010 Define session, authorization and Health workspace context in src-tauri/src/security/context.rs
- [x] T011 Define mandatory audit writes and failure behavior in src-tauri/src/audit/writer.rs
- [x] T012 Define consistent snapshot, manifest and checksum boundary in src-tauri/src/recovery/backup_package.rs
- [x] T013 [P] Create fictitious fixtures with no real health data in tests/fixtures/fictitious-health-data/
- [x] T014 Re-run Constitution Check and record G4/G5 approval in specs/001-primeiro-incremento-saude/plan.md

## Phase 3: User Story 1 - Access Health safely (P1, MVP)

**Goal**: local users authenticate, enter Health, manage profile, logout and recover from session lock.
**Independent Test**: TA-AUT-001..004 and TA-CLI-001..002 offline with fictitious data and no plaintext credentials.

- [ ] T015 [P] [US1] Add authentication acceptance tests in tests/acceptance/authentication/
- [ ] T016 [P] [US1] Add profile and Health workspace acceptance tests in tests/acceptance/profile-workspace/
- [x] T017 [US1] Implement local users and password derivation in src-tauri/src/identity/users.rs
- [x] T018 [US1] Implement authentication, progressive delays, logout and timeout in src-tauri/src/identity/session.rs
- [x] T019 [US1] Implement administrative temporary-password reset in src-tauri/src/identity/password_reset.rs
- [x] T020 [US1] Implement authorized Health workspace entry in src-tauri/src/workspaces/health.rs
- [x] T021 [P] [US1] Implement professional profile validation/persistence in src-tauri/src/profile/professional_profile.rs
- [x] T022 [P] [US1] Implement login and profile screens in src/pages/auth/LoginPage.tsx and src/pages/health/ProfilePage.tsx
- [ ] T023 [US1] Add login, reset, profile and workspace audit events in src-tauri/src/audit/catalog.rs
- [ ] T024 [US1] Execute TA-AUT-001..004 and TA-CLI-001..002; store evidence in .harness/evidence/health-increment/

## Phase 4: User Story 2 - Manage patients (P1)

**Goal**: authenticated users create, search, edit, archive, restore and tag patients non-destructively.
**Independent Test**: TA-PAT-001..007 after US1, including restart persistence.

- [ ] T025 [P] [US2] Add patient validation/persistence tests in tests/acceptance/patients/
- [ ] T026 [P] [US2] Add search, edit, archive, restore and tag tests in tests/acceptance/patients/
- [ ] T027 [P] [US2] Add draft recovery test TA-PAT-007 in tests/acceptance/drafts/
- [x] T028 [US2] Implement patient validation and responsible-person rules in src-tauri/src/health/patients.rs
- [x] T029 [US2] Implement patient persistence and non-destructive archive/restore in src-tauri/src/health/patient_repository.rs
- [x] T030 [US2] Implement normalized search and masked list projection in src-tauri/src/health/patient_search.rs
- [x] T031 [P] [US2] Implement patient and tag screens in src/pages/health/PatientsPage.tsx and src/pages/health/PatientFormPage.tsx
- [x] T032 [US2] Implement tag lifecycle and historical associations in src-tauri/src/health/tags.rs
- [x] T033 [US2] Add patient and tag audit events in src-tauri/src/audit/catalog.rs
- [ ] T034 [US2] Execute TA-PAT-001..007; store evidence in .harness/evidence/health-increment/

## Phase 5: User Story 3 - Create plan and guidance (P1)

**Goal**: create, calculate, finalize, version and cancel a patient prescription.
**Independent Test**: TA-PRE-001..016 with approved fictitious clinical examples and an active patient.

- [ ] T035 [P] [US3] Add prescription lifecycle tests in tests/acceptance/prescriptions/
- [ ] T036 [P] [US3] Add food source, unit conversion and composition tests in tests/acceptance/nutrition/
- [ ] T037 [P] [US3] Add energy, goal, special-condition and adequacy tests in tests/acceptance/nutrition/
- [ ] T038 [US3] Implement food source/version/origin and gram-canonical rules in src-tauri/src/nutrition/foods.rs
- [x] T039 [US3] Implement prescription, meal, item and version persistence in src-tauri/src/nutrition/prescriptions.rs
- [x] T040 [US3] Implement composition calculations and presentation rounding in src-tauri/src/nutrition/composition.rs
- [x] T041 [US3] Implement approved energy and goal protocols with provenance in src-tauri/src/nutrition/energy_goals.rs
- [x] T042 [P] [US3] Implement prescription editor and goal screens in src/pages/health/PrescriptionPage.tsx
- [ ] T043 [US3] Add prescription lifecycle and manual-adjustment audit events in src-tauri/src/audit/catalog.rs
- [ ] T044 [US3] Execute TA-PRE-001..016; store evidence in .harness/evidence/health-increment/

## Phase 6: User Story 4 - Recover interrupted forms (P2)

**Goal**: recover or discard long-form autosave without confusing it with persistent clinical drafts.
**Independent Test**: TA-DRF-001..004 across profile, patient and prescription forms.

- [ ] T045 [P] [US4] Add autosave timing, failure, scope and expiration tests in tests/acceptance/drafts/
- [x] T046 [US4] Implement temporary draft lifecycle and approximately 30-second safe-navigation save in src-tauri/src/drafts/automatic_drafts.rs
- [x] T047 [US4] Implement scoped recovery/discard prompt in src/pages/shared/DraftRecoveryDialog.tsx
- [x] T048 [US4] Integrate autosave failure state in src/shared/drafts/
- [ ] T049 [US4] Execute TA-DRF-001..004; store evidence in .harness/evidence/health-increment/

## Phase 7: User Story 5 - Consult audit safely (P2)

**Goal**: authorized users list, filter, paginate and inspect audit metadata without editing or clinical content.
**Independent Test**: TA-AUD-001..015 including denied access, query failure, equal timestamps and later events.

- [ ] T050 [P] [US5] Add audit write/redaction tests in tests/acceptance/audit/
- [ ] T051 [P] [US5] Add query, filter, empty/error and authorization tests in tests/acceptance/audit/
- [ ] T052 [P] [US5] Add accepted D-AUTO-001/002 tests in tests/acceptance/audit/
- [x] T053 [US5] Resolve D-AUTO-001/002 and update docs/requirements/business-rules.md and docs/requirements/acceptance-criteria.md
- [ ] T054 [US5] Implement immutable events and controlled catalogs in src-tauri/src/audit/events.rs
- [ ] T055 [US5] Implement authorized UTC-window query, AND filters, page size 50 and opaque cursor in src-tauri/src/audit/query.rs
- [ ] T056 [P] [US5] Implement audit list, filters, pagination, detail and distinct error states in src/pages/health/AuditPage.tsx

  Progresso 2026-10-07: interface existente em src/App.tsx complementada com carregamento/erros/vazios, filtros/retry, detalhes legíveis e foco de teclado; auxiliares/testes em src/audit-view.ts e tests/unit/audit-view.test.ts. Checks frontend (12 testes), Rust (18 testes), formatação, lint e build frontend PASS. T051/T056 parciais; cobertura completa, ensaio Windows e revisão pendentes. Evidência .harness/evidence/health-increment/2026-10-07-audit-ui.md.
- [ ] T057 [US5] Execute TA-AUD-001..015 and record results in .harness/evidence/health-increment/

## Phase 8: User Story 6 - Protect and restore data (P1)

**Goal**: valid backups are created/restored safely; invalid packages never replace current data.
**Independent Test**: TA-BKP-001..005 with valid, corrupt and incompatible packages.

- [ ] T058 [P] [US6] Add backup creation, daily trigger, integrity, corruption and alert tests in tests/acceptance/backup/
- [ ] T059 [US6] Implement consistent database snapshot and manifest in src-tauri/src/recovery/backup_snapshot.rs
- [ ] T060 [US6] Implement files, UUID mapping, checksums and atomic publication in src-tauri/src/recovery/backup_package.rs
- [ ] T061 [US6] Implement package validation, safety copy, confirmation and restore in src-tauri/src/recovery/restore.rs
- [ ] T062 [US6] Implement first-use trigger, 60-day rotation and over-24-hour alert in src-tauri/src/recovery/backup_status.rs
- [ ] T063 [P] [US6] Implement backup status and restore confirmation in src/pages/health/BackupPage.tsx
- [ ] T064 [US6] Add backup/restore audit events without sensitive payloads in src-tauri/src/audit/catalog.rs
- [ ] T065 [US6] Execute TA-BKP-001..005; store evidence in .harness/evidence/health-increment/

## Phase 9: Polish and cross-cutting validation

- [ ] T066 [P] Update docs/requirements/traceability.md with task, test and evidence references
- [ ] T067 [P] Execute keyboard and 200% zoom checks in tests/acceptance/accessibility/
- [ ] T068 [P] Execute offline, persistence, performance and restart checks in tests/acceptance/non-functional/
- [ ] T069 [P] Run sensitive-data log scan and authorization negatives in tests/security/
- [ ] T070 Run specs/001-primeiro-incremento-saude/quickstart.md and record evidence in .harness/evidence/health-increment/
- [ ] T071 Run speckit-analyze, harness Verification and Review; update docs/project/risk-register.md
- [ ] T072 Update docs/project/status.md with stage, evidence, exact next action and remaining human gates

## Phase 10: Pilot update foundation (G5 preparation)

**Purpose**: preparar a publicação frequente aprovada em DEC-043/ADR-0002 sem misturar atualização com o escopo clínico e sem iniciar configuração sensível antes do gate.

**Execution gate**: T073–T074 documentam decisões já consolidadas; T075–T080 exigem planejamento e avaliação; T081 foi aprovado; T082/T083 concluem a configuração externa e a evidência do canal piloto.

- [x] T073 Reconcile the approved updater behavior and technology inventory in docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md and docs/operations/update-release-strategy.md
- [x] T074 Document the pilot/stable channels, merge trigger, confirmation flow and zero-cost constraints in docs/project/git-workflow.md and docs/project/status.md
- [x] T075 Define updater spike acceptance scenarios for invalid signature, unavailable network, backup before migration, interrupted installation and compatible rollback in docs/quality/update-spike-test-plan.md
- [x] T076 Inventory updater and pipeline dependencies, versions, licenses and Tauri permissions in docs/architecture/update-component-inventory.md
- [x] T077 Define private-key custody, recovery, rotation and GitHub secret handling without storing secrets in the repository in docs/security/update-signing.md
- [x] T078 Specify the static `latest.json` contract, SemVer pilot numbering, artifact naming, checksums and stable promotion in docs/operations/update-manifest-contract.md
- [x] T079 Design the Windows runner and release-only repository workflow, including offline fallback and no-token-in-app constraints in docs/operations/update-pipeline-design.md
- [x] T080 Prepare updater and pipeline traceability from DEC-043/ADR-0002 to tests and evidence in docs/requirements/traceability.md and .harness/evidence/update-pilot/
- [x] T081 Record implementation approval and sensitive-change approval before adding updater dependencies, generating keys, configuring the runner or creating release automation in docs/project/status.md
- [ ] T082 **RETOMADO localmente por DEC-050; ativação/execução externa pendentes.** Configure the separate public release repository, Windows self-hosted runner, GitHub variable/secrets and final updater endpoint in docs/operations/update-pipeline-design.md
- [ ] T083 **RETOMADO localmente por DEC-050; ativação/execução externa pendentes.** Execute the first pilot publication and end-to-end update check, including confirmation, backup, signature verification, installation and restart evidence in docs/quality/update-spike-test-plan.md

---

## Dependencies & Execution Order

- Phase 1 is planning/setup; it does not authorize implementation.
- Phase 10 is the G5 update-foundation track; T081 authorizes the local preparation, while T082 and T083 are required before the pilot channel is considered operational.
- Phase 2 blocks all stories and requires the G5 implementation approval plus completion of the applicable sensitive gates.
- US1 depends on Phase 2; US2 depends on US1 workspace/session context.
- US3 depends on US1 and an active patient from US2.
- US4 depends on forms from US1, US2 and US3.
- US5 depends on the audit writer and events from the preceding flows.
- US6 depends on persistence and audit foundation.
- Phase 9 depends on the release stories selected and their evidence.

Parallel opportunities: T002/T003/T013; T006–T012 by specialty after spike approval; acceptance-test groups within each story; UI tasks marked [P] after contracts; US5 and US6 after shared foundation.

## Story Completion Criteria

- **US1**: TA-AUT-001..004 and TA-CLI-001..002 pass; no plaintext credential or unauthorized workspace access.
- **US2**: TA-PAT-001..007 pass; CPF rules, archive/restore and tag history verified.
- **US3**: TA-PRE-001..016 pass; sources, protocols, calculations, versions and cancellation history verified.
- **US4**: TA-DRF-001..004 pass; failure preserves last valid state and persistent prescription drafts do not expire.
- **US5**: TA-AUD-001..015 pass, including actor typing and deterministic cursor behavior.
- **US6**: TA-BKP-001..005 pass; invalid restore preserves current state.

## Implementation Strategy

1. Complete G4 spike and Human Decision Review before schema or dependencies.
2. DEC-044: defer Phase 10 T082/T083; use manual installation/update for the MVP. Preserve local preparation without activating publication.
3. Obtain specific G5 implementation approval and applicable sensitive gates before product code, dependencies or schema.
4. Complete Phase 2 foundation with fictitious fixtures before clinical stories.
5. Deliver US1, validate independently, then add patients and nutrition.
6. Add drafts, audit and recovery with negative tests.
7. Run cross-cutting validation, Verification, Review, Security Gate and Evidence.
8. DEFERRED by DEC-044: A reviewed merge into `main` may publish the pilot only after the approved pipeline exists; installation requires user confirmation, and no commit, push, release or deploy is automatic.

## Notes

Every task has a checkbox, sequential ID, and repository path. [P] marks only independent files. This plan is a work breakdown and does not grant permission to implement.

## Evidência de execução — 2026-10-06

As caixas de implementação acima significam código construído, sem representar execução integral de aceite, revisão independente ou conclusão do G5. Mapeamento dos caminhos previstos para módulos reais e cobertura/pendências: `.harness/evidence/health-increment/2026-10-06-candidate.md`. T038 permanece parcial: catálogo TBCA ampliado de cinco para 88 itens em 2026-10-07, sem base completa ou TACO integrada. T006 e os ensaios de interface/Windows 10 continuam pendentes. T082/T083 retomados por DEC-050, sem ativação/publicação externa.


## Refinamento RF-UX-001 — DEC-046, 2026-10-06

- [x] T084 Implementar tours contextualizados, Pular/Concluir/Voltar/Próximo, repetição e posicionamento em src/GuidedTour.tsx e src/onboarding.ts; ligar os controles reais em src/App.tsx e src/EnergyForm.tsx.
- [x] T085 Persistir somente a preferência por usuário/tela na tabela settings existente, com autorização e catálogo fechado no backend src-tauri/src/service.rs; testar reabertura, isolamento e acesso negado em src-tauri/src/tests.rs.
- [x] T086 Verificar lint/TypeScript/build, formatação, testes Node/Rust e clippy; documentar a entrega em .harness/evidence/health-increment/2026-10-06-onboarding.md.
- [ ] T087 Confirmar os balões, foco, navegação, skip/replay e atualização manual no Windows 10 x64 conforme docs/operations/mvp-local-test.md. Automação visual indisponível neste host por falha do sandbox do navegador.


## Refinamento RN-AUT-001 — DEC-047, 2026-10-07

- [x] T088 Ajustar validação de criação/troca/redefinição para seis caracteres em src-tauri/src/security.rs e src/App.tsx; atualizar copy/tutorial e RN-AUT-001, preservando recuperação em doze e hashes existentes.
- [x] T089 Verificar limites cinco/seis, setup, login, troca e redefinição via src-tauri/src/tests.rs; registrar checks/build 0.1.2 em .harness/evidence/health-increment/2026-10-07-password-length.md.
- [ ] T090 Maycon confirma no instalador 0.1.2 primeiro acesso com seis caracteres e recuperação com doze conforme docs/operations/mvp-local-test.md.


## RF-DIS-001 — DEC-048, atualização manual clara

- [x] T091 Configurar tradução de manutenção NSIS em src-tauri/installer/PortugueseBR.nsh e src-tauri/tauri.conf.json; preservar identidade, registro e escopo currentUser.
- [x] T092 Verificar template/idioma gerados, checks existentes e build NSIS 0.1.3; evidência .harness/evidence/health-increment/2026-10-07-installer-update.md.
- [ ] T093 Maycon testa instalação limpa, atualização 0.1.1/0.1.2 para 0.1.3 com paciente/tour fictícios preservados e reparação da mesma versão, conforme docs/operations/mvp-local-test.md.

## Continuação de T038 — RF-PRE-002, DEC-045, 2026-10-07

- [x] T094 Ampliar seleção oficial offline em src/data/tbca.json via scripts/expand-tbca.py, preservando os cinco registros anteriores, código, fonte, preparação, unidades, valores originais e proveniência em src/data/tbca-import-manifest.json.
- [x] T095 Melhorar pesquisa por palavras/acentos/código, lista progressiva e estado vazio em src/FoodPicker.tsx e src/food-search.ts; conferir integridade, importação e autoridade/proporção no backend em tests/unit/food-search.test.ts, tests/unit/tbca-import.test.py e src-tauri/src/acceptance_tests.rs.
- [x] T096 Gerar/verificar instalador 0.1.4 e registrar evidência em .harness/evidence/health-increment/2026-10-07-food-catalog.md.
- [ ] T097 Ensaiar busca, medida caseira, porção, persistência e atualização no Windows 10 x64, conforme docs/operations/mvp-local-test.md. T038 ainda exige cobertura completa e fallback TACO conforme RN-PRE-002, sem inferir ausência na TBCA a partir desta seleção local.

## Refinamento RF-UX-002 — DEC-049, 2026-10-07

- [x] T098 Implementar informações do login, versão atual, crédito e entrada administrativa em src/LoginInfo.tsx, src/App.tsx e src/style.css; preservar autenticação/backend e acessos existentes.
- [x] T099 Verificar formatação, lint, TypeScript, testes e build; registrar RF-UX-002/TA-UX-002 em .harness/evidence/health-increment/2026-10-07-login-info.md.
- [ ] T100 Ensaiar TA-UX-002 no Windows: primeira instalação, atualização com administrador de nome anterior, foco/Escape, zoom e login negado; validar candidato antes da distribuição.

## Retomada do produto e pipeline — DEC-050, ADR-0002

- [ ] T101 Adaptar workflow piloto da raiz e verificador em .github/workflows/pilot-release.yml e scripts/, preservando bloqueio de ativação até revisão final; conferir pré-requisitos dos dois runners próprios.
- [x] T102 Implementar consulta e instalação autorizadas do updater no backend do produto, backup consistente antes da instalação, rejeição de origem/versão e bloqueio de operações concorrentes em src-tauri/src/update.rs e service.rs. Código/testes locais concluídos; ensaio real T105 pendente.
- [ ] T103 **Parcial:** painel com aviso/ícone, confirmar/adiar/progresso e acesso manual implementado em src/UpdatePanel.tsx; ensaio visual, frequência persistente e bandeja Windows pendentes.
- [ ] T104 **Parcial:** checks, assinatura de fixture, staging e instalador inicial 0.1.5 verificados; assinatura real no serviço do runner pendente. Evidência em .harness/evidence/update-pilot/2026-10-07-product-preparation.md.
- [ ] T105 Validar segundo runner, autorizar ativação/publicação e executar T082/T083 com duas versões fictícias; somente então considerar atualização operacional.
- [x] T106 RF-UPD-001/TA-UPD-UI-001/DEC-051: substituir expansão lateral por modal nativo com blur, foco e fechamento protegido em src/UpdatePanel.tsx e src/style.css.
- [x] T107 Verificar frontend/build, gerar candidato 0.1.6 e registrar evidência local e ensaio Windows pendente do modal.

## RF-AUT-004 — DEC-052

- [x] T108 Implementar leitura/gravação autenticada de nome lembrado em src-tauri/src/service.rs; testar opt-in, reabertura, remoção, falha de login e isolamento/autorização em src-tauri/src/tests.rs.
- [x] T109 Adicionar checkbox e preenchimento sem senha em src/App.tsx/src/style.css; verificar checks e registrar .harness/evidence/health-increment/2026-10-07-remember-login.md.
- [ ] T110 Ensaiar TA-AUT-005 no próximo candidato Windows, incluindo reabertura, desmarcar, senha vazia, foco/teclado e atualização.
- [x] T112 RF-UPD-001 / DEC-053 / TA-UPD-UI-002: remover modal/ícone, criar faixa superior com consulta por login, adiar/confirmar/progresso; testar deduplicação StrictMode e sessão nova.
- [ ] T113 **Preparação local concluída; execução real pendente:** Habilitar workflow local, preparar diagnóstico/ambiente do runner da empresa e candidato inicial; executar todas as etapas via cmd com bootstrap Node, contornando a dependência do host em arquivos PowerShell sem mudar sua política; registrar checks e comandos para integração Git pelo usuário. Remoto ativo somente após execução/publicação comprovadas.
