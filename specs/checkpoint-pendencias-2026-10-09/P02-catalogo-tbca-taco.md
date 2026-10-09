# P02 — Composição completa TBCA e fallback TACO

- Data: 2026-10-09.
- Status: **REVIEW PASSED WITH WARNINGS — WEBFIT-19 / T038**, execução técnica e revisão independente concluídas em 2026-10-09; Plane Review, aceite humano/ensaio nativo/equivalências clínicas pendentes.
- Plane: `WEBFIT-19`, UUID `8da6b0e8-a63b-48e6-a8a0-592a8ec75aee`. P02 permanece o registro de retomada; artefatos canônicos de execução em `specs/001-primeiro-incremento-saude/` são reutilizados, sem spec concorrente.
- Classificação: STRICT — composição nutricional; branch atual `feature/pbi-001-primeiro-incremento-saude`, HEAD/base `88387e46266dbfc6e1e47363da595db545695ddd`. Alterações preexistentes preservadas.

## Origem e estado atual

Estado inicial: 88 itens locais. Em 2026-10-09 foram obtidas as 5.874 páginas do inventário TBCA 7.3 e a planilha oficial TACO (597 linhas). Produto: 5.874 registros TBCA, sendo 5 bloqueados por problema da fonte, e um fallback TACO qualificado. Autorização TBCA foi relatada pelo humano; documento não inspecionado.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Completar composição oficial, unidades, ausências, preparações, proveniência e equivalências; fallback TACO somente após demonstrar ausência TBCA (RF-PRE-002/RN-PRE-002).

## Restrições e decisões

Não misturar fontes silenciosamente nem tratar ausência na seleção local como ausência na TBCA. Caches ignorados não acompanham Git. Qualquer migração ou dependência nova exige avaliação específica.

Somente dados fictícios. Execução de produto autorizada por Maycon neste chat, sem instalação, migração, Git mutável ou publicação. STRICT por risco de composição nutricional; vínculo WEBFIT-19 estabelecido antes da execução.

## Critérios de conclusão da pendência

- [x] Cobertura e faltantes comparados ao inventário oficial; cinco registros bloqueados explicitamente.
- [x] fonte/versão/origem preservadas.
- [x] conversões para gramas verificadas em ensaio automatizado.
- [x] fallback TACO4-522 demonstrado tecnicamente, com hashes fixos revisados.
- [ ] busca, porção, persistência e atualização ensaiadas (TA-PRE-002/004, T097).
- [x] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar coleta de composição T038 e validar completude antes de integrar fallback.

## WEBFIT-19 — Discovery e Plan, 2026-10-09

Maycon autorizou buscar a fonte sem arquivo fornecido, integrar no aplicativo, preservar os metadados/valores na importação, avaliar equivalência/ausência antes do fallback TACO e verificar busca, conversão, cálculo, reimportação e salvar/reabrir prescrições. Autorização anterior de uso TBCA relatada por Maycon reutilizada; documento não inspecionado. Fontes públicas oficiais: https://www.tbca.net.br/ (TBCA 7.3), https://nepa.unicamp.br/publicacoes/tabela-taco-excel/ (planilha TACO).

Discovery: catálogo embarcado confirmado com 88 registros; cache histórico de composição disponível parcialmente em `.tools/tbca-catalog/`, cache histórico do índice/TACO ausente nesta máquina. Índice recomposto pela ferramenta existente: 60 páginas/5.874 códigos e travessia concluída; isso não comprova composição. Sem mudança de banco clínico ou acesso a seus arquivos. Resultado: DISCOVERY COMPLETE.

Plan reutiliza T038 e os requisitos aprovados RF-PRE-002/003, RN-PRE-001..007, TA-PRE-002..005. Passos:

