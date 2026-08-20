# Registro de decisões

Este registro consolida decisões e pendências. ADRs detalham decisões arquiteturais; itens pendentes não autorizam implementação.

## Decisões registradas

| ID | Decisão | Status | Fonte/evidência |
|---|---|---|---|
| DEC-001 | criar novo repositório chamado WebFit Desktop | aprovada | [contexto](context.md) |
| DEC-002 | pausar o desenvolvimento do WebFit Web | aprovada | [contexto](context.md) |
| DEC-003 | usar Tauri 2 como shell desktop | aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-004 | manter React, TypeScript e Vite | aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-005 | usar SQLite nativo como banco local | aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-006 | usar Rust como fronteira de domínio e persistência | aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-007 | não copiar documentação técnica web como verdade vigente | aprovada | [contexto](context.md) |
| DEC-008 | importar somente funcionalidade e comportamento validados | aprovada | [manifesto](legacy-import-manifest.md) |
| DEC-009 | conduzir desenvolvimento por requisitos rastreáveis e gates | aprovada | [ciclo](development-lifecycle.md) |
| DEC-010 | adotar Git Flow com `main` e `develop` permanentes | aprovada | [fluxo Git](git-workflow.md) |
| DEC-011 | usar `Maycon-bd/WebFit-DESKTOP` como repositório oficial | aprovada | [GitHub](https://github.com/Maycon-bd/WebFit-DESKTOP) |
| DEC-012 | Amanda aprova domínio e aceite; Maycon atua como PO e responsável técnico | aprovada | [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-013 | aprovar o Gate G1 para o MVP Saúde | aprovada em 2026-08-20 | [escopo](../product/scope.md) |
| DEC-014 | estruturar espaços Saúde e Educação, implementando apenas Saúde no MVP | aprovada | [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-015 | vincular o perfil profissional ao usuário | aprovada | [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-016 | admitir nutricionista e administrador, ambos com acesso total | aprovada | decisão Maycon/Amanda |
| DEC-017 | exigir senha mínima de oito caracteres e espera progressiva | aprovada | decisão Maycon/Amanda |
| DEC-018 | incluir autenticação, auditoria, pacientes e backup mínimo no primeiro incremento | aprovada | [escopo](../product/scope.md) |
| DEC-019 | adotar backup diário e manual, retenção de 60 dias, RPO de 24 horas e RTO até o próximo dia útil | aprovada | [entrevista 01](stakeholder-interview-round-01.md) |
| DEC-020 | manter conectividade para atualização, recuperação remota e nuvem fora do MVP, sujeita a ADR | aprovada | decisão Maycon/Amanda |
| DEC-021 | incluir prescrição e cardápio individual no primeiro incremento, sem PDF ou exportação | aprovada | [status operacional](status.md) |

## Decisões pendentes

| Assunto | Pergunta a decidir | Decisor | Gate | Estado |
|---|---|---|---|---|
| Fórmulas clínicas | quais protocolos, fontes e fórmulas de energia, macro e micronutrientes serão usados? | Amanda | G2 do incremento clínico | aberta |
| Alimentos | qual base nutricional e política de atualização serão adotadas? | Amanda e Maycon | G2/G4 do incremento de cardápio | aberta |
| Documentos | quais documentos A4 serão prioritários e quais dados/assinaturas exigem? | Amanda | G2 | aberta |
| Retenção clínica | qual política legal definitiva de retenção e eliminação? | produto e assessoria adequada | antes de G7 | aberta |
| Migração | existe fonte confiável para os 80 pacientes? | Amanda e Maycon | antes da migração | aberta |
| Backup externo | pen drive ou SSD e rotina operacional definitiva | Amanda | antes de G7 | aberta |
| Proteção local | SQLCipher, chaves e proteção dos backups são viáveis? | Maycon | G4 | aberta |
| Educação | atores, entidades, regras, escopo e prioridade | Amanda e Maycon | novo ciclo G1/G2 | adiada |
| Serviços conectados | arquitetura, segurança, custos e privacidade de atualização, reset remoto e nuvem | Amanda e Maycon | ADR futuro | adiada |

Novas decisões devem registrar autoridade, data, justificativa, consequências e evidência.
