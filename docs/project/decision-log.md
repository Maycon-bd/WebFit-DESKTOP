# Registro de decisões

## DEC-059 — Painel administrativo pessoal integrado

**ACCEPTED para implementação por Maycon, 2026-10-09**, [WEBFIT-16](../../specs/WEBFIT-16/task.md). Senha mestra única para painel/emissor/manutenção, emisão/aplicação dos cinco tipos e acesso total no Desktop pessoal. Escolhas específicas: chave SQLCipher existente em hexadecimal, sem rekey; importar uma vez backup do cofre do emissor atual, conservando assinatura/trust roots. [ADR-0004](../architecture/adr/ADR-0004-painel-administrativo-integrado.md) evolui a separação do emissor da DEC-058/ADR-0003; não apaga histórico nem muda contratos de reset/restauração. Senha mestra via verificador de build; nenhum segredo claro versionado. Sem criação de root local, importação WebDiet, dados reais pelo agente, instalação/publicação/Git ou conclusão G5/G6/G7. Relato humano de instalação/atualizações não é aceite desta mudança. Testes/review/aceite pendentes.

## DEC-058 — Ativação offline e autorizações por instalação

- **Status:** ACCEPTED para direção funcional/tipos e ADR-0003 v1, após “Aprovo a implementação” em 2026-10-08. **Autoridade/data:** Maycon, 2026-10-08, anotações e respostas nesta conversa. Demanda [WEBFIT-10](../../specs/WEBFIT-10/task.md), STRICT.
- **Origem:** conta administrativa de Maycon por instalação e controle da preparação; aprovou fluxo/tabela e pediu documentação/início por webfit-task.
- **Fluxo:** instalar → aguardar ativação → gerar solicitação própria → enviar a Maycon → emitir licença vinculada e definir credenciais administrativas → importar/verificar → preparar acessos. Sem servidor obrigatório. Não promete uso único global, revogação remota ou resistência absoluta a clones offline.
- **Tipos:** ativação inicial (banco vazio); transferência/recuperação (destino autorizado e backup validado); suporte temporário; recuperação administrativa (trocar credencial sem apagar dados); reinicialização (backup e confirmação separados da importação). Chave inicial não limpa banco preparado. Atualização/reparo preservam dados/licença.
- **Respostas posteriores:** tudo até aqui era teste; entrega parte de ativações iniciais, sem migração clínica ativa. Emissor local separado **com interface**. Suporte: uma sessão de **até 4 horas**, encerrada ao sair/bloquear. Reinicialização mantém licença/acessos e limpa dados do consultório, após backup/confirmação; consumo preservado. Pacote de suporte por cópia fica **para outra demanda**, sem item extra automático. Não autoriza apagar banco automaticamente ou dados reais antes do G7.
- **Credenciais:** próprias por instalação; nenhuma senha mestra/chave privada no instalador clínico. Verificador Argon2, assinatura e envelope cifrado serão detalhados no [ADR-0003 proposto](../architecture/adr/ADR-0003-ativacao-offline-e-suporte.md), sem senha recuperável. Bitwarden é custódia manual, sem integração/coleta pelo agente.
- **Limites:** inicia/documenta a demanda; não aprova detalhes indefinidos de protocolo/schema/dependência, destruição/banco real, política clínica, publicação, Git mutável ou G5/G6/G7. Suporte por cópia adiado; autorização temporária não descriptografa o banco nem aprova sua substituição em uso.
- **Compatibilidade:** refina RF-AUT-001/RF-UX-002 no próximo incremento. Preparação livre descreve código atual até entrega; contas existentes não são renomeadas por documentação. RN-AUT-002 (acesso total ao Saúde) preservada.

**Adoção técnica ACCEPTED:** Maycon respondeu “Aprovo a implementação” após apresentação de D-LIC-006..008. Autoriza ADR-0003 v1, ed25519-dalek 2.2.0/crypto_box 0.9.1, schema 002, emissor separado/cofre recuperável, suporte por senha temporária, preservação de credenciais do destino em restore e legado restrito a backup. P-LIC-001 aceita: manter perfil/rascunho de perfil/auditoria/backups na limpeza. Execução em fixtures, sem dados reais/Git/publicação. Aprovação de implementação não é aceite final.