1. Coletar páginas oficiais de composição em cache ignorado, com identidade e SHA256, retomada por código e parada explícita em bloqueio da fonte; obter planilha TACO oficial. Coleta finita, sem scheduler.
2. Importar catálogo determinístico, verificar por 100 g, unidades, medidas, ausências/traços, descrição/preparação e unicidade; comparar todos os códigos esperados com importados/rejeitados. Publicar arquivos de produto apenas após conferência de completude; nunca substituir base válida por coleta parcial.
3. Confrontar descrições/preparos e referências TBCA com cada linha TACO. Equivalências ambíguas permanecem pendentes; ausência não é inferida de busca textual sem correspondência. Integrar somente fallback sustentado por evidência.
4. Reusar modelo JSON e contratos existentes onde compatíveis; nenhuma migration/schema ou dependência nova prevista. Valores desconhecidos permanecem explícitos; não imputar zero nem completar nutrientes por outra fonte. Problema material de representação ou regra clínica indefinida retorna ao Scope Check somente para a parte dependente.
5. Integrar busca offline, autorização/resolução oficial no Rust e apresentação de fonte/medidas. Acrescentar regressões observáveis de importação, identidade/adulteração, porções/preparos/totais, repetição e persistência/backup em fixtures.
6. Verificar formatação/lint/TypeScript/frontend, parser/dados, Rust/SQLite/Clippy/build Tauri e fluxo visual isolado; review independente inicialmente read-only conforme harness. Registrar limites de Chrome mock versus Windows/WebView2 e aceite humano.

Arquivos previstos: `scripts/{tbca-index,expand-tbca,collect-tbca,import-food-catalog}.py`, `src/data/`, `src/{FoodPicker,food-search,nutrition,api,App}.tsx/ts`, `src-tauri/src/nutrition.rs`, testes pertinentes e documentação canônica deste incremento. Caminhos são alvos por responsabilidade, sem reorganização obrigatória.

Decisão interna D-CAT-019-001 AGENT-PROVISIONAL: coleta com no máximo duas requisições simultâneas, intervalo global mínimo, cache e parada em HTTP 403/429; alternativa sequencial mais lenta. Confiança alta/impacto baixo, reversível, sem contornar limites. Importação separada da coleta permite reprodução offline e impede atualização parcial do produto. Scope Check: escopo explícito/requisitos aprovados/autorizações suficientes, sem Git mutável/publicação/dependência/schema novo. Resultado: PLAN APPROVED BY SCOPE.

## Detalhamento para retomada

### Objetivo, atores e entradas

Disponibilizar alimentos oficiais com composição e origem verificáveis para montagem da prescrição. A pendência é completude e integração da fonte, não criação de uma fórmula nutricional nova.

Índice TBCA já investigado, dados de composição autorizados, fonte TACO oficial, códigos/versionamento/proveniência e manifesto de importação. Os números históricos 5.874/597/88 são referência do checkpoint; conferir novamente o inventário atual antes de tomar como total final.

### Fluxo de trabalho previsto

1. Comparar catálogo atual, manifesto e caches disponíveis; recuperar ou obter fonte sem presumir que arquivos ignorados foram sincronizados.
2. Definir mapa dos campos da fonte para unidades canônicas já aprovadas; identificar valores ausentes, traços, preparações e porções.
3. Coletar/importar deterministically e registrar origem, versão, código e hashes quando disponíveis.
4. Confrontar códigos esperados e importados; gerar lista de rejeições e ausências com causa.
5. Demonstrar equivalência e ausência TBCA antes de selecionar TACO; sem mistura silenciosa por nutriente.
6. Validar busca, medida/gramas e totais em fixtures; ensaiar criação, salvamento e reabertura no candidato atual.

