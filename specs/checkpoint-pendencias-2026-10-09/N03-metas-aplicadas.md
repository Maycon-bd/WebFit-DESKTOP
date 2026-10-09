# N03 — Distinguir entradas alteradas e metas aplicadas

- Data: 2026-10-09.
- Status: **PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Entradas locais podem divergir do resultado e meta ainda aplicados sem indicação clara.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Definir indicação de recálculo e meta vigente; persistência de entradas não aplicadas requer decisão de comportamento.

## Restrições e decisões

Revalidar achado no código/candidato vigente; não autorizar regra clínica ou implementação pela criação deste documento.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Editar/calcular/falhar/salvar/reentrar com indicação inequívoca da meta aplicada e entradas pendentes.
- [ ] não apagar meta silenciosamente.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar Discovery do achado, vincular item Plane pertinente e decisões necessárias antes de execução.

## Detalhamento para retomada

### Objetivo, atores e entradas

Permitir à nutricionista saber qual meta vale no cardápio e se as entradas visíveis ainda precisam ser recalculadas. Campos editados e resultado anteriormente aplicado precisam uma relação compreensível.

Meta aplicada com entradas de origem, edição local ainda não calculada, resultado novo/falha e persistência atual. Confirmar o que o serviço efetivamente salva; não presumir que input local não aplicado já seja parte do payload.

### Fluxo de trabalho previsto

1. Reproduzir cálculo aplicado, editar input e comparar resultado exibido/adequação/payload de salvamento.
2. Descrever estados: sem cálculo, meta aplicada sem alterações, entradas alteradas, cálculo em curso, erro e resultado aguardando confirmação pertinente.
3. Propor indicação textual de entradas alteradas e identificação da meta vigente, sem depender só de cor.
4. Definir com decisão de comportamento como salvar/sair/reentrar trata input ainda não aplicado; manter autosave contextual compatível.
5. Aplicar cálculo novo de forma coerente com N01 e recomputar adequação conforme regras existentes.
6. Ensaiar erro e reabertura, preservando meta anterior sem falso sucesso.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| N03-C01 | Meta aplicada | Editar entrada | Indicação de recálculo; meta vigente ainda identificada |
| N03-C02 | Entradas alteradas | Falhar cálculo | Alterações e meta anterior preservadas, erro distinguível |
| N03-C03 | Resultado válido confirmado | Aplicar | Meta/adequação passam a corresponder às entradas aplicadas |
| N03-C04 | Entrada local não aplicada | Salvar/sair/reentrar | Persistência segue decisão explícita, sem surpresa/perda silenciosa |
| N03-C05 | Sem meta | Abrir editor | Sem rótulo enganoso de resultado clínico ou adequação |

### Fronteiras técnicas e verificação

Inspecionar src/EnergyForm.tsx, src/App.tsx, cálculo/adequação em src/nutrition.ts e persistência em service.rs. Contratos de energia existentes são a referência. Não criar timestamp persistido ou schema apenas para indicar estado sem necessidade aprovada.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Decisão material: salvar entradas pendentes, pedir recálculo ou manter meta anterior com indicação; alternativas precisam comparação no Discovery. N03 não é V03 (posição de feedback). Não zerar meta ou alterar cálculo de adequação silenciosamente.

### Entrega e evidência esperadas

Tabela de estados aprovada, evidência editar/calcular/confirmar/falhar/salvar/reentrar, texto acessível da meta vigente e testes de payload/adequação. Pendência de comportamento deve permanecer visível antes de execução.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [critique/2026-10-08T22-48-16Z_src-app-tsx.md](../../.impeccable/critique/2026-10-08T22-48-16Z_src-app-tsx.md).

