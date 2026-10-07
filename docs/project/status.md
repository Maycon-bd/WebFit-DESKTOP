# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Onde paramos

- **Data do checkpoint:** 2026-10-07
- **Fase:** G5 em execução — construção do primeiro incremento de Saúde
- **Gate atual:** G4 aprovado em 2026-09-21; execução G5 autorizada por DEC-045 em 2026-10-06; G5/G6/G7 não concluídos
- **Estado:** produto novo criado na raiz, separado do spike: Tauri/React, SQLCipher/DPAPI, autenticação, perfil, pacientes, prescrições, rascunhos, auditoria e backup. Tours RF-UX-001 adicionados às oito telas autenticadas; instalador local 0.1.3 gerado em `.artifacts/mvp/2026-10-07/update-0.1.3/`, preservando candidatos anteriores; somente dados fictícios. Atualização automática adiada por DEC-044; distribuição por instalador e Atualizar mantendo os dados permanecem vigentes até pipeline/runner e updater implementados, validados e ativados (reafirmação humana em 2026-10-07).
- **Última etapa concluída:** RF-DIS-001/DEC-048: tradução do NSIS mostra Atualizar mantendo os dados e Reparar arquivos. Registro deste host confirmou instalação 0.1.1; template gerado confirmado com detecção SemVer e atualização sem desinstalador. Pacote 0.1.3 x64 gerado: 218.875.060 bytes, SHA256 `f58b9956d85ee5154bf17099d658fa23ada776de3faec604b8c9f75fa4cfe29b`. Checks de formatação/lint/TypeScript/build/clippy, 14 Rust e 4 Node passaram. Authenticode NotSigned. Ensaio gráfico e preservação dinâmica na atualização ainda pendentes em T093. Política transitória de distribuição manual consolidada nos documentos operacionais e na DEC-044/DEC-048, conforme solicitação de Maycon.
- **Última etapa técnica anterior:** repositório `Maycon-bd/webfit-desktop-releases` criado, `WEBFIT_RELEASE_TOKEN` informado como cadastrado, runner Windows `DESKTOP-GEUP094` instalado em `C:\actions-runner` e testado manualmente com `Connected to GitHub`/`Listening for Jobs`; o erro 1068 do serviço foi resolvido pela correção para `NT AUTHORITY\NetworkService`; Maycon confirmou `RUNNING` após reiniciar o Windows; nenhum segredo foi versionado no Git
- **Próxima ação:** Maycon instala o candidato `.artifacts/mvp/2026-10-07/update-0.1.3/WebFit-Desktop-0.1.3-teste-x64.exe` no Windows 10 x64 de Amanda e executa o roteiro `docs/operations/mvp-local-test.md` com dados fictícios. Em paralelo à evolução G5, completar catálogo/TACO, critérios de aceite e ensaios de interface/desempenho, sem reabrir autorização coberta pela DEC-045.
- **Branch registrada:** `feature/pbi-001-primeiro-incremento-saude`
- **Work Item:** `WEBFIT-3` — spike G4 concluído em `Done`; vínculo legado `PBI-001`
- **Commit-base:** `66f886fe2be407803298918c08798af6791fffda` (`Simplify project task workflow guidance`); **HEAD atual:** `66f886f`
- **Sincronização:** em 2026-10-07, `git status --short --branch` confirma a branch registrada com upstream local conhecido, sem indicação de ahead/behind; `git rev-parse HEAD` confirma o commit-base acima. Worktree com alterações documentais preexistentes de criação/renomeação de skills e manutenção do harness, preservadas, mais implementação nova na raiz e esta atualização do checkpoint. Sem fetch/pull; remoto atual não consultado. Sem commit/push automático.

## Última decisão aprovada

Amanda e Maycon aprovaram em 2026-09-17 D-AUTO-001/002 e a baseline da auditoria; Maycon aprovou em 2026-09-10 a consulta da auditoria:

- filtros por período, usuário, ação, tipo de entidade e resultado, combinados por AND;
- ordenação fixa do mais recente para o mais antigo;
- paginação no backend com 50 registros por página;
- período inicial de 30 dias, com instantes UTC e fronteiras determinísticas;
- catálogos controlados e resultados SUCCESS, FAILURE e DENIED;
- persistência somente de tipo/ID da entidade, com resolução autorizada e fallback técnico;
- nenhum snapshot ou diferença before/after;
- lista, filtros, paginação e detalhe sem edição, exclusão ou exportação;
- auditoria de abertura do módulo e detalhe, sem auditar filtros/páginas e sem recursão;
- estados distintos para ausência de eventos, ausência de resultados e falha recuperável.