Execução e evidência atuais estão na seção abaixo. O ensaio nativo/aceite humano permanecem distintos dos checks automatizados.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P02-C01 | Alimento TBCA existente | Buscar e incluir por medida | Fonte TBCA exibida e conversão para gramas consistente |
| P02-C02 | Item demonstradamente ausente TBCA | Selecionar equivalente TACO | Fallback identificado com evidência da ausência/equivalência |
| P02-C03 | Nutriente sem valor informado | Importar e calcular | Sem converter ausência em zero por inferência; política aprovada respeitada |
| P02-C04 | Mesmo código reimportado | Repetir importação | Resultado consistente, sem duplicação indevida |
| P02-C05 | Preparações diferentes | Buscar e selecionar | Itens distinguíveis; composição não intercambiada |
| P02-C06 | Alimento personalizado | Criar e reabrir | Origem pessoal preservada sem sobrescrever oficial |

### Fronteiras técnicas e verificação

Inspecionar scripts/tbca-index.py, scripts/expand-tbca.py, scripts/import-tbca.ps1, src/data/tbca.json, src/data/tbca-import-manifest.json, src/FoodPicker.tsx e src-tauri/src/nutrition.rs. Conferir tests/unit/tbca-import.test.py e testes de conversão existentes antes de criar cobertura. Caminhos são alvos atuais, não obrigação de reorganização.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Ausência de campo, traço e zero nutricional não são necessariamente equivalentes. Política não definida exige decisão de domínio. Termos da fonte e autorização relatada devem ser tratados conforme escopo disponível, sem inventar documento inspecionado. Nova representação persistida exige avaliação de migração/backup.

### Entrega e evidência esperadas

Entregar manifesto de cobertura, fontes e unidades, itens importados/rejeitados, amostras reproduzíveis de equivalência e evidência TA-PRE-002/003/004/005 pertinente. Completo só quando faltantes estiverem explicados e critérios aprovados cumpridos.

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


## Execução — WEBFIT-19, 2026-10-09

