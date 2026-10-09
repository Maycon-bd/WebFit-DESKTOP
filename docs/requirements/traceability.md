# Matriz de rastreabilidade

D-LIC-009 ACCEPTED → RF-LIC-001/RN-LIC-001 → TA-LIC-013..016 → T-LIC-012..015 ([registro](../../specs/WEBFIT-10/task.md)). Protocolo `issue_initial_code`/`verify_initial_code` e teste; emissor `IssueInitialCode` e teste; backend `ActivateLicenseCode`/`import_initial_code` e integração SQLite de atomicidade/identidade/contas/repetição/dois destinos; UI `LicensePanel.tsx`/emissor. Candidato clínico 0.1.10 e emissor 0.1.1; artefatos/checks não comprovam aceite. Operação: [manual do emissor](../../tools/license-issuer/README.md).

## WEBFIT-10 — licenciamento offline

DEC-058 / ADR-0003 v1 ACCEPTED → RF-LIC-001..005 → RN-LIC-001..007 → UC-LIC-001..005 → TA-LIC-001..011 → T-LIC-001..009/011 no [registro único](../../specs/WEBFIT-10/task.md). RF-LIC-006/RN-LIC-008/UC-LIC-006/TA-LIC-012/T-LIC-010 adiados por Maycon, sem item extra. Aprovação específica: “Aprovo a implementação”, D-LIC-006..008 e P-LIC-001; main/680fad5616d54a895dbecc6702595a1b5d232cfd, candidato local 0.1.8, sem distribuição.

Implementação: `crates/license-protocol/` (TA-LIC-003/005), `src-tauri/src/license.rs`, `service.rs`, `license_tests.rs` e `migrations/002_license.sql` (TA-LIC-001..004/007..010), `recovery.rs` (TA-LIC-006/009/010), `src/LicensePanel.tsx`/`App.tsx` (TA-LIC-011), `tools/license-issuer/` (TA-LIC-005). Testes Rust/SQLite fictícios distinguem consumo, destino, restauro, acesso antigo, reinício/limite e falha de backup. Checks/comandos finais, ensaio Windows e review independente devem ser lidos no registro, sem inferir aceite por esta matriz.


## WEBFIT-8 — identidade visual

RF-UX-004 / DEC-056 → TA-UX-BRAND-001..004 → specs/005-webfit-8-identidade-visual/{spec,plan,tasks}.md (T001..T008) → public/brand/webfit-icon.png, src/App.tsx, src/LoginInfo.tsx, src/style.css, index.html, src-tauri/icons/** e tauri.conf.json → .harness/evidence/webfit-8/{verification,evidence}.md. Versão 0.1.8, base e07cdc8300de0421dbdc7fd64aafe7d30a191e80, main. Checks locais separados de aceite Windows/review independente.

## WEBFIT-5 — Planejamento do cadastro mínimo

RF-PAT-007 (proposto) -> TA-PAT-008..016 -> [spec/plan/tasks](../../specs/003-webfit-5-cadastro-paciente/spec.md), T001..T015. Branch main, HEAD-base a83998ef33c032ea46e283322bbf7620c0051d49, candidato base 0.1.8. Preparação autorizada; implementação, testes de comportamento, aprovação funcional conjunta e D-PAT-001/002 pendentes. Evidência: [planejamento](../../.harness/evidence/webfit-5/planning.md). Baseline RF-PAT-001/003 e RN-PAT-001/003/005/006 ainda não substituída.

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

Complemento RF-AUD-001 → TA-AUD-001..015 → T051/T056 parciais em 2026-10-07: src/App.tsx, src/audit-view.ts e tests/unit/audit-view.test.ts. Estados de consulta, filtros/retry, detalhes de metadados e foco. Checks frontend/Rust aprovados; ensaio integrado e revisão pendentes. Evidência .harness/evidence/health-increment/2026-10-07-audit-ui.md. Não representa execução integral dos critérios TA-AUD.

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

## WEBFIT-9

RF-UPD-001 / aprovação de implementação Maycon 2026-10-08 -> specs/006-webfit-9-faixa-atualizacao/{spec,plan,tasks}.md -> T003..T007 -> src/update-check.ts, UpdatePanel.tsx, App.tsx, style.css -> tests/unit/update-check.test.ts e TA-UPD-UI-003..006 -> .harness/evidence/webfit-9/. Backend backup/assinatura/bloqueios existente intacto. Gate final/ensaio Windows não inferidos.

## WEBFIT-7 — recuperação contextual de rascunhos

RF-DRF-002 / RN-DRF-006..007 / UC-DRF-001 / TA-DRF-005..010 → [Specification](../../specs/007-recuperar-rascunho-contextual/spec.md), Plan e Tasks WEBFIT-7 → alteração localizada de src/App.tsx/DraftRecoveryDialog.tsx/style.css e critérios de aceite → Verification/Review/Evidence em `.harness/evidence/webfit-7/`. Branch main, HEAD-base e07cdc8300de0421dbdc7fd64aafe7d30a191e80. Implementação autorizada por Maycon; aceite funcional final e G5/G6/G7 permanecem separados.

## Refinamentos de apresentação V01–V08 — 2026-10-08

RF-UX-003/004 → V01-AC01..03 e V04-AC01..03; RF-PAT-001/003 + RF-CLI-001 → V02-AC01..03 e V03-AC01..03 (WEBFIT-12, FormFeedback + 3 regressões); RF-PAT-003/DRF-001/002 → V06-AC01..03; RF-AUD-001/UPD-001 → V07-AC01..03; RF-PAT-005 → V08-AC01..03. Implementação local main/680fad5, fonte 0.1.8; evidência parcial estática/SSR/checks e ensaios pendentes por item no [índice](../../specs/ui-audit-2026-10-08/README.md#execução-sequencial--2026-10-08). RF-DRF-002 → V05 / WEBFIT-13 BLOCKED, decisão prévia antes de alterar TA-DRF-010; critérios continuam propostos. Sem aprovação/implementação de RF-PAT-007, aceite funcional ou Gate final inferido.

Refinamento posterior RF-DRF-002/TA-DRF-010 → V05-AC01..03 / WEBFIT-13 / D-DRF-EXIT-001 ACCEPTED (Maycon, 2026-10-08) → src/App.tsx, src/DraftRecoveryDialog.tsx e tests/unit/draft-recovery.test.ts (3 testes de callbacks/destinos/preservação). Bloqueio anterior resolvido; checks e limites no [V05](../../specs/ui-audit-2026-10-08/V05-saida-recuperacao/spec.md). Ensaios WebView/teclado/reentrada/reinício e revisão independente pendentes.
