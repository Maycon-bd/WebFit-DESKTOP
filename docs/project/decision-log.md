# Registro de decisões

Este registro consolida decisões e pendências. ADRs detalham decisões arquiteturais; itens pendentes não autorizam implementação. `ACCEPTED` vale somente para o escopo registrado na decisão e em sua evidência. DEC-003 a DEC-006 registram a autorização histórica do spike; a direção de produção foi aceita posteriormente por DEC-042 e pelo ADR-0001.

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
| DEC-017 | exigir senha mínima de oito caracteres e espera progressiva | PARTIALLY SUPERSEDED | mínimo substituído por seis na DEC-047; espera progressiva preservada; aprovação histórica Maycon/Amanda |
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
| DEC-039 | integrar Spec Kit como fonte operacional de SDD, preservar o harness para governança e gates independentes e usar `$project-task` como entrypoint sem modificar as skills oficiais | ACCEPTED | aprovada por Maycon em 2026-09-11; solicitação de integração Spec Kit ↔ harness |
| DEC-040 | adotar SQLCipher como direção de proteção do banco local e gerar uma chave aleatória por instalação protegida pelo DPAPI `CurrentUser` | ACCEPTED | aprovada por Maycon em 2026-09-17; validação no spike G4 e [evidência](../../.harness/evidence/g4-spike-2026-09-17.md); não representa aceitação integral do ADR de produção |

## DEC-041 — backup portátil e custódia administrativa

- **Status:** ACCEPTED.
- **Decisão:** o backup portátil deve conter banco criptografado, chave do backup encapsulada/protegida, manifesto, checksum e metadados. A recuperação em outra instalação exige credencial administrativa separada; a chave não será enviada em texto puro.
- **Escopo:** direção aprovada para o spike e para detalhamento posterior; autenticação, autorização, rotação, recuperação de credencial e integração real de nuvem permanecem pendentes.
- **Aprovação:** Maycon, em 2026-09-17.
- **Evidência:** teste `portable_backup`, com nuvem simulada, restauração separada, auditoria SUCCESS/DENIED e ausência de segredo no log.

## DEC-042 — política sem custo recorrente e fechamento do G4

- **Status:** ACCEPTED.
- **Decisão:** operar local/offline, com custo recorrente obrigatório de R$ 0, SQLCipher Community com avisos de licença, chave local protegida por DPAPI `CurrentUser`, backup local/portátil, credencial de recuperação offline sob custódia de Maycon, NSIS e atualizações manuais no escopo vigente.
- **Arquitetura:** aceitar o ADR-0001 como direção de produção e encerrar o G4; a implementação permanece condicionada ao G5.
- **Exclusões no momento da aprovação:** não autoriza nuvem, telemetria, autenticação externa, updater conectado, pipeline de publicação, release ou deploy automático. A estratégia de atualizações foi posteriormente decidida por DEC-043 e ADR-0002.
- **Aprovação:** Maycon, em 2026-09-21.
- **Evidência:** spike G4, `docs/operations/cost-free-operation.md` e confirmação explícita do responsável técnico.

## DEC-043 — estratégia de atualizações frequentes

- **Status:** ACCEPTED.
- **Problema:** permitir que a stakeholder use versões frequentes durante o desenvolvimento sem instalar cada commit e sem arriscar dados clínicos ou migrações.
- **Decisão:** merges revisados na `main` publicam automaticamente o canal piloto. O Tauri Updater assinado mostra um ícone e solicita confirmação; após a confirmação, backup, download, validação, instalação e reinício são automáticos. Não há atualização forçada durante o uso.
- **Custo:** usar runner Windows auto-hospedado e repositório público separado somente para artefatos assinados, `latest.json`, checksums e notas; nenhum código-fonte ou segredo é publicado.
- **Estável:** ativar posteriormente, após G7 e promoção formal.
- **Fonte:** `docs/operations/update-release-strategy.md` e ADR-0002.
- **Decisores:** Maycon para arquitetura/publicação e Amanda para experiência/cadência percebida.

## Decisões provisórias do agente