- Fontes obtidas pelo agente: 60 páginas do índice TBCA 7.3, 5.874 respostas de composição, nenhuma falha na coleta final; planilha oficial NEPA/UNICAMP TACO 4ª edição com 597 linhas. Índice SHA256 `116abd95ae918b49002d3ed62c3b8ce8710c34806f168c929a6e1efceb29990d`. HTML/Excel em cache ignorado `.tools/catalog-investigation/`; hashes/origens/inventário versionados no manifesto do produto. Cache não acompanha Git; repetir aquisição exige fonte acessível e revisão de hashes alterados.
- Produto: `src/data/tbca.json` contém 5.874 identidades, 5.869 incluíveis. Bloqueados `BRC0004A`, `BRC0237T`, `BRC1145B`, `BRC1196B` por duplicatas conflitantes e `BRC0293T` por descrição/composição vazia. Este último usa apenas o nome do índice, mantém descrição vazia e está bloqueado; não recebeu nutrientes inventados. Rejeições de identidade/hash/completude abortam publicação; nenhum código faltante. Cada composição guarda URL, versão, código, preparação, unidade, original e hash.
- Macros indisponíveis preservados: fibra 130, gordura 40, energia 9, proteína 21, carboidratos 13 (contagens por campo, incluindo bloqueados). Totais propagarão indisponibilidade por nutriente; personalizados continuam exigindo composição quantitativa. Não atribuir zero a `tr`, `NA` ou célula vazia. Variantes conflitantes ficam preservadas, sem last-wins. Não misturar TACO/TBCA por nutriente.
- TACO: 597 linhas comparadas ao inventário inteiro; 511 com candidatos textuais, 85 sem equivalência resolvida, 1 fallback qualificado. Candidato textual não significa equivalência clínica nem cobertura confirmada. Quatro linhas TACO têm carboidrato negativo na própria planilha (`288`, `322`, `337`, `400`); ficam marcadas na leitura/cache e não entram no produto.
- D-CAT-019-002 **AGENT-PROVISIONAL**: `TACO4-522`, chantilly em spray com gordura vegetal, foi qualificado tecnicamente. Família TBCA revisada nas descrições completas: `BRC0037K`, `BRC0007R`, `BRC0008R`, `BRC0009R` (pó/preparado do pó), `BRC1061A`, `BRC1149A`, `BRC1007A` (bolos com cobertura), `BRC0099K` (sundae) e `BRC0135G` (pudim). Não descrevem preparação pronta em spray. Não substituir pelas preparações em pó. Evidência vinculada ao hash fixo do inventário e aos nove hashes de respostas revisadas em `src/data/taco-coverage.json`/importador; mudança de inventário, família ou composição impede importação até nova revisão. Confiança alta para distinção da forma/apresentação, reversível; Amanda mantém aceite clínico. Os outros 596 itens não foram ativados como fallback.
- Código: coletor finito/retomável, importador offline com conferência da base por 100 g e origem/hash, comparação e reimportação sem duplicar. Busca carrega módulos locais sob demanda, com erro/carregamento/vazio e restrição visível; nenhuma rede/dependência/CSP nova. Backend indexa catálogo uma vez e resolve composição oficial antes de salvar; rejeita código desconhecido ou bloqueado. Prescrição armazenada mantém sua composição; restauração não atualiza silenciosamente snapshots históricos. Sem mudança de schema/migration.
- Checks já concluídos: parser Python 5/5; lint/TypeScript/Node/Vite PASS; Rust/SQLCipher 62/62 antes da extensão do ensaio de backup; quatro cenários Chrome headless mock PASS (pronto, lento, erro persistente de arquivo danificado/retry, viewport 640). Busca inexistente, bloqueio, medida 55 g, valores ausentes, TACO, salvar/reabrir cobertos. Tauri debug offline/locked sem bundle PASS, executável não iniciado. Evidência final/review abaixo complementará estes resultados.
- Limites: Chrome usa IPC fictício em memória; SQLite/SQLCipher real coberto em fixtures Rust, nenhum banco de uso acessado. Erro de módulo danificado mantém falha explícita na tentativa e orienta reinstalação; retry não repara arquivo corrompido. Chunk completo ~25,21 MB (~2,32 MB gzip) é lazy, inicial ~329 kB; warning de tamanho mantido visível. Build não comprova instalação/update/GUI WebView2 nem aceite clínico. Ferramenta Impeccable context indisponível neste host; fallback por leitura de DESIGN/PRODUCT/skill, sem instalação.

Inventário desta entrega: `scripts/collect-tbca.py`, `scripts/import-food-catalog.py`, parser em `scripts/expand-tbca.py`; `src/data/{tbca,tbca-import-manifest,taco,taco-coverage}.json`; `src/{asset-types.d.ts,food-catalog.ts,api.ts,nutrition.ts,FoodPicker.tsx,App.tsx}` (apenas trechos deste escopo em App); `src-tauri/src/{nutrition,acceptance_tests}.rs`; `tests/unit/{tbca-import.test.py,food-search.test.ts,food-catalog.test.ts,nutrition.test.ts}`; mock/runner `tests/visual/mock-service.ts`, `scripts/catalog-visual-smoke.mjs`; P02, plan/tasks históricos, traceability, notices, guia de teste e checkpoint.

## Code Review e evidência final — 2026-10-09

Resultado: **REVIEW PASSED WITH WARNINGS**, revisão independente por `catalog_review`, passagem read-only. Finding P2 inicial: qualificação comparava apenas códigos e poderia revalidar silenciosamente fonte alterada. Corrigido fixando o SHA256 do inventário e os nove hashes de respostas revisadas; descrições completas acrescentam sundae/pudim. Regressão em memória confirma rejeição de novo inventário, mudança da composição mantendo código e novo integrante da família. Segunda passagem independente confirmou correção e ausência de bloqueadores restantes no escopo. Autorrevisão/checks não foram apresentados como aceite humano.

