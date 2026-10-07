# Tasks: WEBFIT-5

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/patient.md.
**Branch**: main; HEAD-base a83998ef33c032ea46e283322bbf7620c0051d49.
**Status**: propostas, nao iniciadas; aprovacao funcional/execucao e D-PAT-001/002 pendentes. Testes requeridos por SC-002/003 e DoD.

## Phase 1: Setup

- [ ] T001 Registrar aprovacao funcional/execucao e D-PAT-001/002 em docs/project/decision-log.md e RF-PAT-007 em docs/requirements/functional-requirements.md/spec.md, sem inferir aprovacao de Amanda.

## Phase 2: Foundational

- [ ] T002 Provar reconstrucao com foreign_keys ON, defer_foreign_keys, paciente referenciado e rollback no SQLCipher em src-tauri/src/tests.rs; parar se referencias nao forem preservadas (FR-004).
- [ ] T003 Snapshot criptografado consistente pre-migracao e teste de recuperacao/falha em src-tauri/src/database.rs, src-tauri/src/service.rs e src-tauri/src/tests.rs; nao copiar banco ativo (FR-004).
- [ ] T004 Criar src-tauri/migrations/002_optional_patient_cpf.sql e runner em src-tauri/src/database.rs: "CPF opcional; SQL NULL se ausente; informado normalizado, valido e unico inclusive entre arquivados"; conservar colunas/ordem, UUIDs, payloads, referencias/datas; nao editar 001 (FR-003/004).
- [ ] T005 Ajustar src-tauri/src/recovery.rs: schema real, metadados consistentes, backups v1/v2 e migracao temporaria; manter envelope v1, credencial, auditoria, backup preventivo e bloqueio (FR-004).

## Phase 3: US1 - Cadastro minimo (P1)

**Goal / Independent Test**: dois pacientes somente tres obrigatorios; TA-PAT-008..012 com reabertura.

- [ ] T006 [US1] Testes de comando/autorizacao, obrigatorios, CPF vazio multiplo, invalido/duplicado inclusive arquivado e e-mail opcional em src-tauri/src/tests.rs antes da validacao (FR-001/003).
- [ ] T007 [US1] Ajustar src-tauri/src/service.rs: "name nao vazio apos trim", "birth data civil valida nao futura", "sex F ou M, obrigatorio, sem default"; CPF NULL/consulta condicional, contato opcional e erros por campo (FR-001/002/003).
- [ ] T008 [US1] Radios acessiveis e required somente nos obrigatorios em src/App.tsx, foco em src/style.css; revisar lista/busca/mascara/rascunho e src/api.ts para CPF vazio (FR-001/002/003).
- [ ] T009 [US1] Sexo ficticio explicito em fixtures de novos salvamentos src-tauri/src/tests.rs e src-tauri/src/acceptance_tests.rs; adequar src/onboarding.ts; manter fixtures de legado (FR-001/002).

## Phase 4: US2 - Edicao, legado e recuperacao (P1)

**Goal / Independent Test**: conservar cadastro/backup na atualizacao; TA-PAT-013..016 em instalacao anterior/nova.

- [ ] T010 [US2] Aplicar D-PAT-001/002 validadas em src/App.tsx e src-tauri/src/service.rs: responsavel opcional com CPF/e-mail preenchidos validados e preservar sexo antigo ate escolha explicita (FR-005/006).
- [ ] T011 [US2] Testar vazio/v1 populada/idempotencia/futuro/falha em src-tauri/src/tests.rs; comparar IDs/payloads/tags/prescricoes/auditoria, foreign_keys ON/integridade, edicao sem CPF, legado e responsavel (FR-003/004/005/006).
- [ ] T012 [US2] Testar backups v1/v2 com vinculos e CPFs ausentes em src-tauri/src/tests.rs; futuro/metadata divergente/corrupcao/senha incorreta/falha preservam estado; sucesso une auditoria/bloqueia sessao (FR-004).

## Phase 5: Polish

- [ ] T013 Executar quickstart.md/checks existentes e ensaio Windows mouse/teclado; resultados em .harness/evidence/webfit-5/verification.md (FR-001..006, SC-001..004).
- [ ] T014 Sincronizar docs/requirements/{functional-requirements,business-rules,acceptance-criteria,use-cases,traceability}.md, docs/architecture/data-model.md e docs/operations/backup-restore.md; preservar historico.
- [ ] T015 Converge, review independente, gates Security/UI e evidencia/limites/versao em .harness/evidence/webfit-5/evidence.md e docs/project/status.md; Plane Review ate aceite final.

## Dependencies & Execution Order

T001 -> T002 -> T003/T004 -> T005 -> US1/US2 -> T013..T015. T006 antes de T007; T008/T009 apos contrato T007; T010 antes de T011; T012 depende T005. T002 prova estrategia antes de migrar instalacao.

## Parallel Examples

Sem [P]: historias compartilham App.tsx/service.rs/tests.rs. Checks frontend/Rust podem ocorrer independentemente apos edicoes.

## Implementation Strategy

Fundacao/compatibilidade primeiro, depois cadastro e preservacao. Ambas historias necessarias antes da atualizacao. Testes focados antes do comportamento, sem tooling novo. Sem Git mutavel/publicacao.
