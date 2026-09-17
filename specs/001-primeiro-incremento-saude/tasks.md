---
description: "Task list for the first Health increment"
---

# Tasks: Primeiro incremento de Saúde

**Input**: Design documents from /specs/001-primeiro-incremento-saude/
**Status**: planejamento aprovado; spike G4 autorizado. Implementação de produto permanece bloqueada até conclusão do G4, aprovação do G5 e aprovação das mudanças sensíveis aplicáveis.

## Phase 1: Setup and architecture readiness

- [ ] T001 Record G4 spike acceptance evidence and open decisions in docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md
- [ ] T002 [P] Update RF/RNF/TA traceability in docs/requirements/traceability.md
- [ ] T003 [P] Define approved quality commands in docs/quality/test-plan.md
- [ ] T004 [P] Prepare candidate src/, src-tauri/ and tests/ directories only after G4 accepts the architecture
- [ ] T005 Record implementation-approval and sensitive-change gates in docs/project/development-lifecycle.md

## Phase 2: Foundational prerequisites

**Purpose**: blocking work for every user story; no clinical story starts before this phase is approved.

- [ ] T006 Validate clean Windows installation and offline startup in tests/spike/desktop-shell.md
- [ ] T007 Validate local persistence, foreign keys, transactions, empty database and migration upgrade in tests/spike/sqlite-persistence.md
- [ ] T008 Validate the trusted command boundary and reject generic SQL/direct filesystem access in tests/security/command-boundary.md
- [ ] T009 Define safe domain errors and diagnostics in src-tauri/src/shared/errors.rs
- [ ] T010 Define session, authorization and Health workspace context in src-tauri/src/security/context.rs
- [ ] T011 Define mandatory audit writes and failure behavior in src-tauri/src/audit/writer.rs
- [ ] T012 Define consistent snapshot, manifest and checksum boundary in src-tauri/src/recovery/backup_package.rs
- [ ] T013 [P] Create fictitious fixtures with no real health data in tests/fixtures/fictitious-health-data/
- [ ] T014 Re-run Constitution Check and record G4/G5 approval in specs/001-primeiro-incremento-saude/plan.md

## Phase 3: User Story 1 - Access Health safely (P1, MVP)

**Goal**: local users authenticate, enter Health, manage profile, logout and recover from session lock.
**Independent Test**: TA-AUT-001..004 and TA-CLI-001..002 offline with fictitious data and no plaintext credentials.

- [ ] T015 [P] [US1] Add authentication acceptance tests in tests/acceptance/authentication/
- [ ] T016 [P] [US1] Add profile and Health workspace acceptance tests in tests/acceptance/profile-workspace/
- [ ] T017 [US1] Implement local users and password derivation in src-tauri/src/identity/users.rs
- [ ] T018 [US1] Implement authentication, progressive delays, logout and timeout in src-tauri/src/identity/session.rs
- [ ] T019 [US1] Implement administrative temporary-password reset in src-tauri/src/identity/password_reset.rs
- [ ] T020 [US1] Implement authorized Health workspace entry in src-tauri/src/workspaces/health.rs
- [ ] T021 [P] [US1] Implement professional profile validation/persistence in src-tauri/src/profile/professional_profile.rs
- [ ] T022 [P] [US1] Implement login and profile screens in src/pages/auth/LoginPage.tsx and src/pages/health/ProfilePage.tsx
- [ ] T023 [US1] Add login, reset, profile and workspace audit events in src-tauri/src/audit/catalog.rs
- [ ] T024 [US1] Execute TA-AUT-001..004 and TA-CLI-001..002; store evidence in .harness/evidence/health-increment/

## Phase 4: User Story 2 - Manage patients (P1)

**Goal**: authenticated users create, search, edit, archive, restore and tag patients non-destructively.
**Independent Test**: TA-PAT-001..007 after US1, including restart persistence.