| ID | Decisão | Status | Fonte/evidência |
|---|---|---|---|
| D-AUTO-001 | representar ator por `USER`, `SYSTEM` ou `UNAUTHENTICATED`, com referência de usuário somente no primeiro caso e sem persistir credencial tentada | ACCEPTED | revisão de UC-AUD-001 em 2026-09-11; aprovação conjunta de Maycon e Amanda em 2026-09-17 |
| D-AUTO-002 | usar janela UTC semiaberta congelada, ordem total por instante/ID e cursor opaco vinculado aos filtros para paginação estável | ACCEPTED | revisão de UC-AUD-001 em 2026-09-11; aprovação conjunta de Maycon e Amanda em 2026-09-17 |

## Decisões pendentes

| Assunto | Pergunta a decidir | Decisor | Gate | Estado |
|---|---|---|---|---|
| Alimentos | TBCA 7.3 principal e TACO fallback; política de atualização técnica será definida no G4 | Amanda e Maycon | G4 | parcialmente resolvida |
| Auditoria | como representar atores sem usuário autenticado, como sistema e tentativa de login desconhecida? | Amanda e Maycon | G4, antes do schema físico | resolvida e aceita em 2026-09-17 por Amanda e Maycon; aplicar no schema após validação do spike |
| Arquivos e biblioteca | quais limites, categorias, duplicidade, miniaturas e política de retenção usar? | Amanda e Maycon | discovery do incremento 4 e evolução posterior | proposta registrada |
| Documentos | quais documentos A4 serão prioritários e quais dados/assinaturas exigem? | Amanda | G2 | aberta |
| Retenção clínica | qual política legal definitiva de retenção e eliminação? | produto e assessoria adequada | antes de G7 | aberta |
| Migração | existe fonte confiável para os 80 pacientes? | Amanda e Maycon | antes da migração | aberta |
| Backup externo | pen drive ou SSD e rotina operacional definitiva | Amanda | antes de G7 | aberta |
| Proteção local | SQLCipher Community, DPAPI `CurrentUser`, backup portátil e política operacional sem custo recorrente | Maycon | G4 | resolvida por DEC-040/041/042 e ADR-0001; detalhes de implementação seguem no G5 |
| Educação | atores, entidades, regras, escopo e prioridade | Amanda e Maycon | novo ciclo G1/G2 | adiada |
| Atualizações conectadas | canais piloto/estável, gatilho na `main`, assinatura, hospedagem e experiência de confirmação | Amanda e Maycon | ADR-0002 | resolvida por DEC-043; spike e implementação pendentes |
| Outros serviços conectados | reset remoto, nuvem e sincronização | Amanda e Maycon | ADR futuro | adiada |

Novas decisões devem usar os estados `ACCEPTED`, `AGENT-PROVISIONAL`, `NEEDS-HUMAN-DECISION`, `REJECTED` ou `SUPERSEDED` e registrar autoridade, data, justificativa, consequências, evidência, confiança, impacto e reversibilidade quando aplicável.

## DEC-044 — priorizar MVP local e adiar atualização automática

- **Status:** ACCEPTED para prioridade técnica e distribuição manual do MVP.
- **Data e autoridade:** Maycon, em 2026-10-06, confirmou “Perfeito, vamos continuar” após a proposta explícita de adiar atualizações automáticas e focar no primeiro fluxo útil para Amanda.
- **Decisão:** instalação e atualização manuais por instalador; runner, publicação automática e updater conectado ficam adiados, sem bloquear a construção do primeiro incremento.
- **Preservação:** SQLCipher/DPAPI, autorização local, backup/restauração e requisitos clínicos aprovados permanecem vigentes. Não reduz proteção de dados nem altera escopo funcional. A preparação existente não será apagada.
- **Consequências:** T082/T083 ficam ADIADOS, sem serem concluídos. Workflow local perde gatilho push e mantém job desativado; nenhuma configuração remota foi alterada. ADR-0002 permanece referência futura, com execução suspensa no MVP por esta decisão. Reativação exige revisão e autorização específica.
- **Limite:** aprovação da repriorização não é aprovação específica de implementação G5, dependências, schema, publicação ou uso clínico real. Experiência futura do updater permanece sujeita à Amanda; esta decisão não atribui nova aprovação a ela.

## DEC-045 — execução do MVP e instalador de teste

