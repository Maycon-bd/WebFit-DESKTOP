# Matriz de rastreabilidade

**Status:** baseline do primeiro incremento preenchida; evidência de execução parcial local disponível; aceite integral pendente.

| Requisito | Título | Status | Fonte | Regras | Caso de uso | Testes | Riscos/ADR | Backlog | Evidência |
|---|---|---|---|---|---|---|---|---|---|
| RF-AUT-001 | primeiro acesso e usuários | aprovado | entrevista 01 | RN-AUT-001/002 | UC-AUT-001 | TA-AUT-001 | RSK-003/008, ADR-0001 | PBI-002 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-AUT-002 | autenticar, sair e bloquear | aprovado | entrevista 01 | RN-AUT-001..004 | UC-AUT-001 | TA-AUT-002/003 | RSK-003/008, ADR-0001 | PBI-002 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-AUT-003 | reset administrativo | aprovado | entrevista 01 | RN-AUT-005 | UC-AUT-002 | TA-AUT-004 | RSK-008/009 | PBI-002 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-CLI-001 | perfil profissional | aprovado | entrevista 01 | RN-CLI-001/003 | UC-CLI-001 | TA-CLI-001 | RSK-003/008 | PBI-003 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-CLI-002 | espaço Saúde | aprovado | DEC-014/015 | RN-CLI-001/002 | UC-AUT-001 | TA-CLI-002 | RSK-010 | PBI-003 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-001 | cadastrar paciente | aprovado | entrevista 01 | RN-PAT-001..006 | UC-PAT-001 | TA-PAT-001/002 | RSK-003/005/008 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-002 | pesquisar e abrir | aprovado | entrevista 01 | RN-PAT-007 | UC-PAT-002 | TA-PAT-003 | RSK-003/008 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-003 | editar paciente | aprovado | entrevista 01 | RN-PAT-001..006, RN-AUD-001 | UC-PAT-002 | TA-PAT-004 | RSK-003/008 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-004 | arquivar/restaurar | aprovado | entrevista 01 | RN-PAT-008/009 | UC-PAT-003 | TA-PAT-005 | RSK-005 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-005 | tags | aprovado | entrevista 01 | RN-PAT-010 | UC-PAT-001 | TA-PAT-006 | RSK-005 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PAT-006 | rascunho de paciente | aprovado | entrevista 01/DEC-024 | RN-DRF-001..005 | UC-DRF-001 | TA-PAT-007/TA-DRF-001..004 | RSK-003 | PBI-004 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-DRF-001 | proteger formulários longos | aprovado | Maycon/DEC-024 | RN-DRF-001..005 | UC-DRF-001 | TA-DRF-001..004/TA-PAT-007 | RSK-003 | PBI-003/004/010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PRE-001 | criar prescrição | aprovado | Amanda/DEC-022 | RN-PRE-001/008..010 | UC-PRE-001 | TA-PRE-001/006 | RSK-013 | PBI-010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PRE-002 | refeições, alimentos e porções | aprovado | Amanda/DEC-022 | RN-PRE-001..005 | UC-PRE-001 | TA-PRE-002/004 | RSK-013 | PBI-010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PRE-003 | composição nutricional | aprovado | Amanda/DEC-022 | RN-PRE-006/007 | UC-PRE-001 | TA-PRE-003/005 | RSK-013 | PBI-010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PRE-004 | versões e histórico | aprovado | Amanda/DEC-022 | RN-PRE-008..010 | UC-PRE-001 | TA-PRE-006/007 | RSK-013 | PBI-010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-PRE-005 | necessidade energética e metas | aprovado | Amanda/DEC-023 | RN-PRE-011..024 | UC-PRE-002 | TA-PRE-008..016 | RSK-013 | PBI-010 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-AUD-001 | auditoria | baseline e refinamentos aprovados | DEC-016/025/026/028..038, D-AUTO-001/002 | RN-AUD-001..017 | UC-AUD-001 | TA-AUD-001..015 | RSK-003/008/012 | PBI-005 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-BKP-001 | criar backup | aprovado | entrevista 01 | RN-BKP-001..005 | UC-BKP-001 | TA-BKP-001/002 | RSK-004/011, ADR-0001 | PBI-006 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-BKP-002 | restaurar backup | aprovado | entrevista 01 | RN-BKP-005..007 | UC-BKP-002 | TA-BKP-003/004 | RSK-004, ADR-0001 | PBI-006 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |
| RF-BKP-003 | estado do backup | aprovado | entrevista 01 | RN-BKP-001..004 | UC-BKP-001 | TA-BKP-005 | RSK-004/011 | PBI-006 | [Parcial — candidato 0.1.0](../../.harness/evidence/health-increment/2026-10-06-candidate.md) |