Em 2026-09-11, a aplicação de DEC-038 preservou DEC-028 a DEC-037 e registrou D-AUTO-001/002 como provisórios. Em 2026-09-17, Amanda e Maycon aprovaram conjuntamente os dois refinamentos; a aceitação cobre comportamento e uso no spike, não schema físico nem arquitetura de produção.

Também em 2026-09-11, Maycon aprovou DEC-039: Spec Kit tornou-se a fonte operacional de SDD, o harness preservou governança e gates independentes, e `$project-task` tornou-se o entrypoint de novas demandas. A integração está pronta para smoke test posterior, sem feature criada.

Em 2026-09-21, Maycon aprovou integralmente DEC-042: operação local/offline sem mensalidade, SQLCipher Community, DPAPI, backup portátil, credencial de recuperação offline, NSIS e manutenção manual no escopo vigente. A decisão aceitou o ADR-0001, fechou o G4 e autorizou a preparação do G5, sem autorizar implementação. Na mesma data, aprovou o ADR-0002/DEC-043: merges revisados na `main` publicam o canal piloto; o updater assinado mostra ícone e solicita confirmação; backup, download, validação, instalação e reinício seguem automaticamente após a confirmação; runner Windows próprio e repositório público separado de artefatos; canal estável posterior. A execução externa ainda está pendente.

## Próxima ação exata

Maycon aprovou DEC-044: focar no MVP útil para Amanda com instalação e atualização manuais. T082/T083 e ativação do updater/pipeline estão ADIADOS, sem exigência de publicação piloto antes do produto. Workflow desativado somente no arquivo local; nenhuma configuração remota alterada. Chave/segredos e preparação técnica preservados; custódia no Bitwarden confirmada pelo usuário.

Próxima ação: Maycon instala/atualiza manualmente o candidato 0.1.3 em `.artifacts/mvp/2026-10-07/update-0.1.3/`, selecionando Atualizar mantendo os dados quando houver versão anterior, e confirma preservação de cadastros/senhas/tours (T093) no Windows 10 x64 de Amanda e confirma senhas de acesso com seis caracteres/recuperação com doze (T090), além dos tours, incluindo Pular, Escape, replay, persistência por usuário, foco e zoom, conforme `docs/operations/mvp-local-test.md`; consolidar resultados e continuar as pendências G5 nas evidências `2026-10-06-candidate.md` e `2026-10-06-onboarding.md`. T087 visual permanece pendente. Dependências previstas, schema/migrações e ferramentas de compilação (Perl incluído) estão autorizados no ambiente de teste. Testar com dados fictícios, sem promover spike a produto. T082/T083 continuam adiados. Revisão independente, aceite G6 e liberação G7 continuam pendentes; não publicar, fazer commit/push ou usar dados reais.

## Gates

| Gate | Objetivo | Estado | Evidência/condição seguinte |
|---|---|---|---|
| G1 | aprovar visão, autoridade e MVP Saúde | **aprovado em 2026-08-20** | entrevista e DEC-013 |
| G2 | aprovar baseline rastreável do primeiro incremento | **aprovado em 2026-09-17 por Amanda e Maycon** | requisitos, testes e rastreabilidade aprovados; execução técnica e evidências permanecem pendentes |
| G3 | criar plano executável | **aprovado em 2026-09-17 por Maycon** | artefatos Spec Kit aprovados; executar spike G4 |
| G4 | validar arquitetura e spike | **aprovado por Maycon em 2026-09-21** | ADR-0001 aceito; política sem custo recorrente e riscos residuais aprovados |
| G5 | construir incremento vertical | **em execução; DEC-045 autoriza implementação e alterações sensíveis previstas** | produto criado separado do spike; verificações, cobertura integral dos TA, revisão e aceite ainda pendentes. DEC-044 preserva distribuição manual |
| G6 | validar release candidate | não iniciado | requisitos críticos verificados |
| G7 | liberar para dados reais | não iniciado | restauração exercitada e riscos aceitos |