- **Status:** ACCEPTED por Maycon em 2026-10-06, resposta “Autorizado” à seleção que descreveu construção do produto, banco/migrações, dependências previstas e ferramentas de compilação (incluindo Perl quando necessário).
- **Implementation Approval G5:** concedida para o primeiro incremento aprovado, fundação e fluxos locais, sem reutilizar o spike como produto.
- **Sensitive Change Approval:** dependências previstas, schema/migrações e controles locais de autenticação/segurança do plano, em ambiente de teste e com dados fictícios.
- **Entrega:** instalador Windows para Maycon instalar no computador de Amanda e comunicar resultados. Windows 10 x64 permanece alvo.
- **Limites:** não autoriza dados clínicos reais, produção, destruição de trabalho existente, commit/push/PR/merge, publicação externa ou ativação de updater; DEC-044 permanece vigente.
- **Fonte:** autorização explícita anotada sobre os três pontos de execução, dados fictícios e instalação no computador da stakeholder.

## DEC-046 — tutoriais simples no MVP

- **Status:** ACCEPTED para o escopo solicitado por Maycon em 2026-10-06: indicativos no primeiro acesso às telas e botão Pular, para aprender enquanto usa.
- **Rastreabilidade:** RF-UX-001, refinamento do incremento Saúde em execução, sem nova arquitetura ou integração externa.
- **Detalhamento AGENT-PROVISIONAL:** preferência por usuário/tela, replay em Ver tutorial e oito tours curtos nas telas autenticadas. Reversível, na tabela settings existente; sem migração, dados clínicos ou dependências adicionais.
- **Limites:** DEC-044/045 preservadas; nenhum gate clínico, publicação ou aceite final inferido desta solicitação.


## DEC-047 — mínimo de seis caracteres para senhas de acesso

- **Status:** ACCEPTED, solicitação explícita de Maycon em 2026-10-07 durante o teste do formulário de preparação da instalação.
- **Decisão:** alterar RN-AUT-001 de oito para seis caracteres nas senhas de acesso do administrador e da nutricionista, incluindo troca e redefinição temporária. Login continua validando o hash da credencial existente.
- **Critérios:** aceitar exatamente seis caracteres, rejeitar cinco ou menos na criação/troca/redefinição, manter hashes Argon2 e compatibilidade com senhas existentes; formulários e tutorial coerentes.
- **Limites:** senha de recuperação dos backups preservada em doze caracteres; sem alteração de schema, criptografia, sessão, bloqueio progressivo, perfis ou dados existentes. Testes somente fictícios. Distribuição manual e gates anteriores preservados.


## DEC-048 — atualização manual clara no instalador

- **Status:** ACCEPTED, Maycon, 2026-10-07: detectar aplicação instalada e oferecer opção explícita de atualização no instalador, sem exigir desinstalação manual.
- **Escopo:** RF-DIS-001, refinamento da distribuição manual vigente (DEC-044), não updater conectado. O NSIS Tauri já detecta registro e compara versões; customizar suas traduções oficiais para apresentar Atualizar mantendo os dados.
- **Critérios:** sem instalação, fluxo de instalação normal; versão anterior, opção Atualizar mantendo os dados que substitui arquivos sem executar desinstalador; mesma versão, Reparar arquivos; identificador, nome e escopo currentUser estáveis; banco SQLCipher/DPAPI e preferências preservados. Confirmar atualização real no alvo com base fictícia.
- **Detalhamento AGENT-PROVISIONAL:** desabilitar substituição direta por versão anterior na configuração Windows, para evitar chamar downgrade de atualização; escolha padrão da página permanece a do NSIS. Não criar template concorrente nem alterar mecanismo de manutenção.
- **Limites:** preservar artefatos/alterações anteriores, dados fictícios e ausência de publicação/commit/push. Nenhuma instalação/desinstalação no host do agente; ensaio Windows 10 por Maycon.


### Complemento da DEC-044/DEC-048 — vigência da distribuição manual

**ACCEPTED por Maycon em 2026-10-07:** até implementar, validar e ativar a atualização automática com pipeline/runner e updater, toda nova versão seguirá a distribuição por instalador. Fechar o aplicativo, executar a nova versão com o mesmo usuário Windows e selecionar Atualizar mantendo os dados, sem desinstalação manual. A instalação prévia do runner não encerra essa política. Não autoriza ativação externa, publicação ou alteração dos gates; somente consolida o procedimento vigente. Fontes: docs/operations/installation.md, update-release-strategy.md e update-pipeline-design.md.
