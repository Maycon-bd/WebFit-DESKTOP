# P05 — Ensaio Windows e revisão integrada das entregas

- Data: 2026-10-09.
- Status: **PENDENTE — implementações existentes**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Cadastro, componentes, barra, conta/fechamento, tutoriais, rascunhos, identidade visual e V01–V08 têm entregas locais registradas. Review parcial não comprova o conjunto.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Ensaiar versões integradas e concluir revisão independente, preservando critérios e registros próprios de cada demanda.

## Restrições e decisões

Não duplicar specs existentes nem tratar build como aceite. A matriz abaixo define cobertura de retomada, não requisitos novos.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Cadastro: obrigatórios, radios, número, migração/restore.
- [ ] componentes: tabela/datas/busca.
- [ ] barra: arraste/resize/Alt+F4.
- [ ] fechamento: cancelar/Escape/opt-out/reinício/busy/falha.
- [ ] tutoriais: oito telas e isolamento.
- [ ] rascunhos: TA-DRF-005..010/reentrada.
- [ ] marca e V01–V08: piloto integrado.
- [ ] teclado, foco, tecnologia assistiva e zoom 100/150/200% sem cortes.
- [ ] revisão independente com findings resolvidos.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Preparar candidato fictício pela P01, mapear critérios aos registros abaixo e ensaiar pendências sem repetir implementação.

## Detalhamento para retomada

### Objetivo, atores e entradas

Verificar jornadas integradas no candidato Windows, com acesso por teclado, foco, zoom e recuperação, e concluir passagem independente do conjunto. Ensaio do produto e revisão de código têm resultados distintos.

Candidato integrado identificado por commit/hash, fixtures licenciadas, matriz requisito→cenário→evidência, viewport/resolução/zoom registrados e usuário de teste. NVDA/tecnologia assistiva somente se disponível ou autorizado preparar.

### Fluxo de trabalho previsto

1. Inventariar quais entregas estão no candidato; comparar base da evidência anterior e não usar instalador antigo para validar código posterior.
2. Montar matriz por cadastro, componentes, navegação/conta, janela, tutorial, rascunho e identidade visual.
3. Executar jornada mínima de login→paciente→prescrição→salvar/reabrir→logout, sem atribuir aceite clínico por inferência.
4. Executar erro, vazio, carga e retry pertinentes, usando teclado e zoom 100/150/200%.
5. Obter revisão independente do diff/código e das evidências; deduplicar findings contra V01–V08 e registros vigentes.
6. Corrigir findings cobertos pelo escopo, repetir cenários afetados e submeter aceite ao responsável.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P05-C01 | Cadastro vazio/parcial | Salvar e corrigir campos | Três obrigatórios, mensagens/foco, número sem zeros/UUID estável |
| P05-C02 | Tabelas/datas/busca | Navegar e editar filtros | Cabeçalhos/ações acessíveis; datas válidas; busca preservada |
| P05-C03 | Menu/conta com formulário editado | Recolher/reabrir/logout | Foco e formulário preservados; logout mantém contrato |
| P05-C04 | Janela/busy/rascunho | X, Alt+F4, cancelar/Escape/checkbox e reinício | Guard compartilhado; bloqueio em busy; falha preserva dados e permite retry |
| P05-C05 | Preferências de dois usuários | Reset tutorial e entrar nas oito telas | Somente usuário atual resetado; Pular/Concluir/foco e reentrada corretos |
| P05-C06 | Quatro contextos com autosave | Restaurar/descartar/Voltar e reentrar | TA-DRF-005..010; destino e rascunho corretos; ausência de faixa global |
| P05-C07 | Viewport 1366×768 e zoom até 200% | Percorrer ações/modais | Conteúdo e ações acessíveis sem corte; rolagem necessária permitida |
| P05-C08 | Candidato instalado autorizado | Atalho/barra/Alt+Tab e logo | Marca correta no candidato efetivo; cache do shell não assumido como causa |

### Fronteiras técnicas e verificação

Consumidores src/App.tsx e componentes DataTable, FormField, DateInput, SearchInput, WindowTitleBar, WindowCloseGuard, GuidedTour e DraftRecoveryDialog. Reusar testes unitários de cada fronteira; snapshots/renderização SSR não comprovam comportamento nativo.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Fechamento pode afetar trabalho não salvo; execução exige fixtures. Ensaios de migração/restore pertencem à evidência P04/WEBFIT-5, vinculados sem duplicar coleta. Interação externa e distribuição só se autorizadas. Falta de leitor de tela é NOT RUN, não PASS de acessibilidade.

### Entrega e evidência esperadas

Matriz por feature com PASS/FAIL/NOT RUN, capturas versionadas, findings/severidade, review independente e aceites separados. Nenhum READY TO SHIP global se permanecer critério técnico impeditivo ou revisão obrigatória ausente.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [002-webfit-4-navegacao-consultorio/plan.md](../002-webfit-4-navegacao-consultorio/plan.md).
- [003-webfit-5-cadastro-paciente/plan.md](../003-webfit-5-cadastro-paciente/plan.md).
- [007-recuperar-rascunho-contextual/spec.md](../007-recuperar-rascunho-contextual/spec.md).
- [005-webfit-8-identidade-visual/spec.md](../005-webfit-8-identidade-visual/spec.md).
- [WEBFIT-10/task.md](../WEBFIT-10/task.md).
- [ui-audit-2026-10-08/README.md](../ui-audit-2026-10-08/README.md).
- [ux/component-patterns.md](../../docs/ux/component-patterns.md).

