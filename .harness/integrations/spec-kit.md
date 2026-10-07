# Spec Kit ↔ Harness

Status: **INTEGRATED — READY FOR SMOKE TEST**.

## Role

### Spec Kit

Fonte operacional para Constitution, Specification, Clarify, Plan, Checklist, Tasks, Analyze, Implement e Converge. As skills oficiais permanecem em `.agents/skills/speckit-*/` e não devem ser modificadas para customização do WebFit, pois upgrades podem sobrescrevê-las.

### Harness

Responsável por intake, pesquisa, investigation, decisão autônoma supervisionada, Architecture Review, Verification independente, Review independente, Security Gate, UI/UX Gate, Evidence Report, human gates e integrações futuras com Plane, Mantis, Impeccable, MCP e loops.

### Plane

Plane está ACTIVE apenas como camada de gestão do trabalho. O Work Item fornece o ID operacional, backlog, prioridade, módulo, responsável e estado; não fornece requisitos, regras, ADRs, arquitetura, Specification, Plan, Tasks ou Evidence canônicos. A leitura é automática; a escrita é CONTROLLED e limitada ao Work Item da execução atual de `$webfit-task`, conforme [integrations/plane.md](plane.md).

### AGENTS.md

Mantém o contexto permanente e as regras operacionais para agentes.

### Decisions Register e ADRs

Registram decisões. O ledger do harness aponta para a decisão canônica; ADRs detalham decisões arquiteturais.

### Documentação canônica

Mantém requisitos, regras, casos de uso, critérios de aceite e rastreabilidade aprovados. O Spec Kit referencia essas fontes por feature; não as substitui nem cria requisitos aceitos por inferência.

Não deve ser criada uma segunda pasta de specifications em `.harness/`.

## Source of Truth

Em conflito, aplicar: (1) decisão humana `ACCEPTED`; (2) ADR `ACCEPTED`; (3) requisito ou documentação canônica aprovada; (4) Constitution; (5) Specification, Plan e Tasks da feature; (6) código; (7) evidência de execução.

AGENTS.md e o harness governam a condução do trabalho, mas não substituem decisões ou requisitos canônicos. Código e evidência mostram estado observado, não redefinem intenção. Conflitos devem ser expostos e resolvidos na fonte competente, nunca conciliados silenciosamente.

## Workflow Mapping

```text
INTAKE
  ↓
RESEARCH, quando necessário
  ↓
CONTEXTO LOCAL: ID + BRANCH ATUAL + PRESERVAÇÃO (DEC-054)
  ↓
$speckit-specify
  ↓
$speckit-clarify, quando necessário
  ↓
ARCHITECTURE REVIEW / ADR, quando necessário
  ↓
$speckit-plan
  ↓
$speckit-checklist, quando apropriado
  ↓
$speckit-tasks
  ↓
$speckit-analyze
  ↓
HUMAN GATE
  ↓
$speckit-implement
  ↓
$speckit-converge
  ↓
HARNESS VERIFICATION
  ↓
HARNESS REVIEW
  ↓
SECURITY GATE, condicional
  ↓
UI/UX GATE, condicional
  ↓
EVIDENCE
  ↓
HUMAN APPROVAL
```

`$webfit-task` é o entrypoint. A entrada pode referenciar um Work Item existente (`WEBFIT-12`) ou uma nova demanda explícita. Para STANDARD/STRICT, o ID Plane deve ser obtido antes de criar os artefatos da demanda e preservado neles; a branch ativa é registrada sob DEC-054. Skills são instruções: quando seus arquivos estão disponíveis, leia a skill oficial necessária e siga seu procedimento no mesmo chat; uma API programável de chamadas aninhadas não é pré-requisito. Handoff só ocorre diante de instrução, ferramenta, ambiente ou autoridade realmente indisponível, com bloqueio concreto e próxima ação. Nunca declare uma etapa executada apenas por ler seu arquivo.