Itens propostos do restante do MVP aparecem no [catálogo funcional](functional-requirements.md#backlog-do-restante-do-mvp-saúde) e só entram nesta matriz quando tiverem baseline suficiente.


## Trilha operacional do updater piloto

RF-UPD-001 / DEC-050 → T101–T105 → src-tauri/src/update.rs, service.rs, src/UpdatePanel.tsx e scripts de release. Testes locais: autorização/backup/bloqueio em tests.rs, origem/versão em update.rs, assinatura/manifesto/checksums em pilot-release.test.mjs e versão em prepare-pilot.test.mjs. Evidência: .harness/evidence/update-pilot/2026-10-07-product-preparation.md. UPD-001–UPD-015 permanecem sujeitos aos ensaios integrados; código construído não comprova publicação ou instalação real.

A atualização frequente é uma decisão operacional e arquitetural, não um requisito clínico novo do primeiro incremento.

| Decisão/tarefa | Artefato | Testes/evidência | Gate |
|---|---|---|---|
| DEC-043 / ADR-0002 | docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md | T075–T080; .harness/evidence/update-pilot/ | aprovação sensível e G5 |
| Canal piloto e estável | docs/operations/update-release-strategy.md; docs/operations/update-manifest-contract.md | UPD-001, UPD-013, UPD-014 | G5/G7 |
| Assinatura e custódia | docs/security/update-signing.md | UPD-002, UPD-015 | aprovação sensível |
| Pipeline e runner | docs/operations/update-pipeline-design.md; docs/architecture/update-component-inventory.md | UPD-003, UPD-004, UPD-010, UPD-011 | aprovação sensível e G5 |
| Backup/migração/retorno | docs/quality/update-spike-test-plan.md | UPD-007, UPD-008, UPD-009, UPD-012 | G5/G6 |

## Refinamento de uso do MVP — 2026-10-06

| Requisito | Aprovação | Implementação | Tarefas/testes | Estado |
|---|---|---|---|---|
| RF-UX-001 — tour no primeiro acesso, indicativos e Pular | Maycon, DEC-046; critérios em specs/001-primeiro-incremento-saude/spec.md | src/GuidedTour.tsx, src/onboarding.ts, src/App.tsx, src/EnergyForm.tsx, src-tauri/src/service.rs | T084–T087; tests/unit/onboarding.test.ts; tests::integration::tours_require_authorization_and_persist_per_user_without_migration | código e testes automatizados verificados; inspeção visual/aceite Windows 10 pendentes |


RN-AUT-001 revisada por Maycon na DEC-047 (2026-10-07): mínimo de seis caracteres nas senhas de acesso. T088–T090; src-tauri/src/security.rs, src/App.tsx, src/onboarding.ts; teste de integração six_character_access_passwords_work_and_recovery_remains_twelve. Recuperação permanece doze, sem alteração de schema/criptografia.


RF-DIS-001 aprovado por Maycon, DEC-048 (2026-10-07): detectar instalação e oferecer atualização manual clara. T091–T093; src-tauri/installer/PortugueseBR.nsh, src-tauri/tauri.conf.json e template NSIS gerado oficial. Checks/template/build em .harness/evidence/health-increment/2026-10-07-installer-update.md; preservação de dados após atualização e fluxo gráfico no alvo pendentes.

RF-UX-002 / DEC-049 -> TA-UX-002 -> T098–T100 -> src/LoginInfo.tsx, src/App.tsx, src/style.css -> .harness/evidence/health-increment/2026-10-07-login-info.md. Construído localmente; ensaio Windows/revisão independente pendentes. O candidato de catálogo 0.1.4 anterior não contém este refinamento.
RF-UPD-001 / DEC-051 / TA-UPD-UI-001 → T106/T107, UpdatePanel.tsx e style.css; refinamento para modal nativo com blur. Evidência .harness/evidence/update-pilot/2026-10-07-update-modal.md. Não altera proteção backend, assinatura, publicação ou schema.

RF-AUT-004 / DEC-052 -> TA-AUT-005 -> T108–T110 -> src/App.tsx, src/style.css, src-tauri/src/service.rs e src-tauri/src/tests.rs (remembered_login_is_opt_in_authorized_and_scoped_without_credentials) -> .harness/evidence/health-increment/2026-10-07-remember-login.md. Candidato local 0.1.7; aceite Windows pendente.
RF-UPD-001 / DEC-053 / TA-UPD-UI-002 → T112/T113, UpdatePanel.tsx/App.tsx/style.css, update-check.ts e tests/unit/update-check.test.ts; workflow habilitado localmente, runner-env.ps1 prepara ferramentas por conta. Evidência .harness/evidence/update-pilot/2026-10-07-banner-activation.md. Substitui apresentação em modal, sem invalidar histórico de builds.


## WEBFIT-4 — Navegação do Consultório

RF-UX-003 / DEC-055 → TA-UX-NAV-001..008 → specs/002-webfit-4-navegacao-consultorio/spec.md, plan.md, tasks.md (T001..T017). Implementação: src/App.tsx, src/style.css, src/onboarding.ts, src/GuidedTour.tsx; regressão tests/unit/onboarding.test.ts. Estado: implementado localmente em 0.1.8; checks e review de código PASS, aceite visual/integrado pendente. HEAD-base adcf693ffbb9f2658390b93c9682c54e67f78a0b, branch observada main sob DEC-054. Evidência de planejamento: .harness/evidence/webfit-4/2026-10-07-planning.md; verificação/review/entrega em .harness/evidence/webfit-4/{verification,review,evidence}.md.
