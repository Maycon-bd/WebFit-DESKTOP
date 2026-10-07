# WEBFIT-5: planejamento do cadastro minimo

Data: 2026-10-07. STRICT: regra de identificacao, schema/migracao e dados sensiveis. Branch main, HEAD-base a83998ef33c032ea46e283322bbf7620c0051d49; versao-base 0.1.8. Git limpo no inicio; sem operacoes mutaveis, dependencias ou dados reais.

## Intake / Authority

Solicitacao: somente nome/nascimento/sexo obrigatorios; Feminino/Masculino por selecao. Maycon respondeu Sim para registro no Plane e preparacao com migracao. WEBFIT-5 (UUID 3588df2f-3592-419b-bb1a-1a37ef6fc123) criado em Planning, prioridade neutra, sem modulo inventado. Execucao do plano e aprovacao funcional conjunta pendentes. DEC-045 nao aprova silenciosamente alteracao de baseline; DEC-054 mantem branch atual.

## Specification / Plan / Tasks

[Artefatos](../../../specs/003-webfit-5-cadastro-paciente/spec.md): spec, checklist, plan, research, data-model, contrato, quickstart e 15 tarefas. Skills oficiais Specify/Plan/Tasks/Analyze conduzidas sem modifica-las; extensions.yml ausente, sem hooks. Template de spec resolvido em .specify/templates/spec-template.md; helpers setup-plan/setup-tasks/check-prerequisites executados com sucesso. BRANCH retornada pelo helper era contexto de feature, nao branch Git; main verificada em Git e registrada nos artefatos.

Pesquisa delegada somente leitura conforme speckit-plan: schema atual exige CPF NOT NULL UNIQUE; recovery fixa schema 1. Proposta usa NULL unico, nova 002, snapshot pre-migracao, teste SQLCipher de referencias e backup v1/v2. Sem nova arquitetura ou ADR material; revisao de riscos de privacidade/dados em plan.md. Nao inferir sexo legado.

## Analyze (somente leitura)

Sem findings de duplicacao, ambiguidade impeditiva, cobertura ausente ou violacao constitucional no planejamento. Gate humano explicitamente pendente; nao READY FOR IMPLEMENTATION.

| Requisito | Tarefas |
|---|---|
| FR-001 | T006..T009, T013..T015 |
| FR-002 | T007..T009, T013..T015 |
| FR-003 | T004, T006..T008, T011, T013..T015 |
| FR-004 | T002..T005, T011..T015 |
| FR-005 | T010/T011, T013..T015 |
| FR-006 | T010/T011, T013..T015 |
| SC-001..004 | T006..T013, T015 |

Metricas: 6 FR + 4 SC, 15 tarefas (US1:4; US2:3; comuns:8), cobertura 100%; 0 ambiguidades nao sinalizadas, 0 duplicacoes, 0 criticos. T001 cobre autoridade; demais tarefas mapeadas. D-PAT-001/002 marcadas provisórias em toda cadeia. Sem edicoes durante Analyze.

## Verification documental

PASS: fontes/status revisados; script PowerShell conferiu links locais dos oito artefatos Spec Kit e desta evidencia e formato das 15 tarefas; git diff --check sem erros. Pesquisa rg de placeholders nao encontrou pendencias (unico match era descricao do checklist). Cwd: raiz do workspace, Windows/PowerShell, HEAD-base acima. Comandos frontend/Rust/SQLite/build nao executados nesta entrega documental: codigo/schema nao foram alterados. Todos permanecem obrigatorios na implementacao, nao declarados PASS. Revisao independente do codigo e aceite Windows nao executados.

Plane sync PASS: um item WEBFIT-5 criado em Planning e atualizado para Decision Review com nota curta e caminhos canonicos; nao marcado Done. Estado final lido na resposta da atualizacao. Nenhuma prioridade humana ou outra demanda alterada.

## Agent Decisions / Next

D-PAT-001/002: duas propostas pendentes, zero aprovadas/rejeitadas; recomendacoes e alternativas no registro canonico docs/project/decision-log.md. Preservar sexo legado e tornar responsavel opcional exigem validacao em lote. Estado READY FOR HUMAN DECISION REVIEW. Proxima acao: confirmar aprovacao funcional conjunta e autorizar plano; depois Implement/Converge e checks/review independentes. Aceite clinico/publicacao nao concedidos.