## Checklist do G2 — primeiro incremento

| Ordem | Seção | Estado | Observação |
|---:|---|---|---|
| 1 | Escopo do incremento | **aprovado** | prescrição/cardápio incluído; PDF/exportação excluídos |
| 2 | Autenticação e sessão | **aprovado** | RF-AUT-001 a RF-AUT-003 |
| 3 | Perfil e espaço Saúde | **aprovado** | RF-CLI-001 e RF-CLI-002 |
| 4 | Pacientes e tags | **aprovado** | RF-PAT-001 a RF-PAT-006 |
| 5A | Composição e ciclo da prescrição | **aprovado por Amanda em 2026-08-21** | RF-PRE-001 a RF-PRE-004, RN-PRE e TA-PRE |
| 5B | Necessidade energética e metas | **aprovado por Amanda em 2026-09-10** | RF-PRE-005, RN-PRE-011 a RN-PRE-024 e TA-PRE-008 a TA-PRE-016 |
| 6 | Rascunhos | **aprovado por Maycon em 2026-09-10** | RF-DRF-001, RN-DRF-001 a RN-DRF-005 e TA-DRF-001 a TA-DRF-004 |
| 7 | Auditoria | **baseline aprovada; D-AUTO-001/002 aceitos em 2026-09-17** | RF-AUD-001, UC-AUD-001, RN-AUD-001 a RN-AUD-017, TA-AUD-001 a TA-AUD-015 e D-AUTO-001/002 |
| 8 | Backup e restauração | **baseline e direção técnica aprovadas** | snapshot, SQLCipher, pacote portátil, checksum, restauração, auditoria e política de credencial offline aprovados; implementação pertence ao G5 |
| 9 | Requisitos não funcionais | **baseline documentada** | RNF-* do incremento; medição pendente |
| 10 | Testes e rastreabilidade | **artefatos preparados** | TA-*, matriz e tasks; execução pendente |
| 11 | Aprovação final do G2 | **aprovado em 2026-09-17 por Amanda e Maycon** | aceite funcional conjunto de Amanda e Maycon |

## Escopo aprovado do primeiro incremento

- autenticação, logout e bloqueio;
- nutricionista e administrador;
- perfil profissional e espaço Saúde;
- pacientes, tags, observações, rascunho, arquivamento e restauração;
- prescrição e cardápio individual;
- auditoria;
- backup automático/manual e restauração mínima;
- persistência após fechar e reabrir.

## Fora do primeiro incremento

- Educação;
- agenda, atendimento, anamnese e antropometria;
- financeiro e planner;
- arquivos clínicos, PDF, impressão, relatórios e exportações;
- nuvem, sincronização e recuperação remota.

## Pendências que não devem ser esquecidas

- No discovery de arquivos, definir limites, categorias, duplicidade, miniaturas e retenção.
- Criptografia, diretório de dados, chaves e pacote de backup foram validados e aprovados no G4; detalhes de implementação e testes de produção pertencem ao G5/G6.
- Pen drive ou SSD externo deve ser decidido antes do G7.
- A política de custo zero foi aprovada em 2026-09-21; ver `docs/operations/cost-free-operation.md`.
- Incluir avisos de licença e inventário de componentes antes do release.
- ADR-0002/DEC-043 aceitos: dependências, chave, workflow, repositório e runner foram preparados; endpoint local configurado em 2026-10-06; publicação e validação ponta a ponta ainda estão pendentes.
- Retenção clínica definitiva precisa de avaliação antes de dados reais.
- Educação e serviços em nuvem exigem novo ciclo/ADR.

## Como trocar de máquina

### Antes de sair da máquina atual

1. Atualizar este arquivo.
2. Executar `git status` e revisar o diff.
3. Criar um commit intencional.
4. Executar `git push` na branch registrada.
5. Confirmar que o commit remoto corresponde ao trabalho local.

### Na outra máquina

1. Confirmar que não há alterações locais conflitantes.
2. Executar `git fetch origin`.
3. Trocar para a branch registrada acima.
4. Executar `git pull --ff-only`.
5. Abrir este arquivo e continuar pela seção **Próxima ação exata**.

## Documentos de apoio

