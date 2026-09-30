# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Onde paramos

- **Data do checkpoint:** 2026-09-30
- **Fase:** preparação do G5 — construção do primeiro incremento de Saúde
- **Gate atual:** G4 aprovado em 2026-09-21; G5 em preparação; implementação ainda não iniciada
- **Estado:** G4 fechado e ADR-0001/ADR-0002 aceitos; preparação local do updater executada; repositório de releases criado; runner registrado e funcional manualmente; publicação piloto ainda não está ativa
- **Última etapa concluída:** revisão better-harness e simplificação documental local: contexto proporcional, retomada por fase, continuidade entre skills no mesmo chat e correção de instruções que reabriam o ADR-0002; G5 e publicação continuam pendentes. Ver `.harness/evidence/harness-proporcional-2026-09-30.md` para validações e limites.
- **Última etapa técnica anterior:** repositório `Maycon-bd/webfit-desktop-releases` criado, `WEBFIT_RELEASE_TOKEN` informado como cadastrado, runner Windows `DESKTOP-GEUP094` instalado em `C:\actions-runner` e testado manualmente com `Connected to GitHub`/`Listening for Jobs`; o serviço Windows instalado com `AUTORIDADE NT\\SERVIÇO DE REDE` falha ao iniciar com erro 1068; nenhum segredo foi versionado no Git
- **Próxima ação:** na outra máquina, ler este checkpoint; depois resolver o serviço do runner sem executar `config.cmd` novamente, confirmar `WEBFIT_RELEASE_REPO` e os secrets pendentes, configurar o endpoint e executar a validação ponta a ponta
- **Branch registrada:** `feature/pbi-001-primeiro-incremento-saude`
- **Work Item:** `WEBFIT-3` — spike G4 concluído em `Done`; vínculo legado `PBI-001`
- **Commit-base:** `0de267b` (`docs: add operational status checkpoint for project handoff and tracking`); **HEAD atual:** `0de267b`
- **Sincronização:** HEAD continua em `0de267b`; branch e upstream local conhecido correspondem ao checkpoint. Sem fetch/pull nesta revisão; estado remoto atual não foi consultado. Worktree contém alterações preexistentes e a simplificação documental local, sem commit/push automático. Antes de trocar de máquina, revisar, commitar e enviar intencionalmente.

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

T075–T081 da trilha de preparação do updater/pipeline foram executados localmente. O repositório de releases e o runner foram preparados, mas T082/T083 ainda não estão concluídos. A próxima ação é resolver o serviço do runner, confirmar o estado dos secrets, configurar o endpoint e executar a validação ponta a ponta.

Depois dessa validação, revisar os artefatos do primeiro incremento e solicitar a aprovação específica para iniciar o G5. ADR-0002 já está aceito; a preparação T081 consta como aprovada e executada no registro existente de `.harness/PROJECT-STATE.md`. Essa evidência não autoriza novas instalações, configuração externa, publicação, release, deploy ou implementação de produto. Recuperar a autorização específica aplicável antes de cada ação pendente, sem reabrir o aceite arquitetural.

DEC-040, DEC-041 e DEC-042, juntamente com o ADR-0001, encerram o G4. DEC-043 e ADR-0002 estão aceitos; o wiring do updater, o repositório e o runner foram preparados, mas endpoint, ativação, publicação e validação ponta a ponta permanecem pendentes.

## Gates

| Gate | Objetivo | Estado | Evidência/condição seguinte |
|---|---|---|---|
| G1 | aprovar visão, autoridade e MVP Saúde | **aprovado em 2026-08-20** | entrevista e DEC-013 |
| G2 | aprovar baseline rastreável do primeiro incremento | **aprovado em 2026-09-17 por Amanda e Maycon** | requisitos, testes e rastreabilidade aprovados; execução técnica e evidências permanecem pendentes |
| G3 | criar plano executável | **aprovado em 2026-09-17 por Maycon** | artefatos Spec Kit aprovados; executar spike G4 |
| G4 | validar arquitetura e spike | **aprovado por Maycon em 2026-09-21** | ADR-0001 aceito; política sem custo recorrente e riscos residuais aprovados |
| G5 | construir incremento vertical | **em preparação; implementação não iniciada** | ADR-0002 aceito; resolver lacunas do workflow e pendências do runner/configuração com autorização específica, validar ponta a ponta e obter aprovação de implementação |
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
- ADR-0002/DEC-043 aceitos: dependências, chave, workflow, repositório e runner foram preparados; endpoint, ativação e validação ponta a ponta ainda estão pendentes.
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

- 2026-09-30: instruções do harness e `project-task` simplificadas por solicitação humana; correções documentais preservam gates, Plane/Branch Safety, Spec Kit oficial e estágio PLANNING. Relatório better-harness preservado como baseline; achados do pipeline ainda pendentes. Não houve alteração no workflow, spike, dependências do projeto ou configuração externa nesta etapa. Evidência: [harness proporcional](../../.harness/evidence/harness-proporcional-2026-09-30.md).

- Alterações preexistentes preservadas nos registros do G4, no spike e nas evidências.
- Documento novo: `docs/operations/cost-free-operation.md`.
- Documento novo: `docs/operations/cost-free-operation-approval.md`.
- Documento novo: docs/operations/update-release-strategy.md.
- Documento novo: docs/operations/update-pipeline-design.md, com workflow local em `.github/workflows/pilot-release.yml`.
- Preparação local T081 executada: `@tauri-apps/plugin-updater`, `tauri-plugin-updater`, chave fora do repositório, configuração de assinatura, UI de verificação e build assinado; repositório `webfit-desktop-releases` criado; runner `DESKTOP-GEUP094` registrado em `C:\actions-runner`; execução manual aprovada, serviço automático pendente por erro 1068; T082/T083 permanecem pendentes.
- ADR aceito: docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md.
- O commit-base `0de267b` está presente localmente e na origem; as alterações desta análise ainda não foram commitadas nem enviadas; não houve merge, PR, release, publicação, deploy ou implementação do produto.