## DEC-056 — símbolo do WebFit no produto

**ACCEPTED por Maycon, 2026-10-08 neste chat.** Fonte: pediu “apenas o ícone” e, após receber símbolo, “Coloque em todos os lugares que exige logo do sistema”. Autoriza aplicar localmente símbolo à marca do acesso/lateral/informações/favicon e recursos Windows do aplicativo/atalhos/instalador. RF-UX-004 / WEBFIT-8. Logo profissional, ações, dados, identidade da instalação, spike e trabalho preexistente preservados. Sem Git/publicação/instalação no host ou aceite final/G5/G6/G7. Conversão/tamanhos são detalhes AUTO proporcionais.

## WEBFIT-5 — Refinamento do cadastro, 2026-10-07

**Preparação da verificação nativa autorizada:** Maycon respondeu “Sim” ao pedido explícito de preparar o toolchain Rust previsto pelo projeto para concluir os testes. Ao retomar, encontrado Rust/Cargo/rustfmt/Clippy 1.98.1 no cache local `.tools/validation`; reutilizado com variáveis apenas do processo, sem alteração global de PATH. Formatação aplicada aos testes e check passou. Autorização limita-se ao toolchain/checks necessários; sem Git/publicação ou banco real.

**Respostas posteriores em 2026-10-08 — escopo de implementação ACCEPTED:** Maycon aprovou número sequencial visível mantendo UUID, “Sim, mas sem os zeros, por exemplo apenas 1, 245, 123” (D-PAT-003). À pergunta sobre aprovação de Amanda e migração respondeu “Foi solicitação dela”, após pedir alteração/continuidade. Registrar origem funcional como relato de Maycon sobre solicitação de Amanda; autoriza implementação/migração necessária com testes fictícios e preservação de cadastros/backups no escopo apresentado, sem afirmar aceite final. RF-PAT-007/D-PAT-001 aprovados: três obrigatórios, todos os demais opcionais; CPF informado mantém validade/unicidade. D-PAT-002 preservação do legado permanece AGENT-PROVISIONAL não bloqueante conforme DEC-057. Pendências históricas abaixo são superadas por estas respostas; G5/G6/G7, dados reais e publicação não aprovados.

