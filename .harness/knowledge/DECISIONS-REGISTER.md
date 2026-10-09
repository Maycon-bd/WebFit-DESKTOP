# Registro de decisões

Catálogo navegável e ledger do harness. O registro canônico de produto/processo continua em `docs/project/decision-log.md`; ADRs detalham decisões arquiteturais. Este arquivo não cria uma fonte concorrente.

## Estados vigentes

- `ACCEPTED`: validada pelo responsável.
- `AGENT-PROVISIONAL`: selecionada pelo agente; validação humana pendente.
- `NEEDS-HUMAN-DECISION`: sem base suficiente, alternativas equilibradas ou condição ASK-FIRST.
- `REJECTED`: rejeitada explicitamente.
- `SUPERSEDED`: substituída por decisão posterior vinculada.

Não representar `AGENT-PROVISIONAL` como aprovação humana. Aplicar `.harness/AUTONOMY-POLICY.md`.

## Accepted

- [DEC-059](../../docs/project/decision-log.md#dec-059--painel-administrativo-pessoal-integrado): Maycon, 2026-10-09; WEBFIT-16/ADR-0004, painel/emissor mestra integrados, chave SQLCipher hex existente e importação do cofre atual. Execução autorizada com fixtures, sem secrets reais/Git/publicação; aceite pendente.

- [DEC-058](../../docs/project/decision-log.md#dec-058--ativação-offline-e-autorizações-por-instalação): Maycon, 2026-10-08; direção funcional de WEBFIT-10, cinco tipos, entrega inicial, emissor com interface e suporte até 4 h. ADR-0003 v1 e D-LIC-006..008 aceitas por “Aprovo a implementação”; dependências/schema/emissor/restore/legado autorizados. Execução fictícia, sem dados reais/Git/publicação.

- [DEC-057](../../docs/project/decision-log.md#dec-057--harness-com-quatro-fases): ACCEPTED por Maycon em 2026-10-08; quatro fases contínuas, Scope Check/autorizações específicas, Spec Kit opcional e registro único proporcional; Git, segurança/domínio e aceite final preservados.

- [DEC-056](../../docs/project/decision-log.md#dec-056--símbolo-do-webfit-no-produto): símbolo sem texto escolhido e aplicação local solicitada por Maycon em 2026-10-08, WEBFIT-8/RF-UX-004. Git/publicação/instalação no host e aceite final separados.

- DEC-001 a DEC-002: novo repositório e pausa do WebFit Web.
- DEC-003 a DEC-006: autorização histórica do spike; a direção de produção correspondente foi aceita por DEC-042 e ADR-0001.
- DEC-007 a DEC-010: curadoria documental, requisitos rastreáveis, gates e Git Flow histórico; a exigência de setup por demanda para o agente foi substituída pela DEC-054.
- [DEC-054](../../docs/project/decision-log.md#dec-054--git-sob-controle-humano-e-demandas-na-branch-atual): ACCEPTED por Maycon em 2026-10-07; Git humano, demandas na branch ativa, sem bloqueio por nome/base ou árvore suja. Preservação e gates de produto permanecem.
- DEC-013 a DEC-021: MVP Saúde, papéis, primeiro incremento, backup e prescrição/cardápio.
- DEC-022 a DEC-027: regras clínicas, rascunho automático, auditoria e planejamento de arquivos.
- DEC-028 a DEC-037: consulta de auditoria, filtros, ordenação, paginação, período, catálogos, entidade, detalhe, meta-auditoria e estados.
- DEC-038: adotar `AUTONOMOUS DECISION WITH HUMAN VALIDATION` no harness.
- DEC-039: integrar Spec Kit como fonte operacional SDD, manter governança/gates no harness e usar `$project-task` como entrypoint.
- DEC-040: SQLCipher como direção de proteção local e chave aleatória por instalação protegida pelo DPAPI `CurrentUser`, aprovada por Maycon em 2026-09-17 para o escopo do spike e detalhamento posterior.
- DEC-041: backup portátil com chave encapsulada, credencial administrativa separada, manifesto, checksum e auditoria; nuvem real permanece fora desta prova.
- DEC-042: política operacional sem custo recorrente aprovada, ADR-0001 aceito, G4 fechado e preparação do G5 autorizada por Maycon em 2026-09-21.
- DEC-043: merges revisados na `main` publicam automaticamente o canal piloto; o aplicativo usa updater assinado, mostra ícone, aguarda confirmação e executa backup, download, validação, instalação e reinício; runner Windows próprio e repositório público separado de artefatos; canal estável posterior. Aprovada por Maycon em 2026-09-21.

- [DEC-055](../../docs/project/decision-log.md#dec-055--navegação-do-consultório-configurações-e-conta): escopo, plano/execução e D-NAV-001/002 aceitos por Maycon em 2026-10-07. Instalador local dispensado; Git e integração na main pelo usuário, distribuição pelo pipeline/updater. Aceite final e ensaio integrado continuam distintos desta aprovação.

## Agent-provisional ledger

### D-UPD9-001

- **Status:** AGENT-PROVISIONAL, 2026-10-08.
- **Demanda:** WEBFIT-9; cooldown de retorno um minuto e adiamento da mesma versão por sessão, permitindo aviso de outra versão/novo login.
- **Confiança/impacto/risco:** alta/baixo/baixo; reversível, evita rajadas/repetir aviso adiado.
- **Fonte canônica:** [registro de decisões](../../docs/project/decision-log.md#webfit-9--detecção-durante-uso-e-faixa-compacta-global). Implementação do pedido/proposta autorizada por Maycon; validação da microdecisão/aceite final pendentes.
- **Spec:** [WEBFIT-9](../../specs/006-webfit-9-faixa-atualizacao/spec.md).

### D-AUTO-001

- **ID:** D-AUTO-001
- **Título:** representar atores de auditoria por tipo controlado
- **Status:** `ACCEPTED`
- **Categoria:** dados, segurança e auditoria
- **Problema:** representar usuário autenticado, rotina automática e tentativa anterior à autenticação sem identidade falsa ou dado sensível.
- **Alternativas consideradas:** usuário sintético; `user_id` nulo sem tipo; texto livre; `actor_kind` controlado com referência opcional.
- **Alternativa escolhida:** `actor_kind = USER | SYSTEM | UNAUTHENTICATED`; `actor_user_id` obrigatório somente para USER. Não persistir login ou credencial tentada. Exibir “Sistema” e “Não autenticado”; filtro de usuário cobre somente USER.
- **Justificativa:** preserva semântica, integridade e minimização sem poluir usuários nem usar texto livre.
- **Evidências:** UC-BKP-001 admite sistema; login falho antecede identidade confiável; RN-AUD-002 e RNF-SEG-003 proíbem dado sensível.
- **Requisitos relacionados:** RF-AUD-001, RN-AUD-001/002/010/016, TA-AUD-001/014.
- **Decisões relacionadas:** DEC-025, DEC-026, DEC-032, DEC-038.
- **Confiança:** ALTA.
- **Impacto:** MÉDIO.
- **Reversibilidade:** MODERADA.
- **Risco:** novo tipo futuro exigirá evolução versionada do catálogo.
- **Consequências:** ator verdadeiro e filtrável; nenhuma identidade sintética; schema físico deve aplicar invariantes.
- **Validação humana:** aprovada por Amanda e Maycon em 2026-09-17.

### D-AUTO-002

- **ID:** D-AUTO-002
- **Título:** fixar janela UTC, desempate e cursor da consulta de auditoria
- **Status:** `ACCEPTED`
- **Categoria:** consulta, contrato e testabilidade
- **Problema:** evitar ambiguidade de fronteiras, empates e deslocamento do conjunto entre páginas.
- **Alternativas consideradas:** offset em conjunto mutável; carga total; cursor opaco em snapshot; ordenação somente por instante.
- **Alternativa escolhida:** capturar `query_as_of_utc`; consultar o intervalo semiaberto `[from_utc, to_utc)`, com default `from_utc = query_as_of_utc − 30 × 24 h` e `to_utc = query_as_of_utc`; usar ordem `(occurred_at_utc DESC, event_id DESC)` e cursor opaco vinculado ao snapshot, intervalo e filtros; 50 itens por página.
- **Justificativa:** fronteira semiaberta evita sobreposição, ID cria ordem total e cursor mantém conjunto estável sem carga integral.
- **Evidências:** DEC-029/030/031, RN-AUD-007/008/009 e TA-AUD-006.
- **Requisitos relacionados:** RF-AUD-001, UC-AUD-001, TA-AUD-004/006/015.
- **Decisões relacionadas:** DEC-029, DEC-030, DEC-031, DEC-038.
- **Confiança:** ALTA.
- **Impacto:** MÉDIO.
- **Reversibilidade:** MODERADA.
- **Risco:** cursor torna-se contrato técnico e deve permanecer opaco/versionável; eventos retroativos exigem regra física.
- **Consequências:** paginação determinística, verificável e sem duplicidade/perda por novos eventos.
- **Validação humana:** aprovada por Amanda e Maycon em 2026-09-17.

## Needs-human-decision / abertas

- WEBFIT-5: preparação autorizada por Maycon; aprovação funcional conjunta/execução e D-PAT-001/002 aguardam validação. Fonte canônica: [registro de decisões](../../docs/project/decision-log.md), seção WEBFIT-5; [spec.md](../../specs/003-webfit-5-cadastro-paciente/spec.md). Nenhuma nova aprovação de Amanda inferida.


- Integração de nuvem, retenção clínica, backup externo, documentos e migração.
- Retenção clínica, backup externo, documentos e migração.

Cada item aberto deve ser avaliado pela matriz antes de interromper o usuário. Permanecerá `NEEDS-HUMAN-DECISION` quando for ASK-FIRST ou quando faltar evidência essencial.

## D-DRF-EXIT-001 — ACCEPTED

Maycon aprovou explicitamente em 2026-10-08 a saída neutra V05/WEBFIT-13, incluindo destinos e Escape; decisão e escopo no [decision-log](../../docs/project/decision-log.md#d-drf-exit-001--saída-neutra-da-recuperação-webfit-13--v05). Validated by: Human. Não é decisão AGENT-PROVISIONAL nem aceite final.