- [Escopo](../product/scope.md)
- [Requisitos funcionais](../requirements/functional-requirements.md)
- [Regras de negócio](../requirements/business-rules.md)
- [Testes de aceite](../requirements/acceptance-criteria.md)
- [Matriz de rastreabilidade](../requirements/traceability.md)
- [Decisões](decision-log.md)
- [Product Backlog](product-backlog.md)
- [Roadmap](roadmap.md)

## Gatilho de retomada

Ao receber **“Vamos continuar onde paramos”** ou variação clara, este arquivo deve ser lido integralmente antes de qualquer planejamento ou alteração. O estado Git deve ser comparado com este checkpoint e a retomada deve começar por **Próxima ação exata**.

## Regra de manutenção

Ao final de cada sessão, atualizar pelo menos: data, branch, commit-base, sincronização, última etapa concluída, próxima ação e checklist do Gate. Não marcar Gate como aprovado sem decisão dos aprovadores e evidência correspondente.

## Inventário local desta sessão

- 2026-10-06: DEC-044 registrada após aprovação explícita de Maycon; plano/tarefas e operação alinhados; workflow local desativado para publicação. Checks documentais/diff; nenhuma dependência instalada, publicação, commit ou push. Alterações preexistentes preservadas.

- Custódia no Bitwarden confirmada por Maycon em 2026-10-06: chave e senha salvas em nota segura e reabertas após novo login. Conteúdo não consultado pelo agente; restauração criptográfica a partir do cofre ainda não testada.

- Retomada em 2026-10-06: branch e HEAD confirmados, contagem HEAD/upstream local 0/0, sem fetch. Inspeção somente leitura dos pré-requisitos: Node no PATH de máquina; Cargo/Rust local no perfil de Maycon, disponibilidade no perfil NetworkService ainda não comprovada. Perl completo não localizado no PATH de máquina nem nos diretórios usuais consultados; tentativa com Perl do Git falhou por restrição de acesso MSYS no ambiente de execução, sem comprovar falha no serviço. Builds anteriores usaram cache e não comprovam compilação limpa SQLCipher pelo runner. Nenhuma instalação/configuração externa/publicação executada; Maycon informou não possuir gerenciador nem mídia externa e escolheu a opção de gerenciador de senhas. Bitwarden com nota segura no plano gratuito recomendado; criação da conta e transferência/recuperação da chave ainda pendentes, sem valores consultados.

- 2026-10-06: correções locais do workflow autorizadas e concluídas: checks existentes antes do build assinado, verificação pública de manifesto/assinaturas e SHA256SUMS. Nenhuma publicação executada. Evidência: [workflow local](../../.harness/evidence/update-pilot/2026-10-06-workflow-verification.md).

- 2026-10-06: endpoint HTTPS do updater adicionado localmente ao spike sob autorização específica; JSON e chave pública conferidos. Revisão estática identificou lacunas do workflow antes da publicação; nenhuma alteração de workflow ou publicação executada nesta etapa. Evidência: [endpoint local e revisão estática](../../.harness/evidence/update-pilot/2026-10-06-updater-endpoint.md).

- 2026-10-06: rotação autorizada da chave do piloto concluída localmente; chave antiga preservada; senha aleatória protegida por DPAPI CurrentUser; assinatura e rejeição de arquivo alterado verificadas; apenas a chave pública do spike foi alterada. Cadastro dos secrets posteriormente autorizado e confirmado por Maycon e pela imagem; valores não consultados. Custódia portátil ainda pendente. Evidência: [rotação local da chave](../../.harness/evidence/update-pilot/2026-10-06-signing-key-rotation.md).

- 2026-10-06: correção autorizada da conta do serviço `actions.runner.Maycon-bd-WebFit-DESKTOP.DESKTOP-GEUP094` para `NT AUTHORITY\NetworkService`, executada por Maycon em PowerShell elevado e confirmada por `sc.exe qc`. O log de instalação de 2026-09-21 confirma configuração e permissões concedidas antes do erro 1068 ao iniciar. A documentação da Microsoft exige o nome não localizado para configurar essa conta: <https://learn.microsoft.com/en-us/windows/win32/services/networkservice-account>. Inicialização posteriormente autorizada e executada por Maycon: `sc.exe query` confirmou `RUNNING` e códigos zero; leitura direta do log `C:\actions-runner\_diag\Runner_20261006-133527-utc.log` confirmou `Listening for Jobs` às 10:35:31 e 10:35:37 (America/Sao_Paulo). Erro 1068 resolvido no teste; início automático após reiniciar o Windows validado por Maycon com RUNNING e códigos zero; o novo log C:\actions-runner\_diag\Runner_20261006-134402-utc.log confirmou Listening for Jobs às 10:44:07 (America/Sao_Paulo). Nenhuma instalação ou novo registro do runner; nenhum workflow foi disparado pelo agente, e o estado de publicação no GitHub não foi consultado nesta etapa.