| Check / comando | Resultado e limite |
| --- | --- |
| `python tests/unit/tbca-import.test.py` | PASS 6/6: identidade, vírgula/unidades/medidas, traço, conflito e invalidação de qualificação |
| `python scripts/import-food-catalog.py --check` | PASS: 5.874 identidades, hashes/origens/base por 100 g, reimportação sem diferenças ou escrita em produto/banco |
| `npm run check` | PASS: lint, TypeScript, 64 Node, Vite; 5 testes catálogo/busca reexecutados após correção P2 |
| `npm run format:check`; `cargo fmt --all -- --check`; `git diff --check` | PASS; avisos CRLF do checkout não são falhas |
| `cargo test --manifest-path src-tauri/Cargo.toml --offline --locked` | PASS 62/62; fixtures em `.artifacts/visual-test/WEBFIT-19/fixtures`, SQLite/SQLCipher/DPAPI no Windows; novo ensaio inclui salvar/fechar/reabrir, editar, restaurar snapshot de backup e integridade |
| `cargo clippy --manifest-path src-tauri/Cargo.toml --offline --locked --all-targets -- -D warnings` | PASS; warnings de cache por cópia permanecem ambientais |
| `node scripts/catalog-visual-smoke.mjs` | PASS 4 cenários Chrome headless existente, recursos locais interceptados sem servidor/rede e IPC mock; carregamento lazy, lento, arquivo danificado/retry com erro explícito, busca vazia, bloqueio, fonte, medida 55 g, indisponível, salvar/reabrir, 1366/640 sem overflow horizontal |
| `node node_modules/@tauri-apps/cli/tauri.js build --debug --no-bundle -- --offline --locked` | PASS; versão 0.1.12, executável `src-tauri/target/debug/webfit-desktop.exe`; não iniciado/instalado/publicado |
| Windows/WebView2 GUI, instalação/update, aceite clínico Amanda | NOT RUN; T097 e gates pertinentes continuam abertos |

Ambiente: Windows x64, Node 22.21.0, toolchain Rust/Cargo existente, Perl portátil previamente disponível para SQLCipher, nenhum download/instalação de dependência. Logs/capturas ignorados `.artifacts/visual-test/WEBFIT-19/`; cache de fontes ignorado `.tools/catalog-investigation/`. Fonte persistente da entrega é este registro e os manifestos. Warning de chunk lazy TBCA ~25,21 MB mantido; não foi escondido por mudança do limite de build. Dados fictícios somente.

Branch/base/HEAD final: `feature/pbi-001-primeiro-incremento-saude` / `88387e46266dbfc6e1e47363da595db545695ddd`. Refs locais upstream 0/0, sem fetch/consulta remota. Árvore já modificada e trabalho concorrente preservado; nenhuma operação Git mutável. Alterações em App/docs compartilhados limitadas ao escopo da tarefa; outros arquivos locais não atribuídos a esta entrega.

Pendências: Amanda validar D-CAT-019-002 e aceite de composição/fluxo no candidato Windows com dados fictícios; equivalência dos outros 596 itens TACO não confirmada (511 candidatos textuais, 85 sem candidato), sem ativação automática. Cinco fontes TBCA continuam bloqueadas até correção verificável da fonte. Maycon controla integração Git/candidato/distribuição. G5 segue em execução; G6/G7/Done/publicação não inferidos. **Próxima ação desta trilha:** ensaiar T097 no Windows/WebView2 e obter aceite humano; usar `taco-coverage.json` como inventário para revisão de equivalências, sem reabrir a coleta completa já concluída.

## Retomada das pendências — 2026-10-09

Maycon pediu resolver todas as pendências explicadas nesta conversa; Amanda executará o roteiro nativo (resposta explícita de Maycon). Branch atual `main`, HEAD/base `5376137cd6936cf715a894bf4ab74aba2a5a498c`, refs locais sem divergência indicada, sem fetch/Git mutável. Alterações preexistentes em requisitos/WEBFIT-22 pertencem a outra demanda e serão preservadas. Discovery/Plan anteriores reutilizados; Plane WEBFIT-19 retomado em In Progress.

