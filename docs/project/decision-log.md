# Registro de decisões

Este registro consolida decisões e pendências. ADRs detalham decisões arquiteturais; itens pendentes não autorizam implementação. `ACCEPTED` vale somente para o escopo registrado na decisão e em sua evidência; em particular, DEC-003 a DEC-006 permanecem aceitas apenas para spike, não para produção.

## Decisões registradas

| ID | Decisão | Status | Fonte/evidência |
|---|---|---|---|
| DEC-001 | criar novo repositório chamado WebFit Desktop | ACCEPTED | validação histórica: aprovada; [contexto](context.md) |
| DEC-002 | pausar o desenvolvimento do WebFit Web | ACCEPTED | validação histórica: aprovada; [contexto](context.md) |
| DEC-003 | usar Tauri 2 como shell desktop | ACCEPTED | validação histórica: aprovada para spike; [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-004 | manter React, TypeScript e Vite | ACCEPTED | validação histórica: aprovada para spike; [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-005 | usar SQLite nativo como banco local | ACCEPTED | validação histórica: aprovada para spike; [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-006 | usar Rust como fronteira de domínio e persistência | ACCEPTED | validação histórica: aprovada para spike; [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-007 | não copiar documentação técnica web como verdade vigente | ACCEPTED | validação histórica: aprovada; [contexto](context.md) |
| DEC-008 | importar somente funcionalidade e comportamento validados | ACCEPTED | validação histórica: aprovada; [manifesto](legacy-import-manifest.md) |
| DEC-009 | conduzir desenvolvimento por requisitos rastreáveis e gates | ACCEPTED | validação histórica: aprovada; [ciclo](development-lifecycle.md) |
| DEC-010 | adotar Git Flow com `main` e `develop` permanentes | ACCEPTED | validação histórica: aprovada; [fluxo Git](git-workflow.md) |
| DEC-011 | usar `Maycon-bd/WebFit-DESKTOP` como repositório oficial | ACCEPTED | validação histórica: aprovada; [GitHub](https://github.com/Maycon-bd/WebFit-DESKTOP) |
| DEC-012 | Amanda aprova domínio e aceite; Maycon atua como PO e responsável técnico | ACCEPTED | validação histórica: aprovada; [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-013 | aprovar o Gate G1 para o MVP Saúde | ACCEPTED | validação histórica: aprovada em 2026-08-20; [escopo](../product/scope.md) |
| DEC-014 | estruturar espaços Saúde e Educação, implementando apenas Saúde no MVP | ACCEPTED | validação histórica: aprovada; [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-015 | vincular o perfil profissional ao usuário | ACCEPTED | validação histórica: aprovada; [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-016 | admitir nutricionista e administrador, ambos com acesso total | ACCEPTED | validação histórica: aprovada; decisão Maycon/Amanda |
| DEC-017 | exigir senha mínima de oito caracteres e espera progressiva | ACCEPTED | validação histórica: aprovada; decisão Maycon/Amanda |
| DEC-018 | incluir autenticação, auditoria, pacientes e backup mínimo no primeiro incremento | ACCEPTED | validação histórica: aprovada; [escopo](../product/scope.md) |
| DEC-019 | adotar backup diário e manual, retenção de 60 dias, RPO de 24 horas e RTO até o próximo dia útil | ACCEPTED | validação histórica: aprovada; [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-020 | manter conectividade para atualização, recuperação remota e nuvem fora do MVP, sujeita a ADR | ACCEPTED | validação histórica: aprovada; decisão Maycon/Amanda |
| DEC-021 | incluir prescrição e cardápio individual no primeiro incremento, sem PDF ou exportação | ACCEPTED | validação histórica: aprovada; [status operacional](status.md) |
| DEC-022 | adotar TBCA 7.3 como fonte principal, TACO como fallback, gramas como base, micronutrientes iniciais e versões imutáveis | ACCEPTED | validação histórica: aprovada por Amanda em 2026-08-21; [status operacional](status.md) |
| DEC-023 | adotar Harris-Benedict revisada de Roza e Shizgal (1984), EER/DRI 2023 por ciclo de vida, ajuste ponderal estimado por coeficiente configurável de 7.800 kcal/kg, metas de macros e fibras, alertas e substituição manual rastreável | ACCEPTED | validação histórica: aprovada por Amanda em 2026-09-10; [decisões clínicas de energia](energy-planning-decisions-2026-08-21.md) |
| DEC-024 | aplicar rascunho automático a todos os formulários longos do incremento e distingui-lo do estado rascunho persistente da prescrição | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; [status operacional](status.md) |
| DEC-025 | manter a trilha de auditoria por tempo indeterminado no MVP, sem exclusão automática, até aprovação de política legal de retenção | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; [status operacional](status.md) |
| DEC-026 | impedir conclusão de operação crítica ou autenticação bem-sucedida quando o evento obrigatório de auditoria não puder ser persistido | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; [status operacional](status.md) |
| DEC-027 | planejar uma infraestrutura privada de arquivos com base clínica por paciente no incremento 4 e biblioteca profissional em evolução posterior | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; [planejamento de arquivos](files-and-documents-planning.md) |
| DEC-028 | consultar auditoria com filtros combináveis por período, usuário, ação, tipo de entidade e resultado, usando AND; módulo, origem, identificador específico e texto livre ficam fora do incremento 1 | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-029 | ordenar a consulta de auditoria de forma fixa do evento mais recente para o mais antigo no incremento 1 | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-030 | paginar a consulta de auditoria na camada autorizada de backend, com 50 registros por página, sem carregar toda a trilha na interface | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-031 | abrir a auditoria com os últimos 30 dias e permitir mudança do período, mantendo instantes em UTC e limites determinísticos sem duplicidade ou perda | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-032 | usar catálogo controlado de ação, tipo de entidade e resultado; resultados iniciais são SUCCESS, FAILURE e DENIED | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-033 | persistir somente tipo e identificador da entidade; resolver rótulo atual apenas sob autorização e usar tipo/ID como fallback, sem duplicar dado sensível | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-034 | não persistir dados anteriores/posteriores nem snapshots no evento de auditoria; históricos pertencem ao domínio relacionado | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-035 | oferecer lista, filtros, paginação e detalhe de metadados da auditoria; edição, exclusão e exportação ficam fora do incremento 1 | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-036 | auditar abertura do módulo e detalhe de evento, sem auditar filtro, página ou ordenação; o registro do acesso não inclui conteúdo exibido nem gera recursão | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-037 | distinguir estado sem eventos, nenhum resultado e falha de consulta; falha não aparece como lista vazia e permite nova tentativa quando recuperável | ACCEPTED | validação histórica: aprovada por Maycon em 2026-09-10; decisão de fechamento de UC-AUD-001 |
| DEC-038 | adotar no harness o modelo AUTONOMOUS DECISION WITH HUMAN VALIDATION, com matriz confiança × impacto, decisões AGENT-PROVISIONAL, ASK-FIRST para temas sensíveis e validação humana em lote | ACCEPTED | validada por Maycon em 2026-09-10; solicitação de atualização do harness |

## Decisões pendentes

| Assunto | Pergunta a decidir | Decisor | Gate | Estado |
|---|---|---|---|---|
| Alimentos | TBCA 7.3 principal e TACO fallback; política de atualização técnica será definida no G4 | Amanda e Maycon | G4 | parcialmente resolvida |
| Auditoria | como representar atores sem usuário autenticado, como sistema e tentativa de login desconhecida? | Amanda e Maycon | G4, antes do schema físico | consulta resolvida por DEC-028 a DEC-037; detalhe técnico do ator não bloqueia UC-AUD-001 |
| Arquivos e biblioteca | quais limites, categorias, duplicidade, miniaturas e política de retenção usar? | Amanda e Maycon | discovery do incremento 4 e evolução posterior | proposta registrada |
| Documentos | quais documentos A4 serão prioritários e quais dados/assinaturas exigem? | Amanda | G2 | aberta |
| Retenção clínica | qual política legal definitiva de retenção e eliminação? | produto e assessoria adequada | antes de G7 | aberta |
| Migração | existe fonte confiável para os 80 pacientes? | Amanda e Maycon | antes da migração | aberta |
| Backup externo | pen drive ou SSD e rotina operacional definitiva | Amanda | antes de G7 | aberta |
| Proteção local | SQLCipher, chaves e proteção dos backups são viáveis? | Maycon | G4 | aberta |
| Educação | atores, entidades, regras, escopo e prioridade | Amanda e Maycon | novo ciclo G1/G2 | adiada |
| Serviços conectados | arquitetura, segurança, custos e privacidade de atualização, reset remoto e nuvem | Amanda e Maycon | ADR futuro | adiada |

Novas decisões devem usar os estados `ACCEPTED`, `AGENT-PROVISIONAL`, `NEEDS-HUMAN-DECISION`, `REJECTED` ou `SUPERSEDED` e registrar autoridade, data, justificativa, consequências, evidência, confiança, impacto e reversibilidade quando aplicável.
