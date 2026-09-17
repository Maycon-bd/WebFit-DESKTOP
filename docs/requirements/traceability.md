# Matriz de rastreabilidade

**Status:** baseline do primeiro incremento preenchida; evidência de execução ainda pendente.

| Requisito | Título | Status | Fonte | Regras | Caso de uso | Testes | Riscos/ADR | Backlog | Evidência |
|---|---|---|---|---|---|---|---|---|---|
| RF-AUT-001 | primeiro acesso e usuários | aprovado | entrevista 01 | RN-AUT-001/002 | UC-AUT-001 | TA-AUT-001 | RSK-003/008, ADR-0001 | PBI-002 | PENDENTE |
| RF-AUT-002 | autenticar, sair e bloquear | aprovado | entrevista 01 | RN-AUT-001..004 | UC-AUT-001 | TA-AUT-002/003 | RSK-003/008, ADR-0001 | PBI-002 | PENDENTE |
| RF-AUT-003 | reset administrativo | aprovado | entrevista 01 | RN-AUT-005 | UC-AUT-002 | TA-AUT-004 | RSK-008/009 | PBI-002 | PENDENTE |
| RF-CLI-001 | perfil profissional | aprovado | entrevista 01 | RN-CLI-001/003 | UC-CLI-001 | TA-CLI-001 | RSK-003/008 | PBI-003 | PENDENTE |
| RF-CLI-002 | espaço Saúde | aprovado | DEC-014/015 | RN-CLI-001/002 | UC-AUT-001 | TA-CLI-002 | RSK-010 | PBI-003 | PENDENTE |
| RF-PAT-001 | cadastrar paciente | aprovado | entrevista 01 | RN-PAT-001..006 | UC-PAT-001 | TA-PAT-001/002 | RSK-003/005/008 | PBI-004 | PENDENTE |
| RF-PAT-002 | pesquisar e abrir | aprovado | entrevista 01 | RN-PAT-007 | UC-PAT-002 | TA-PAT-003 | RSK-003/008 | PBI-004 | PENDENTE |
| RF-PAT-003 | editar paciente | aprovado | entrevista 01 | RN-PAT-001..006, RN-AUD-001 | UC-PAT-002 | TA-PAT-004 | RSK-003/008 | PBI-004 | PENDENTE |
| RF-PAT-004 | arquivar/restaurar | aprovado | entrevista 01 | RN-PAT-008/009 | UC-PAT-003 | TA-PAT-005 | RSK-005 | PBI-004 | PENDENTE |
| RF-PAT-005 | tags | aprovado | entrevista 01 | RN-PAT-010 | UC-PAT-001 | TA-PAT-006 | RSK-005 | PBI-004 | PENDENTE |
| RF-PAT-006 | rascunho de paciente | aprovado | entrevista 01/DEC-024 | RN-DRF-001..005 | UC-DRF-001 | TA-PAT-007/TA-DRF-001..004 | RSK-003 | PBI-004 | PENDENTE |
| RF-DRF-001 | proteger formulários longos | aprovado | Maycon/DEC-024 | RN-DRF-001..005 | UC-DRF-001 | TA-DRF-001..004/TA-PAT-007 | RSK-003 | PBI-003/004/010 | PENDENTE |
| RF-PRE-001 | criar prescrição | aprovado | Amanda/DEC-022 | RN-PRE-001/008..010 | UC-PRE-001 | TA-PRE-001/006 | RSK-013 | PBI-010 | PENDENTE |
| RF-PRE-002 | refeições, alimentos e porções | aprovado | Amanda/DEC-022 | RN-PRE-001..005 | UC-PRE-001 | TA-PRE-002/004 | RSK-013 | PBI-010 | PENDENTE |
| RF-PRE-003 | composição nutricional | aprovado | Amanda/DEC-022 | RN-PRE-006/007 | UC-PRE-001 | TA-PRE-003/005 | RSK-013 | PBI-010 | PENDENTE |
| RF-PRE-004 | versões e histórico | aprovado | Amanda/DEC-022 | RN-PRE-008..010 | UC-PRE-001 | TA-PRE-006/007 | RSK-013 | PBI-010 | PENDENTE |
| RF-PRE-005 | necessidade energética e metas | aprovado | Amanda/DEC-023 | RN-PRE-011..024 | UC-PRE-002 | TA-PRE-008..016 | RSK-013 | PBI-010 | PENDENTE |
| RF-AUD-001 | auditoria | baseline e refinamentos aprovados | DEC-016/025/026/028..038, D-AUTO-001/002 | RN-AUD-001..017 | UC-AUD-001 | TA-AUD-001..015 | RSK-003/008/012 | PBI-005 | PENDENTE |
| RF-BKP-001 | criar backup | aprovado | entrevista 01 | RN-BKP-001..005 | UC-BKP-001 | TA-BKP-001/002 | RSK-004/011, ADR-0001 | PBI-006 | PENDENTE |
| RF-BKP-002 | restaurar backup | aprovado | entrevista 01 | RN-BKP-005..007 | UC-BKP-002 | TA-BKP-003/004 | RSK-004, ADR-0001 | PBI-006 | PENDENTE |
| RF-BKP-003 | estado do backup | aprovado | entrevista 01 | RN-BKP-001..004 | UC-BKP-001 | TA-BKP-005 | RSK-004/011 | PBI-006 | PENDENTE |

Itens propostos do restante do MVP aparecem no [catálogo funcional](functional-requirements.md#backlog-do-restante-do-mvp-saúde) e só entram nesta matriz quando tiverem baseline suficiente.
