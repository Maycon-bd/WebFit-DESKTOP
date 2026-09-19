# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Onde paramos

- **Data do checkpoint:** 2026-09-19
- **Fase:** spike técnico do primeiro incremento de Saúde
- **Gate atual:** G4 — execução técnica concluída; decisão humana pendente; G2 e G3 aprovados
- **Estado:** spike recomenda REVISAR; a política operacional sem custo recorrente foi detalhada e está pendente de aprovação humana; implementação de produto continua bloqueada até fechar G4
- **Última etapa concluída:** validações do G4 consolidadas: SQLCipher, DPAPI, pacote portátil com custódia administrativa fictícia, restauração separada, auditoria, nuvem simulada, Unicode, falhas de filesystem/espaço, CSP, 9 testes, build, instalação/desinstalação NSIS e confirmação manual da interface com imagem de evidência passaram
- **Próxima ação:** aprovar ou ajustar a política sem custo recorrente, registrar a decisão final do G4, confirmar licenciamento e política operacional da recuperação de chaves/backups e então preparar o G5
- **Branch registrada:** `feature/pbi-001-primeiro-incremento-saude`
- **Work Item:** `WEBFIT-3` — spike G4; vínculo legado `PBI-001`
- **Commit-base:** `5a9a409`
- **Sincronização:** branch `feature/pbi-001-primeiro-incremento-saude` acompanha `origin/feature/pbi-001-primeiro-incremento-saude` no commit-base; existem alterações locais não commitadas, incluindo evidências/documentação do G4 e a política de custo zero; não houve commit nem push nesta sessão

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

## Próxima ação exata

Submeter à aprovação humana a política registrada em [cost-free-operation.md](../operations/cost-free-operation.md): operação local/offline sem mensalidade, componentes gratuitos/open source, SQLCipher Community com avisos de licença, backup local com cópia externa opcional, credencial de recuperação offline sob custódia de Maycon, NSIS como instalador, atualizações manuais e ausência de nuvem/telemetria. Depois, registrar a decisão final do G4 e atualizar o ADR-0001 antes de preparar o G5.

A execução técnica do G4 passou. O ciclo manual completo da UI deve ser repetido quando o controlador estiver disponível; a instalação NSIS, abertura do app e persistência automatizada passaram. O MSI, a assinatura de código e a nuvem não bloqueiam o MVP privado, mas permanecem fora da decisão atual.

D-AUTO-001/002, DEC-040 e DEC-041 estão aceitos por Maycon para o comportamento/direção do spike; ainda não autorizam schema físico, autenticação administrativa de produção ou implementação integral do produto.

A proposta econômica está registrada, mas ainda não é decisão aprovada: [cost-free-operation.md](../operations/cost-free-operation.md) e [cost-free-operation-approval.md](../operations/cost-free-operation-approval.md). O custo recorrente obrigatório projetado é R$ 0; mídia externa e assinatura de código para eventual distribuição pública são custos opcionais.

`PLANE / SOURCE-OF-TRUTH MISMATCH`: a demanda nasceu como `PBI-001` antes da integração Plane. O Work Item `WEBFIT-3` usa `external_id=PBI-001`; branch, specification e requisitos canônicos preservam o identificador legado para evitar renomeação destrutiva durante o planejamento.
## Gates

| Gate | Objetivo | Estado | Evidência/condição seguinte |
|---|---|---|---|
| G1 | aprovar visão, autoridade e MVP Saúde | **aprovado em 2026-08-20** | entrevista e DEC-013 |
| G2 | aprovar baseline rastreável do primeiro incremento | **aprovado em 2026-09-17 por Amanda e Maycon** | requisitos, testes e rastreabilidade aprovados; execução técnica e evidências permanecem pendentes |
| G3 | criar plano executável | **aprovado em 2026-09-17 por Maycon** | artefatos Spec Kit aprovados; executar spike G4 |
| G4 | validar arquitetura e spike | **execução técnica concluída; decisão pendente** | aprovar política sem custo recorrente, licenciamento, recuperação de chaves/backups e riscos residuais |
| G5 | construir incremento vertical | não iniciado | depende do G4 aplicável |
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
| 8 | Backup e restauração | **baseline aprovada; prova técnica executada** | snapshot comum, backup SQLCipher, pacote portátil, checksum, restauração separada, auditoria e integridade passaram; política de credencial administrativa de produção pendente |
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
- Criptografia, diretório de dados, chaves e pacote de backup foram validados tecnicamente no spike; decisão operacional final e aplicação em produção dependem do fechamento do G4.
- Pen drive ou SSD externo deve ser decidido antes do G7.
- A política de custo zero está proposta, mas requer aprovação antes do G5; ver `docs/operations/cost-free-operation.md`.
- Incluir avisos de licença e inventário de componentes antes do release.
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

- Alterações preexistentes preservadas nos registros do G4, no spike e nas evidências.
- Documento novo: `docs/operations/cost-free-operation.md`.
- Documento novo: `docs/operations/cost-free-operation-approval.md`.
- Ainda não houve commit, push, merge, PR ou implementação do produto.
