# P03 — Cobertura e ensaio integral da auditoria

- Data: 2026-10-09.
- Status: **PENDENTE — código/checks parciais existentes**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Correções de escopo HEALTH, cursor e atores têm checks e review estático registrados. TA-AUD-001..015 e ensaio integral continuam pendentes.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Completar matriz de cobertura RF-AUD-001, T050..057 e executar casos ainda sem evidência.

## Restrições e decisões

Somente metadados permitidos; sem conteúdo sensível, exclusão, exportação ou bypass. Reutilizar testes válidos; não reimplementar por caixa histórica desmarcada.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Cada TA-AUD-001..015 com evidência ou lacuna explícita.
- [ ] filtros AND, UTC/fronteiras, cursor/paginação e eventos posteriores cobertos.
- [ ] negativas de autorização e falha/retry verificadas.
- [ ] foco/teclado Windows ensaiados.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Comparar critérios com testes/evidência atuais e executar primeiro caso faltante.

## Detalhamento para retomada

### Objetivo, atores e entradas

Comprovar leitura autorizada e confiável da trilha, incluindo fronteiras de paginação, erro e privacidade. Usuários aprovados acessam conforme autorização do backend; sessão inválida não obtém metadados.

Fixtures com mais de 50 eventos, instantes iguais, fronteiras UTC, atores USER/SYSTEM/não autenticado, referências resolvíveis/indisponíveis e eventos de escopos diferentes. Controlar relógio para reproduzir query_as_of_utc.

### Fluxo de trabalho previsto

1. Relacionar TA-AUD-001..015 aos testes e evidências atuais; separar automação backend de ensaio UI.
2. Construir fixtures sem conteúdo clínico, incluindo eventos que atendem apenas parte dos filtros.
3. Executar consulta padrão, filtros individuais/combinados e várias páginas sob novos eventos concorrentes.
4. Executar negativas de sessão/escopo e falhas de escrita/consulta; confirmar preservação da operação conforme regra.
5. Ensaiar vazios, detalhe, retry e foco por teclado no Windows; conferir eventos de abertura sem recursão.
6. Consolidar cobertura por critério e review independente; corrigir somente findings autorizados.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P03-C01 | Eventos antes/dentro/depois da janela | Abrir lista padrão | Janela [T−30 dias,T), ordem instante/ID decrescente, até 50 |
| P03-C02 | Filtros com interseção parcial | Combinar filtros | Somente AND; primeira página reiniciada |
| P03-C03 | Empates e eventos novos após T | Percorrer cursor | Sem duplicação/perda/inclusão posterior ao snapshot |
| P03-C04 | Sessão inválida/escopo distinto | Consultar lista/detalhe | Negação backend sem metadados |
| P03-C05 | Zero eventos vs zero correspondências | Abrir/filtrar | Vazios distintos e filtros preservados |
| P03-C06 | Falha de consulta/escrita | Tentar operação/retry | Erro seguro; sem vazio falso; operação crítica não conclui se auditoria obrigatória falhar |
| P03-C07 | Atores e entidade indisponível | Abrir detalhe | Rótulos autorizados/fallback tipo+ID; sem credencial/snapshot |

### Fronteiras técnicas e verificação

Alvos atuais: src/audit-view.ts, src/App.tsx, src-tauri/src/service.rs e src-tauri/src/audit_recovery_tests.rs. Reutilizar tests/unit/audit-view.test.ts e integração SQLite. Não criar módulos dos caminhos históricos apenas para coincidir com tasks.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Fronteiras UTC, cursor alterado e filtro de escopo precisam teste real de backend. Interface esconder ação não comprova autorização. Inspeção de logs deve procurar padrões sensíveis sem imprimir conteúdo real; todas as entradas desta execução serão fictícias.

### Entrega e evidência esperadas

Matriz de quinze critérios com localização do teste, resultado, ambiente e lacunas; provas de autorização/privacidade, ensaio de teclado e revisão independente. Não concluir T057 por poucos casos ou por build.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [001-primeiro-incremento-saude/tasks.md](../001-primeiro-incremento-saude/tasks.md).