- Skills de 2026-09-30: criação de `webfit-checkpoint` e `webfit-verificar`; renomeação operacional para `webfit-task`. DEC-039 e evidências históricas conservam o nome original `project-task`; a renomeação não muda a decisão de usar Spec Kit nem suas autoridades. Etapa LIGHT documental; sem alteração de produto, workflow ou skill oficial.

- 2026-09-30: instruções do harness e `project-task` simplificadas por solicitação humana; correções documentais preservam gates, Plane/Branch Safety, Spec Kit oficial e estágio PLANNING. Relatório better-harness preservado como baseline; achados do pipeline ainda pendentes. Não houve alteração no workflow, spike, dependências do projeto ou configuração externa nesta etapa. Evidência: [harness proporcional](../../.harness/evidence/harness-proporcional-2026-09-30.md).

- Alterações preexistentes preservadas nos registros do G4, no spike e nas evidências.
- Documento novo: `docs/operations/cost-free-operation.md`.
- Documento novo: `docs/operations/cost-free-operation-approval.md`.
- Documento novo: docs/operations/update-release-strategy.md.
- Documento novo: docs/operations/update-pipeline-design.md, com workflow local em `.github/workflows/pilot-release.yml`.
- Preparação local T081 executada: `@tauri-apps/plugin-updater`, `tauri-plugin-updater`, chave fora do repositório, configuração de assinatura, UI de verificação e build assinado; repositório `webfit-desktop-releases` criado; runner `DESKTOP-GEUP094` registrado em `C:\actions-runner`; serviço corrigido, iniciado e conectado em 2026-10-06; T082/T083 permanecem pendentes de configuração/validação completa.
- ADR aceito: docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md.
- O commit-base `0de267b` está presente localmente e na origem; as alterações desta análise ainda não foram commitadas nem enviadas; não houve merge, PR, release, publicação, deploy ou implementação do produto.

## Artefato local de teste — 2026-10-06

- Instalador: `.artifacts/mvp/2026-10-07/update-0.1.3/WebFit-Desktop-0.1.3-teste-x64.exe`.
- Roteiro, SHA256 e manifesto de fontes acompanham o arquivo na mesma pasta (ignorada no Git).
- Evidência: `.harness/evidence/health-increment/2026-10-06-candidate.md`.
- G5 continua em execução; G6/G7 não iniciados. Catálogo TBCA inicial de cinco itens, TACO e cobertura completa ainda pendentes.

Refinamento mais recente: DEC-046/RF-UX-001, solicitado por Maycon em 2026-10-06, permite tours simples no MVP. Detalhamento reversível por usuário/tela é AGENT-PROVISIONAL; não altera gates clínicos, arquitetura ou distribuição manual. Checklist G5: T084–T086 verificados; T087 ensaio visual Windows 10 pendente.

Refinamento 2026-10-07: DEC-047 altera somente o mínimo de acesso da RN-AUT-001 para seis, recuperação permanece doze; T088/T089 verificados e T090 manual pendente. Evidência `.harness/evidence/health-increment/2026-10-07-password-length.md`. Branch/HEAD preservados; sem fetch, commit/push ou publicação.

Distribuição mais recente: DEC-048/RF-DIS-001; T091/T092 verificados, T093 manual pendente. Executar nova versão sem desinstalação manual e selecionar explicitamente Atualizar mantendo os dados; escolha padrão do NSIS preservada. Evidência `.harness/evidence/health-increment/2026-10-07-installer-update.md`.

Política vigente até a automação: toda nova versão é entregue por instalador; executar com o mesmo usuário Windows e selecionar Atualizar mantendo os dados, sem desinstalação manual. Vigência até pipeline com runner e updater implementados, validados e ativados. Fonte operacional: `docs/operations/installation.md`; pedido explícito de Maycon em 2026-10-07.