**Retomada em 2026-10-08:** Maycon reiterou somente nome/nascimento/sexo obrigatórios, radios Feminino/Masculino, demais campos opcionais inclusive CPF e identificação por ID do banco; depois pediu “continue”. Pedido de desenvolvimento reconhecido, sem exigir nova invocação de skill. Identidade UUID já existe; significado de número interno (UUID ou sequencial visível) foi perguntado e permanece NEEDS-HUMAN-DECISION. Solicitada confirmação da aprovação funcional de Amanda e autorização específica da migração com testes fictícios, conforme pendências anteriores. Nenhuma implementação/aprovação de Amanda inferida. [Adendo da especificação](../../specs/003-webfit-5-cadastro-paciente/spec.md#origem-e-decisões) e [plano atualizado](../../specs/003-webfit-5-cadastro-paciente/plan.md#plan-scope-check): schema atual 2 exige futura migration 003, preservando licenciamento. Registros abaixo mantêm a origem histórica.

**Maycon solicitou:** somente nome, nascimento e sexo obrigatórios; Feminino/Masculino por seleção. **ACCEPTED apenas para registro/preparação:** respondeu “Sim” à autorização para registrar a demanda no Plane e preparar alteração com migração preservando cadastros. Escopo sensível previsto: CPF opcional mantendo validação/unicidade quando informado. Não há evidência de aprovação de Amanda nem de execução deste plano; não inferir aceite conjunto. RF-PAT-007 permanece proposta até validação aplicável, sem substituir a baseline anterior silenciosamente.

Propostas para validação em lote:

- **D-PAT-001 — AGENT-PROVISIONAL:** campos do responsável também opcionais; CPF/e-mail preenchidos validados. Alternativa: manter obrigatórios condicionais. Recomendação segue “apenas” três campos; confiança alta na interpretação, impacto médio de produto, exige validação antes de implementar.
- **D-PAT-002 — AGENT-PROVISIONAL:** preservar sexo antigo; exibir equivalências inequívocas F/M/Feminino/Masculino e exigir escolha explícita ao salvar se valor vazio/diferente. Alternativas: apagar/converter automaticamente ou permitir texto livre; recomendação evita inferência e perda, confiança alta, impacto médio.

Artefatos: [spec.md](../../specs/003-webfit-5-cadastro-paciente/spec.md), [plan.md](../../specs/003-webfit-5-cadastro-paciente/plan.md), [tasks.md](../../specs/003-webfit-5-cadastro-paciente/tasks.md). Branch observada main, HEAD a83998ef33c032ea46e283322bbf7620c0051d49. Somente dados fictícios; sem Git mutável/publicação.

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
- **Refinamento ACCEPTED, Maycon, 2026-10-09:** remover o botão fixo Ver tutorial e oferecer Reiniciar tutoriais em Configurações. Reset somente do usuário conectado; oito telas voltam ao ensino automático ao entrar, conservando Pular/Concluir e marcação por tela. Supersede a proposta de replay fixo abaixo. Sem schema/dependência/regra clínica ou autorização de Git/publicação; aceite integrado pendente.
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

## DEC-049 — informações no login e preparação administrativa

- **Status:** ACCEPTED, Maycon, 2026-10-07 nesta conversa: concordou com preparação local pelo administrador sem senha no código e solicitou botão (i), nome, versão, crédito exato e forma de acesso administrativo.
- **Escopo:** RF-UX-002/TA-UX-002, refinamento do incremento em execução. Nome admin predefinido para instalações novas; senha escolhida localmente pelo administrador antes de entregar à nutricionista. Informações públicas nunca contêm senha.
- **Limites:** autorização e contas existentes preservadas; sem credencial universal, migração, dependências, publicação ou aceite final. Preparação continua criando ambos os acessos e recuperação, apenas dentro da opção administrativa.

## DEC-050 — retomar atualizações com runners próprios

**ACCEPTED por Maycon em 2026-10-07 nesta conversa:** após explicação de runners próprios versus hospedados, escolheu continuar com o GitHub Actions Runner instalado no Windows, aproveitando secrets/variável já cadastrados. Retoma a preparação local do pipeline e atualizador do produto, anteriormente adiada pela DEC-044, conforme ADR-0002/DEC-043 e autorização G5 DEC-045. Pode preparar dependências previstas, código, testes e documentação locais; não autoriza commit/push/merge/release nem ativação externa sem a revisão final. Distribuição manual continua vigente até validação ponta a ponta e ativação. Dois runners registrados separadamente poderão receber o mesmo job, sem promessa de executar no computador que enviou o código; disponibilidade e ambiente do segundo runner ainda precisam de validação.
## DEC-051 — atualizações em modal com fundo desfocado

**ACCEPTED por Maycon em 2026-10-07:** substituir opções expandidas da barra lateral por modal central com desfoque do aplicativo ao fundo. Refinamento STANDARD de RF-UPD-001/T103, execução local explicitamente solicitada; manter consulta, mensagens, confirmação, progresso e proteção da instalação. Aceite TA-UPD-UI-001: abrir pelo botão Atualizações, fundo desfocado/inativo, navegação por teclado contida, Escape/Fechar devolvem foco, consulta falha sem bloquear trabalho após fechar; durante instalação, fechamento indisponível. Não autoriza publicação/ativação externa. Sem dependência, schema ou autorização backend nova.

## DEC-052 — lembrar somente nome de acesso

ACCEPTED por Maycon em 2026-10-07: checkbox Lembrar de mim preenche somente o nome; senha continua obrigatória. Gravar/remover apenas após login válido, derivando usuário/papel no backend; usar settings criptografada existente com preferências separadas por papel, sem migração ou dependência. Não armazenar senha/token, não criar sessão persistente nem login automático. Refinamento STRICT do incremento G5; implementação local autorizada pela solicitação e esclarecimento explícito; ensaio/aceite e gates finais pendentes.
## DEC-053 — faixa superior, consulta por login e ativação

**ACCEPTED por Maycon em 2026-10-07:** supersede o modal/ícone de DEC-051: aviso de atualização em faixa superior somente quando houver nova versão, consulta a cada login, confirmação/progresso no aviso. Ativação do atualizador solicitada. Resposta explícita posterior: **preparação local; operações de Git pelo usuário**. Autoriza habilitar workflow no arquivo local e preparar artefatos/ambiente, sem commit/push/merge pelo agente nem declarar remoto ativo antes de integração/publicação. Revisão independente solicitada, resposta pendente. Não ampliar autorizações de dados reais; G5/G6/G7 permanecem abertos.

RF-UPD-001 / TA-UPD-UI-002: consulta por sessão autenticada nova, sem cache diário; React StrictMode não perde resultado nem duplica consulta da mesma sessão. Login seguinte consulta novamente. Faixa no topo informa atualização disponível e oferece Atualizar agora/Mais tarde; instalação confirmada preserva backup/assinatura/bloqueio. Sem nova versão ou internet, não exibir aviso de atualização nem bloquear o trabalho. DEC-051 fica SUPERSEDED apenas para apresentação; evidência e candidatos anteriores preservados.


## DEC-054 — Git sob controle humano e demandas na branch atual

- **Status:** ACCEPTED. **Autoridade/data:** Maycon, responsável técnico e PO, em 2026-10-07 neste chat.
- **Fonte:** “N quero q faça controle de git, eu q vou fazer, então todas as demandas serão feitas na branch atual que estivermos”.
- **Decisão:** o agente executa todas as demandas na branch ativa. Criação/troca de branches, base `develop`, branch exclusiva ou com ID e árvore limpa deixam de ser pré-condições do fluxo. Git fica sob controle de Maycon; inspeção somente leitura permanece para contexto, preservação e evidência.
- **Consequências:** substitui o setup obrigatório/BRANCH SETUP BLOCKED e a atuação autônoma sobre branches da DEC-010. Convenções históricas Git Flow e proteções remotas podem continuar sendo administradas pelo humano. O agente não cria/troca branches ou worktrees, fetch/pull, stash/reset/clean, commit/push/merge, PR, tag ou release por iniciativa própria; instrução explícita posterior pode autorizar uma operação específica.
- **Preservação:** alterações anteriores não são apagadas/escondidas nem atribuídas integralmente a uma demanda. Conflito concreto no conteúdo bloqueia somente a edição dependente, quando não for possível preservar com segurança.
- **Limites:** não altera arquitetura, dados, requisitos de produto, aprovações de implementação/mudança sensível/aceite, Plane ou gates G5/G6/G7. Não ativa publicação nem altera configuração do GitHub. Dispensa do bloqueio de branch não equivale a implementar WEBFIT-4.


## DEC-055 — Navegação do Consultório, Configurações e conta

**ACCEPTED por Maycon em 2026-10-07 neste chat, para escopo de WEBFIT-4:** confirmou sua organização: hambúrguer recolhe toda a lateral, deixando somente ícone para reabrir; engrenagem adjacente ao nome abre Configurações com Auditoria e Backup/restauração; nome abre opções de Acesso e Perfil profissional; somente módulo Consultório por enquanto.

RF-UX-003/TA-UX-NAV-001..008. Não cria novo espaço Saúde, papéis, módulos futuros, mudança de domínio/autorização, backup, migração ou dependência. D-NAV-001 (estado transitório, iniciar aberta) e D-NAV-002 (lista de opções pelo nome, índice de ferramentas/retorno) são AGENT-PROVISIONAL; execução do plano e validação em lote pendentes. G5/G6/G7 não concluídos. Não inferir aprovação de Amanda ou aceite final. DEC-054 mantém execução na branch ativa, sem operações Git pelo agente.


### Aprovação de execução da DEC-055 — 2026-10-07

Maycon respondeu “Aprovado” ao plano WEBFIT-4 e às escolhas D-NAV-001/002. **Implementation Approval concedida; ambas ACCEPTED, Validated by: Human, 2026-10-07.** Implementar e verificar localmente; não gerar instalador ao encerrar. Maycon fará Git/envio à main, e pipeline/updater existentes cuidam da distribuição. Não inferir publicação já realizada nem garantia ponta a ponta do runner. Sem novo backend, schema ou dependência; dados fictícios e aceite final preservados.

## WEBFIT-9 — detecção durante uso e faixa compacta global

**ACCEPTED por Maycon em 2026-10-08 nesta conversa:** após análise da consulta por login e proposta de login/30 minutos/retorno à janela, respondeu “Autorizo a implementação”. Autoriza implementar localmente faixa curta abaixo do título Windows e acima de toda a lateral/conteúdo, Atualizar à direita e aviso para salvar antes de atualizar/reiniciar. Complementa DEC-053/RF-UPD-001; preserva confirmação, backup, assinatura e bloqueio em edição. STANDARD; specs/006-webfit-9-faixa-atualizacao/. Sem Git mutável, publicação, dependências/schema/backend novos ou aceite de Amanda/G6/G7.

D-UPD9-001 — AGENT-PROVISIONAL: limitar retorno a uma tentativa por minuto, adiar por versão nesta sessão, nova versão/login pode avisar. Alta confiança/baixo impacto/risco, reversível; evita rajadas/reabertura do mesmo aviso. Validação no aceite final; autorização de implementação não equivale a validação desta microdecisão.

## DEC-057 — Harness com quatro fases

**ACCEPTED por Maycon em 2026-10-08**, por pedido explícito no texto “Refatoração do Harness WebFit — Workflow de 4 Fases”. Autoriza refatoração documental e de skills agora, sem aprovação intermediária; exclui produto, banco, dependências e Git/publicação.

- Substitui a cadeia operacional obrigatória por Discovery, Plan, Execução e Code Review contínuos. LIGHT/STANDARD/STRICT são profundidades dessas fases.
- Invocação explícita de webfit-task autoriza desenvolvimento no escopo, sujeito à autoridade competente. Scope Check permite execução aderente sem gate genérico; extraordinário não autorizado, lacuna material e ação sensível exigem decisão específica.
- Modifica obrigação de SDD completo da DEC-039: Spec Kit disponível/opcional, oficiais preservados. Preferir registro único em specs/WEBFIT-XX/task.md quando necessário; históricos sem conversão/exclusão.
- Checks, review independente, segurança/UI condicionais e Evidence integram Code Review; convergência interna à Execução. READY TO SHIP é prontidão técnica, sem aceite final, Plane Done, Git ou G5/G6/G7 automático.
- Mantém DEC-038/autonomia, DEC-054/Git humano, dados fictícios, domínio por Amanda e autorizações específicas de banco, dependências, segurança e publicação. Sem integração nova/serviço/loop persistente. Impeccable condicional, Mantis preparado, Mermaid opcional, DefectDojo futuro.
- Alinha Constitution 2.0.0 pela mudança incompatível de governança, preservando princípios técnicos. É decisão de processo com origem explícita, sem ADR de produto.

[Evidência/cenários](../../.harness/evidence/2026-10-08-four-phase-workflow.md). Esta decisão não aceita nem executa demandas de produto anteriores.

## D-DRF-EXIT-001 — Saída neutra da recuperação (WEBFIT-13 / V05)

- Status: ACCEPTED; Validated by: Human (Maycon), 2026-10-08, resposta “Faça isso” à recomendação anotada.
- Decisão: permitir Voltar preservando rascunho e registro; paciente/perfil para lista, prescrição para paciente; Escape equivale a Voltar, clique externo inerte. Operação em andamento impede saída. Reentrada oferece recuperação; foco no título de destino.
- Alternativa rejeitada para este escopo: manter exclusivamente Restaurar/Descartar. Justificativa: permitir abandonar o contexto sem aplicar/excluir preenchimento.
- Escopo autorizado: frontend e refinamento de RF-DRF-002/TA-DRF-010; sem schema, retenção, backend, domínio clínico ou arquitetura nova. Aceite final/Windows separado. [Fonte](../../specs/ui-audit-2026-10-08/V05-saida-recuperacao/spec.md).