Na retomada, confirme a fase e reutilize Specification, Plan, Tasks e aprovações válidos. Não refaça a cadeia completa por novo turno. Ao mudar escopo ou uma entrada material, revise os artefatos dependentes e execute novamente as etapas afetadas. A [condução proporcional](../GOVERNANCE.md#condução-proporcional-e-retomada) preserva os controles de STANDARD/STRICT e a independência de Verification e Review.

## Branch Association

DEC-054 governs execution: all demands remain on the currently active branch, managed by Maycon. Specification, Plan, Tasks and Evidence use the Plane ID as demand identity and record the observed branch. They do not require a dedicated branch, matching branch name, develop base or clean worktree.

Do not let official Spec Kit helpers create/switch branches. Use a supported no-branch option or explicit feature selection when available, without modifying official skills. If the helper cannot comply, report that concrete tool limitation and continue independent permitted work; do not reinstate the retired BRANCH SETUP BLOCKED policy. Preserve existing features and avoid selecting a different feature merely because it shares the current branch.

Product gates, Plane identity and safe preservation remain applicable. Historical evidence keeps the policy used at its date.

## LIGHT / STANDARD / STRICT

### LIGHT

Documentação simples, ajuste textual ou alteração técnica trivial, de baixo risco e sem mudança material de comportamento, arquitetura, dados, segurança ou integração. Pode omitir parte do SDD formal com justificativa, mas mantém fonte, revisão, evidência e gate proporcional.

### STANDARD

Feature comum, bug, fluxo de UI, endpoint ou regra comum. Usa Specify, Clarify somente se necessário, Plan, Tasks e Analyze antes do Human Gate; após aprovação, Implement e Converge seguidos pelos controles independentes do harness.

### STRICT

Obrigatório para autenticação, autorização, dados clínicos ou sensíveis, privacidade, financeiro, banco/schema, migrations, arquivos/backup, dependência, infraestrutura, arquitetura, integração externa sensível, segurança, irreversibilidade ou alto impacto. Acrescenta pesquisa, Architecture Review/ADR, threat model, aprovação sensível e gates especializados conforme aplicável.

A classificação não muda o estágio do projeto nem autoriza implementação sem o gate vigente.

## Autonomy and Clarify

DEC-038 aplica-se antes de Clarify. Se uma alternativa for claramente superior, sustentada, reversível e permitida pela matriz, o agente registra `AGENT-PROVISIONAL` e continua. Clarify ou decisão humana é usado quando a ausência é material, ASK-FIRST se aplica, alternativas são equilibradas ou a decisão é sensível.

Decisões provisórias relacionadas são acumuladas para Human Decision Review. A Specification pode registrar a escolha provisória e sua dependência, mas não apresentá-la como requisito aceito.

## Human Gates

- **HUMAN DECISION REVIEW**: valida em lote decisões `AGENT-PROVISIONAL`.
- **IMPLEMENTATION APPROVAL**: autoriza o início da implementação quando exigido.
- **SENSITIVE CHANGE APPROVAL**: antecede dependência, schema/migration, autenticação, segurança, produção e demais condições ASK-FIRST.
- **FINAL APPROVAL**: antecede commit, PR, release, push ou deploy.

Aprovação limita-se ao escopo apresentado. Nenhuma automação faz commit, push ou deploy por conta própria.

## Conditional Gates

- Security Gate exige código e risco relevante; Mantis permanece `PREPARED — NOT ACTIVE`.
- UI/UX Gate exige UI; Impeccable permanece `PREPARED — NOT ACTIVE`.
- Loop Engineering exige implementação, checks objetivos e autorização; permanece `PREPARED — NOT ACTIVE`.
- Plane permanece ACTIVE com MCP OAuth, leitura validada e escrita controlada; outras integrações permanecem preparadas, sem ativação por consequência desta integração.

## Upgrade Safety

Customizações ficam na Constitution, harness, `.agents/skills/webfit-task/` e documentos do projeto. Skills oficiais `.agents/skills/speckit-*/`, scripts e templates gerenciados não são editados. Após upgrade, validar manifests, reler contratos e executar smoke test separado.

## Versioning

Versionar `.agents/skills/speckit-*/SKILL.md`, `.agents/skills/webfit-task/SKILL.md`, `.specify/` respeitando seu `.gitignore`, e documentos do harness relacionados.

Não versionar `.specify/feature.json`, `.specify/extensions/*/local-config.yml`, credenciais, tokens, segredos, dados clínicos reais, caches ou estado local futuro.

A auditoria atual encontrou em `.agents/` apenas skills Markdown versionáveis e nenhum segredo ou estado local. Não ignorar `.agents/` ou `.agents/skills/` amplamente.

## No Duplicate Specifications

Specifications de feature pertencem somente a `specs/` gerenciado pelo Spec Kit. Requisitos aprovados permanecem em `docs/`; o harness referencia ambos, sem replicá-los. Verification, Review e Evidence pertencem ao harness por responsabilidade distinta.

## Contrato de interação humana

Aplicar o [HUMAN INTERACTION CONTRACT](../HUMAN-INTERACTION-CONTRACT.md) na orquestração local. A aplicação de DEC-038 antes de Clarify não elimina discovery de comportamento de produto: opções técnicas superiores não resolvem por si só lacunas sobre como a pessoa percebe ou usa o produto. Antes de `READY FOR IMPLEMENTATION`, o review existente verifica compreensão, decisões discutidas, perguntas respondidas, aceite compreensível e ausência de suposições silenciosas. Respeitar o protocolo de perguntas de cada skill oficial sem modificá-la; as rodadas de 2–4 perguntas pertencem ao discovery do harness. Modos de interação e labels não alteram autoridade, gates ou estados.