Plan complementar autorizado: auditar as 597 linhas em relatório reproduzível com hashes/origens, separar correspondência textual direta de ingredientes de receitas, explicitar diferenças de preparo/variedade e fonte bloqueada. Novas aproximações apenas para revisão, nunca para ativar fallback ou declarar equivalência clínica. Conferir novamente as cinco páginas problemáticas em cópias isoladas, sem sobrescrever o snapshot revisado. Reexecutar importação/checks e ensaio de interface com dados fictícios; ampliar conferências de porção e preparação quando necessário. Preparar roteiro T097 preenchível para Amanda, que mantém aceite de domínio. Script/relatório/testes, runner e guia são os alvos; sem schema/dependência/autenticação/arquitetura nova ou banco de uso. PLAN APPROVED BY SCOPE para investigação/checks/documentação e correções técnicas comprovadas no requisito aprovado. Ensaio nativo não automatizável nesta sessão porque controle de apps nativos está desabilitado; não iniciar binário apontando para armazenamento habitual.

### Execução complementar e nova fonte corrigida

- Matriz de todas as 597 identidades em [P02-taco-review.md](P02-taco-review.md), dados/hash em [P02-taco-review.json](P02-taco-review.json); gerador `scripts/review-food-coverage.py`. 372 descrições diretas fora de listas de ingredientes, 220 decisões de identidade/alias/preparo não demonstradas, quatro fontes TACO inválidas e um fallback anteriormente qualificado. Esses status são uma **auditoria de descritores**, não equivalência clínica nem ausência TBCA. Critério mais restrito que os 511 candidatos textuais históricos; esses totais medem coisas distintas. Diferenças/candidatos/URLs/hash explicitados por linha, nenhuma ativação nova.
- Fonte TACO reparsada da planilha oficial com SHA256 fixo, não do cache derivado. Fonte TBCA corrigida reimportada com conferência de identidade, base por 100 g e hash. A matriz é artefato de revisão, não configuração do catálogo.
- Conferência direta das cinco páginas públicas: primeira tentativa Python restrita falhou URLError; ferramenta web retornou pão com duplicatas e falhou nas outras quatro. Nova leitura escalada, estritamente das cinco páginas autorizadas, teve sucesso em 2026-10-09 19:50 UTC. `BRC0004A`, `BRC0237T`, `BRC1145B`, `BRC1196B` continuam conflitantes, hashes idênticos aos snapshots anteriores. Não se escolheu variante nutricional arbitrária.
- **BRC0293T corrigido pela fonte:** página antes vazia agora apresenta omelete vegano com vegetais, código/descrição/composição completas; SHA256 anterior `b26e0f06c017dc2ccd55a355cb87e90b8daa4d18ea13c845ebc0667112eb13ad`, novo `dd8c0b16a2d1dda0148962fd6807921202f1d7f85ef56e385f5c0c9fab65900e`. Por 100 g: 119 kcal, proteína 5 g, carboidrato total 18 g, gordura 4,1 g, fibra 5,02 g. Página/manifesto anteriores preservados em cópias ignoradas; cache de composição, manifesto e catálogo atualizados somente após inspeção. Importador `--publish` validou a base completa antes de escrever arquivos de produto; sem alteração do banco. **Total atual: 5.874 identidades TBCA, 5.870 incluíveis, quatro bloqueadas**, mais um TACO. Valores ausentes atuais: fibra129, gordura39, energia8, proteína20, carboidrato12.
- Regressões frontend/Rust e ensaio de interface verificam omelete incluível/composição por 50 g, mantendo os quatro conflitos bloqueados. Porções de arroz55 g/banana50 g e arroz integral cru/cozido100 g preservadas após salvar/reabrir/backup/restauração. Total desses quatro itens585,4 kcal; exibição585. Sem atualização silenciosa de snapshots históricos.
- Runner ampliado inicialmente falhou ao preencher `50` no ValueField: isso representa0,50 no contrato de duas casas existente. Inspeção identificou a causa após tentativas com Tab/diagnóstico; fixture corrigida para `50,00`, sem alterar o comportamento aprovado do componente. UI4 passou após correção. A tentativa/falha do runner não foi ocultada nem considerada defeito de composição.
- [Roteiro Amanda](../../docs/operations/catalog-acceptance-amanda.md):13 passos, valores esperados, identificação de versão e retorno sem dados pessoais; inclui decisão D-CAT-019-002 e matriz de identidade. Execução nativa/aceite humano ainda **NOT RUN**. Alterações de tema/WEBFIT-22 e outros arquivos compartilhados pertencem a outra trilha, preservadas.

