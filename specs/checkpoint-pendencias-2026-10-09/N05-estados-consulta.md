# N05 — Distinguir consulta pendente, falha e vazio

- Data: 2026-10-09.
- Status: **PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Resultados podem não corresponder ao filtro corrente e ausência de prescrições pode aparecer antes de concluir consulta; evidência estática.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Vincular conteúdo à consulta aplicada e distinguir carga, falha, retentativa e vazio confirmado.

## Restrições e decisões

Revalidar achado no código/candidato vigente; não autorizar regra clínica ou implementação pela criação deste documento.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Consulta lenta/falha/troca rápida de filtro sem resultados enganosos.
- [ ] vazio somente após sucesso.
- [ ] recuperação sem perder contexto.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar Discovery do achado, vincular item Plane pertinente e decisões necessárias antes de execução.

## Detalhamento para retomada

### Objetivo, atores e entradas

Mostrar listas compatíveis com a consulta e impedir que atraso ou erro se apresente como ausência confirmada de registros. Cobrir pacientes filtrados e prescrições/tags do contexto de paciente.

Listas fictícias populadas/vazias, busca A/B distinguíveis, respostas controladas fora de ordem, falha em tags independente de prescrições e mudança de paciente/contexto.

### Fluxo de trabalho previsto

1. Reproduzir troca de consulta e falha mantendo resultados anteriores; revalidar a cadeia tags→prescrições atual.
2. Definir estados por região: inicial/carregando/sucesso com linhas/sucesso vazio/falha/retentativa.
3. Vincular cada resposta a filtro e contexto de origem; resposta antiga não confirma filtro atual.
4. Se manter conteúdo anterior durante carga/erro, identificá-lo claramente com consulta aplicada; alternativa de limpar conteúdo precisa análise de UX.
5. Separar falha auxiliar de tags do resultado de prescrições quando contratos permitirem.
6. Ensaiar buscas rápidas, erro, retry e navegação por teclado com contexto preservado.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| N05-C01 | Resultados de A visíveis | Mudar filtro para B e atrasar | Estado de carga, sem atribuir linhas de A ao filtro B |
| N05-C02 | Consultas A/B em curso | Responder B antes de A | Resultado final corresponde à consulta atual |
| N05-C03 | Resposta falha | Abrir região/retry | Erro seguro; nenhuma mensagem de vazio confirmado |
| N05-C04 | Resposta vazia bem-sucedida | Concluir consulta | Vazio correspondente ao filtro/contexto correto |
| N05-C05 | Tags falham | Consultar prescrições | Sem afirmar ausência antes de obter resposta pertinente |
| N05-C06 | Paciente/contexto muda | Concluir resposta anterior | Dados anteriores não aparecem como pertencentes ao novo paciente |

### Fronteiras técnicas e verificação

Alvos atuais: PatientsPage/PatientForm em src/App.tsx e contratos em src/api.ts. Preferir teste de comportamento com promises controladas e fronteira existente; não adicionar cache/concorrência geral ou dependência sem necessidade.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Principal risco é informação enganosa/contexto errado. Manter resultados anteriores só é aceitável se a consulta aplicada estiver inequívoca. Não converter falha de autorização em vazio. N05 se distingue da auditoria P03 e do feedback V03; compartilhar padrões apenas se houver duplicação real.

### Entrega e evidência esperadas

Matriz de estados por região, reprodução controlada e regressões de respostas fora de ordem/erro/vazio/retry/contexto; evidência teclado/foco e review. Critérios de UX propostos ainda precisam compatibilidade com requisitos aprovados.

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

