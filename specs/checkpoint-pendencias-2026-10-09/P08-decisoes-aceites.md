# P08 — Decisões e aceites humanos remanescentes

- Data: 2026-10-09.
- Status: **PENDENTE — reconciliação e aceite humano**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Checkpoint conserva trilhas históricas com estados diferentes. WEBFIT-6 permanece planejada no registro; decisões provisórias e aceites finais de outras entregas estão pendentes.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Reconciliar aprovação com fonte canônica e registrar o que realmente falta: D-INFO-001/WEBFIT-6, D-UPD9-001, D-CI-011 e D-PAT-002, review/aceite das demais trilhas e G5/G6/G7.

## Restrições e decisões

Não reabrir aprovações comprovadas nem promover AGENT-PROVISIONAL a ACCEPTED. Maycon conserva técnica/produto/Git e Amanda domínio/aceite definidos na governança.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Cada pendência com fonte, autoridade e decisão/aceite necessário.
- [ ] WEBFIT-6 confrontada com implementação atual antes de executar.
- [ ] aceites finais registrados por humano.
- [ ] gates mantidos pendentes enquanto sem evidência/aprovação próprias.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Consultar artefatos e ledger ao retomar cada trilha; apresentar somente decisão material ainda não resolvida.

## Detalhamento para retomada

### Objetivo, atores e entradas

Evitar aprovação duplicada e separar decisão técnica provisória, autorização de execução e aceite final. Ator técnico/produto: Maycon; domínio e aceite funcional: Amanda conforme governança.

Checkpoint, decision-log/ledger, artefatos e evidência de cada demanda, estado Plane quando disponível e mensagens humanas suficientemente comprovadas. Silêncio ou implementação existente não são validação humana.

### Fluxo de trabalho previsto

1. Comparar fonte canônica e checkpoint por decisão; registrar divergência sem alterar autoridade.
2. Para D-INFO-001, confirmar se há resposta humana posterior e confrontar montagem atual antes de chamar a feature de não implementada.
3. Para D-UPD9-001, D-CI-011 e D-PAT-002, recuperar opção aplicada, risco e evidência já válida.
4. Agrupar decisões não bloqueantes para aceite; apresentar separadamente ASK-FIRST/material que impede operação.
5. Registrar resposta humana na fonte pertinente com data/escopo; sincronizar somente item Plane autorizado.
6. Avaliar checklist de gate próprio; documentação/checks não concluem G5/G6/G7.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P08-C01 | Aprovação suficiente já comprovada | Retomar trilha | Reutilizar aprovação e não criar gate repetido |
| P08-C02 | Decisão provisória sem resposta | Reconciliar estado | Continua AGENT-PROVISIONAL; bloquear só se materialmente necessário |
| P08-C03 | Checkpoint histórico vs evidência posterior | Comparar fontes | Pendência histórica identificada sem apagar sua origem |
| P08-C04 | Aceite humano condicionado | Registrar aprovação | Somente escopo aceito atualizado; restantes pendentes |
| P08-C05 | Plane indisponível com ID conhecido | Retomar registro seguro | PLANE SYNC DEGRADED; sync pendente sem inventar remoto |

### Fronteiras técnicas e verificação

Atualizações futuras pertencem aos artefatos originais e docs/project/decision-log.md/ledger aplicável. Esta spec organiza perguntas e rastreabilidade; não é ADR, ledger ou nova fonte de aprovação.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

D-INFO-001: opção admin só no login, sem resposta inferida. D-UPD9-001: adiamento por versão/cooldown aplicado provisoriamente. D-CI-011: cache nativo com medição observada. D-PAT-002: sexo legado preservado sem inferência, provisório não bloqueante. Manter dados reais e gates finais sob autoridade própria.

### Entrega e evidência esperadas

Lista reconciliada de decisões com fonte, status, autoridade, escopo e próximo passo; aceites registrados onde pertencem. Não marcar itens Done nem gate aprovado sem humano/evidência pertinente.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [004-webfit-6-informacoes-globais/spec.md](../004-webfit-6-informacoes-globais/spec.md).
- [006-webfit-9-faixa-atualizacao/spec.md](../006-webfit-9-faixa-atualizacao/spec.md).
- [WEBFIT-11/task.md](../WEBFIT-11/task.md).
- [003-webfit-5-cadastro-paciente/spec.md](../003-webfit-5-cadastro-paciente/spec.md).
- [project/decision-log.md](../../docs/project/decision-log.md).