### Checks finais da retomada

Python import6 e review6 PASS; reimportação sem diferenças PASS; frontend70/lint/TypeScript/Vite PASS; UI4 Chrome/IPC fictício PASS, incluindo porções, preparações, omelete corrigido, fonte ausente, erro/lento, salvar/reabrir e viewport640. Rust/Clippy/build e review independente final registrados ao concluir abaixo. Logs/capturas em `.artifacts/visual-test/WEBFIT-19/`, source-recheck com cinco respostas/cópia anterior. Ensaio nativo e equivalências de domínio dependem do retorno da Amanda; não declarar todas as pendências concluídas por este relatório.

### Code Review complementar — resultado final

REVIEW PASSED WITH WARNINGS. `coverage_review` fez passagem independente read-only e rechecks:597 identidades únicas/contagens/hashes/descritores, planilha TACO oficial validada, ausência de aprovação clínica presumida, fonte corrigida e quatro bloqueios, cálculos/roteiro13passos e testes. Sem bloqueadores encontrados. Recheck após preservação de formatação confirmou hash do arquivo TBCA no relatório e hash BRC0293T no dado/manifesto/HTML. Autorrevisão não apresentada como aceite humano.

Estado final dos checks: frontend70/lint/TypeScript/Vite PASS; Rust63/SQLite/SQLCipher/backup/restauração PASS após correção e formato final; Python import6+review6/reimportação/reprodução da matriz PASS; UI4 PASS; fmt/Prettier/diff/Clippy PASS; Tauri debug offline/locked sem bundle PASS. Manifesto inicialmente fora de Prettier corrigido e format reexecutado PASS. Avisos de chunk TBCA/cache/linker permanecem; build não iniciado/instalado/publicado. Diff do catálogo limitado ao objeto BRC0293T; demais5.873 objetos comparados semanticamente com HEAD, inalterados. Histórico de fonte anterior preservado em artefatos ignorados. Atualização humana de HEAD durante a sessão para `50057fdb06fb081bd2e0530b3392a39c3784593d`, branch main, base5376137; sem Git mutável desta trilha.

Inventário complementar: scripts review-food-coverage/check-tbca-restrictions, teste Python food-coverage-review, matriz P02-taco-review.json/md, guia catalog-acceptance-amanda; dados/manifesto TBCA corrigidos, food-catalog.test.ts e acceptance_tests.rs, runner catalog-visual-smoke, notas da atualização, guia mvp-local-test, traceability e checkpoint. Dados de domínio e banco de uso não acessados. Sem nova decisão clínica ou arquitetura; D-CAT-019-002 mantém estado provisório anterior. **PENDÊNCIAS REAIS:** Amanda executar roteiro e informar versão/cenários;220 identidades sem correspondência direta demonstrada requerem decisão/evidência adicional antes de equivalência/fallback;quatro conflitos dependem de correção verificável da fonte. Plane permanece Review, sem Done/G5/G6/G7/aceite presumido.