- [ ] T025 [P] [US2] Add patient validation/persistence tests in tests/acceptance/patients/
- [ ] T026 [P] [US2] Add search, edit, archive, restore and tag tests in tests/acceptance/patients/
- [ ] T027 [P] [US2] Add draft recovery test TA-PAT-007 in tests/acceptance/drafts/
- [ ] T028 [US2] Implement patient validation and responsible-person rules in src-tauri/src/health/patients.rs
- [ ] T029 [US2] Implement patient persistence and non-destructive archive/restore in src-tauri/src/health/patient_repository.rs
- [ ] T030 [US2] Implement normalized search and masked list projection in src-tauri/src/health/patient_search.rs
- [ ] T031 [P] [US2] Implement patient and tag screens in src/pages/health/PatientsPage.tsx and src/pages/health/PatientFormPage.tsx
- [ ] T032 [US2] Implement tag lifecycle and historical associations in src-tauri/src/health/tags.rs
- [ ] T033 [US2] Add patient and tag audit events in src-tauri/src/audit/catalog.rs
- [ ] T034 [US2] Execute TA-PAT-001..007; store evidence in .harness/evidence/health-increment/

## Phase 5: User Story 3 - Create plan and guidance (P1)

**Goal**: create, calculate, finalize, version and cancel a patient prescription.
**Independent Test**: TA-PRE-001..016 with approved fictitious clinical examples and an active patient.

- [ ] T035 [P] [US3] Add prescription lifecycle tests in tests/acceptance/prescriptions/
- [ ] T036 [P] [US3] Add food source, unit conversion and composition tests in tests/acceptance/nutrition/
- [ ] T037 [P] [US3] Add energy, goal, special-condition and adequacy tests in tests/acceptance/nutrition/
- [ ] T038 [US3] Implement food source/version/origin and gram-canonical rules in src-tauri/src/nutrition/foods.rs
- [ ] T039 [US3] Implement prescription, meal, item and version persistence in src-tauri/src/nutrition/prescriptions.rs
- [ ] T040 [US3] Implement composition calculations and presentation rounding in src-tauri/src/nutrition/composition.rs
- [ ] T041 [US3] Implement approved energy and goal protocols with provenance in src-tauri/src/nutrition/energy_goals.rs
- [ ] T042 [P] [US3] Implement prescription editor and goal screens in src/pages/health/PrescriptionPage.tsx
- [ ] T043 [US3] Add prescription lifecycle and manual-adjustment audit events in src-tauri/src/audit/catalog.rs
- [ ] T044 [US3] Execute TA-PRE-001..016; store evidence in .harness/evidence/health-increment/

## Phase 6: User Story 4 - Recover interrupted forms (P2)

**Goal**: recover or discard long-form autosave without confusing it with persistent clinical drafts.
**Independent Test**: TA-DRF-001..004 across profile, patient and prescription forms.

- [ ] T045 [P] [US4] Add autosave timing, failure, scope and expiration tests in tests/acceptance/drafts/
- [ ] T046 [US4] Implement temporary draft lifecycle and approximately 30-second safe-navigation save in src-tauri/src/drafts/automatic_drafts.rs
- [ ] T047 [US4] Implement scoped recovery/discard prompt in src/pages/shared/DraftRecoveryDialog.tsx
- [ ] T048 [US4] Integrate autosave failure state in src/shared/drafts/
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

## Dependencies & Execution Order

- Phase 1 is planning/setup; it does not authorize implementation.
- Phase 2 blocks all stories and requires G4/G5.
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
2. Complete Phase 2 and stop for implementation approval.
3. Deliver US1, validate independently, then add patients and nutrition.
4. Add drafts, audit and recovery with negative tests.
5. Run cross-cutting validation, Verification, Review, Security Gate and Evidence.
6. No commit, push, merge, release or deploy is automatic.

## Notes

Every task has a checkbox, sequential ID, and repository path. [P] marks only independent files. This plan is a work breakdown and does not grant permission to implement.