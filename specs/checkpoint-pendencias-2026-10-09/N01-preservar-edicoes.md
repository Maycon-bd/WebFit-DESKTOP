# N01 — Preservar edições durante cálculo e confirmação

- Data: 2026-10-09.
- Status: **PROPOSTA PENDENTE — P1 da auditoria, não prioridade humana**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Risco estático de payload antigo substituir edições recentes ao concluir cálculo/confirmar TMB; reprodução nativa pendente.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Controlar API atrasada e preservar campos mais recentes; confirmação não pode substituir entradas locais posteriores. Sem mudança de fórmula clínica.

## Restrições e decisões

Revalidar achado no código/candidato vigente; não autorizar regra clínica ou implementação pela criação deste documento.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Reproduzir ou descartar com evidência atual.
- [ ] cálculo atrasado, edição concorrente, confirmação após edição, erro e recálculo sem perda de campos.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar Discovery do achado, vincular item Plane pertinente e decisões necessárias antes de execução.

## Detalhamento para retomada

### Objetivo, atores e entradas

Evitar perda silenciosa de alterações enquanto cálculo assíncrono ou confirmação de TMB está em andamento. A hipótese veio de leitura estática do fluxo; precisa reprodução na versão atual antes de qualquer diagnóstico definitivo.

Formulário com energia/objetivo/refeições fictícios; API com conclusão controlável; valores distintos antes/depois do pedido; revisão/identidade do contexto atual. Reutilizar fixtures clínicas aprovadas sem trocar fórmulas.

### Fluxo de trabalho previsto

1. Reproduzir pedido de cálculo com resposta atrasada e editar objetivo/refeições antes da conclusão.
2. Comparar payload solicitado, campos atuais e resultado aplicado, sem registrar informação clínica real.
3. Definir aplicação limitada ao resultado pertinente; preservar campos independentes mais recentes.
4. Após editar entradas energéticas, tratar resposta anterior como ligada às entradas que a geraram; decisão sobre descartar/exibir resultado antigo deve ser explícita no Plan.
5. Confirmar alerta abaixo da TMB sobre cálculo correspondente, sem reintroduzir input antigo no formulário.
6. Testar falha, recálculo e troca de contexto; salvar/reabrir para confirmar preservação.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| N01-C01 | Cálculo atrasado | Editar refeições/objetivo e resolver resposta | Edições recentes permanecem intactas |
| N01-C02 | Resultado exige confirmação | Editar input antes de confirmar | Confirmação não sobrescreve input novo nem autoriza cálculo divergente silenciosamente |
| N01-C03 | Dois cálculos em sequência | Responder segundo antes do primeiro | Resposta antiga não substitui cálculo pertinente; política definida no Plan |
| N01-C04 | Falha assíncrona | Rejeitar pedido | Erro seguro e dados editados preservados |
| N01-C05 | Pedido em contexto A | Mudar contexto autorizado para B | Resposta de A não altera B |

### Fronteiras técnicas e verificação

Inspecionar src/EnergyForm.tsx e integração src/App.tsx (onChange/aplicação da energia), contratos em src/api.ts e persistência no service.rs. Teste de regressão deve falhar antes da correção quando tecnicamente viável. Evitar refatoração do editor inteiro.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

N01 relaciona-se a N03: proteção de campos é distinta de indicar validade da meta. Concorrência e revisão do estado são detalhes a decidir no Plan; não introduzir arquitetura de cache. Qualquer semântica de cancelamento/resultado antigo que altere fluxo precisa validação pertinente.

### Entrega e evidência esperadas

Reprodução documentada ou hipótese descartada com evidência; regressões controladas para atraso/erro/ordem de respostas/confirmação; prova de salvar/reabrir sem perda; review independente. Não modificar fórmulas ou exigência de confirmação aprovada.

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

