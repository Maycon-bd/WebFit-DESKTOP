# Registro de decisões

Este registro consolida decisões e pendências. ADRs detalham decisões arquiteturais; itens pendentes não autorizam implementação.

## Template de decisão

| Campo | Preenchimento |
|---|---|
| ID e título | identificador estável e frase objetiva |
| Data | `AAAA-MM-DD` |
| Status | proposta, aprovada, rejeitada ou substituída |
| Decisor | pessoa ou papel com autoridade |
| Contexto | problema e restrições |
| Decisão | escolha explícita |
| Alternativas | opções consideradas |
| Consequências | benefícios, custos e riscos |
| Evidências | links para pesquisa, spike, requisito ou ADR |

## Decisões registradas

| ID | Decisão | Status | Fonte/evidência |
|---|---|---|---|
| DEC-001 | criar novo repositório chamado WebFit Desktop | aprovada | [contexto](context.md#decisões-vigentes) |
| DEC-002 | pausar o desenvolvimento do WebFit Web | aprovada | [contexto](context.md#decisões-vigentes) |
| DEC-003 | usar Tauri 2 como shell desktop | proposta aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-004 | manter React + TypeScript + Vite | proposta aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-005 | usar SQLite nativo como banco local | proposta aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-006 | usar Rust como fronteira de domínio e persistência | proposta aprovada para spike | [ADR-0001](../architecture/adr/ADR-0001-desktop-tauri-sqlite.md) |
| DEC-007 | não copiar documentação técnica web como verdade vigente | aprovada | [contexto](context.md#decisões-vigentes) |
| DEC-008 | importar somente funcionalidade e comportamento validados | aprovada | [manifesto](legacy-import-manifest.md) |
| DEC-009 | conduzir desenvolvimento por requisitos rastreáveis e gates | aprovada | [ciclo de desenvolvimento](development-lifecycle.md) |
| DEC-010 | adotar Git Flow com `main` e `develop` como ramos permanentes | aprovada | [fluxo Git](git-workflow.md) |

## Decisões pendentes

| Assunto | Pergunta a decidir | Decisor | Prazo/gate | Estado |
|---|---|---|---|---|
| Autoridade | quem aprova visão, escopo, requisitos, prioridades e aceite? | a identificar | G1 | aberta |
| Usuário principal | nutricionista autônomo é o usuário principal? | responsável pelo produto | G1 | aberta |
| Escopo | quais itens entram e não entram no MVP? | responsável pelo produto | G1 | aberta |
| Clínica | uma instalação atende uma ou várias clínicas? | responsável pelo produto | G1/G2 | aberta |
| Usuários | haverá um ou vários usuários locais e quais papéis? | produto e segurança | G1/G2 | aberta |
| Permissões | quais ações cada papel pode executar? | produto e segurança | G2/G4 | aberta |
| Pacientes | CPF, gênero, busca, arquivamento, restauração e eliminação | produto e jurídico/privacidade | G2 | aberta |
| Agenda | estado inicial, transições, conclusão, conflito e modalidade online | responsável pelo produto | G2 | aberta |
| Prontuário | versionamento, campos estruturados e poderes de alteração/consulta | produto e privacidade | G2 | aberta |
| Antropometria | medidas, protocolos, fórmulas e persistência de cálculos | especialista de domínio | G2 | aberta |
| Prescrição | estrutura, estados, alteração após emissão e validade documental | especialista de domínio | G2 | aberta |
| Financeiro | cobrança automática, estado inicial, despesas e relatórios | responsável pelo produto | G2 | aberta |
| Arquivos/documentos | documentos prioritários, assinatura e retenção | produto e jurídico/privacidade | G1/G2 | aberta |
| Auditoria | acesso, eventos, motivos e retenção | produto e segurança | G2/G4 | aberta |
| Backup | RPO/RTO, frequência, retenção, destinos, criptografia e automação | produto e responsável técnico | G2/G4 | aberta |
| Arquitetura | Tauri/Rust/SQLite satisfaz os critérios do spike? | responsável técnico e produto | G4 | proposta |
| Proteção local | SQLCipher e armazenamento de chaves são viáveis ou qual alternativa será aceita? | segurança e responsável técnico | G4 | aberta |
| Repositório | qual pasta será a raiz definitiva e quando inicializar o Git? | responsável pelo projeto | antes da colaboração/versionamento | aberta |

Novas decisões devem registrar a resposta, autoridade, data, justificativa e impacto. Não substitua perguntas abertas por suposições.
