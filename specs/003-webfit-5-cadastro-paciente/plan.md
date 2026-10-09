# WEBFIT-5 — Plano e evidência

## Retorno no cabeçalho — 2026-10-09

Pedido explícito de Maycon com captura: Voltar à lista no topo, sem duplicação ao lado de Salvar cadastro. Ajuste LIGHT de apresentação, Plan inline aprovado pelo escopo RF-PAT-007/TA-PAT-019; branch/base feature/pbi-001-primeiro-incremento-saude/818d097, sem Git mutável. PatientForm mantém o botão no Heading, remove o inferior e move a orientação patient-exit-help para abaixo do cabeçalho; onClose, bloqueio busy e rascunho preservados. Alterações anteriores de menu/componentes/cadastro preservadas. Check/review final registrado no checkpoint; ensaio visual Windows pendente. Sem backend/banco/dependência/distribuição.

Fechamento: npm run check PASS (lint/TS/42 testes/build), format:check e diff PASS; bundle 551,23 kB WARNING. Primeiro teste de interação dependia do índice fixo do formulário; após mover a orientação, corrigido para localizar pelo tipo form e repetido PASS sem enfraquecer assertions. Review independente review_patient confirmou botão único/id único/handlers preservados. REVIEW PASSED WITH WARNINGS; Windows NOT RUN. Rust/SQLite/build Tauri N/A ao ajuste de apresentação. Próxima ação: ensaio fictício do retorno pelo topo/rascunho e aceite humano; nenhuma distribuição.

## Refinamento visual — 2026-10-09

- Origem: pedido explícito de Maycon com captura do cadastro; RF-PAT-007/TA-PAT-018/T017. PLAN APPROVED BY SCOPE, sem novo obrigatório, schema, regra clínica ou dependência. Reuso deste pacote, Plane sync degraded.
- Entrada: feature/pbi-001-primeiro-incremento-saude/818d097edcf473061fb634eb473f7c64a1f56af0; avanço humano desde checkpoint anterior reconhecido. Alterações preexistentes de extração de Field/DateInput/SearchInput/DataTable, FoodPicker e CSS preservadas; formatação em App não atribui tais mudanças a este recorte.
- Implementado: `*` nos rótulos de nome/nascimento/sexo e legenda; estado de tentativa ativado pelo evento inválido ou submit. Inputs inválidos recebem borda vermelha depois da tentativa; grupo de sexo sem seleção recebe contorno. Mensagens junto aos obrigatórios ausentes, `aria-invalid` e `aria-describedby`; corrigir os dados remove a indicação. Validação HTML nativa permanece ativa, sem envio inválido. Nome só com espaços é bloqueado localmente por customValidity/reportValidity; editar limpa customValidity.
- Arquivos do recorte: PatientForm em src/App.tsx, src/PatientSexField.tsx, regras scoped src/style.css, tests/unit/patient-sex.test.ts; spec/tasks/aceite/rastreabilidade/status atualizados. Fonte 0.1.10, sem distribuição.
- PASS: `npm run check` (lint, TypeScript, 42 testes Node e build Vite), `npm run format:check`, `git diff --check`. Suíte agrega quatro testes preexistentes de componentes compartilhados; novo teste do recorte usa o formulário real/hook state controlado, evento inválido, erros associados, correção e submit com nome só com espaços sem backend. Teste comprova chamada a reportValidity, não foco real; limpeza de customValidity ao editar revisada estaticamente.
- Review independente: review_patient, duas passagens; finding P2 sobre nome só com espaços corrigido/testado e reavaliado sem novo finding. Cor/semântica/CSS analisados estaticamente, seguindo padrões/tokens existentes. Impeccable context falhou no launcher com cache_directory_failed; contexto PRODUCT/DESIGN e playbooks lidos diretamente, sem instalar ferramenta.
- WARNING: bundle 550,72 kB. Rust/SQLite/build Tauri N/A neste recorte exclusivo de frontend; resultados nativos anteriores abaixo não são reexecução deste ajuste. Ensaio interativo Windows/zoom/leitor de tela NOT RUN; não afirmar eficácia visual integrada ou aceite.
- Resultado: REVIEW PASSED WITH WARNINGS; sem READY TO SHIP enquanto ensaio Windows da demanda permanecer pendente. Sem dados reais/Git mutável/publicação. Próxima ação: ensaio fictício de salvar vazio, corrigir cada campo, sexo via teclado e nome só com espaços; integração/aceite pelo humano.

> Verificação nativa retomada após “Sim” de Maycon à preparação do toolchain. Rust/Cargo 1.98.1 encontrado e reutilizado em `.tools/validation`; variáveis restritas ao processo. Cache isolado `.tools/patient-native-target`, TEMP próprio com fixtures. A tentativa no target compartilhado aguardava file lock de outra demanda e foi interrompida apenas para esta execução. Nenhum outro processo foi interrompido. Última verificação em 2026-10-09, HEAD 538091c4b25b1cba2ff566c885b9bd255c019a68, main/origin-main alinhados pela referência local, sem fetch.

**Data:** 2026-10-08. **Branch/base:** main/3558eddd84211e504ba0457388b1bedc30c9697d. Fonte 0.1.10, sem nova distribuição. Profundidade STRICT. [Escopo e aprovação](spec.md#origem-e-decisões).

## Plan Scope Check

PLAN APPROVED BY SCOPE: pedido e respostas de Maycon cobrem os três obrigatórios, demais opcionais, número sem zeros e migração necessária preservando dados/backups com fixtures. Origem funcional: solicitação de Amanda relatada por Maycon. D-PAT-001/003 aceitas; D-PAT-002 provisória não bloqueante para preservar legado sem inferência. Nenhuma dependência/arquitetura nova, dados reais, Git mutável ou publicação. Aceite final separado. Plane indisponível, ID WEBFIT-5 conhecido reutilizado (PLANE SYNC DEGRADED).

## Abordagem executada

1. Migration **003_optional_patient_cpf.sql**, sem alterar 001/002. Schema atual antes desta mudança é 2 (licenciamento). Runner transacional 0/1/2→3, recusa futuro. `internal_number INTEGER PRIMARY KEY AUTOINCREMENT`, UUID `NOT NULL UNIQUE`, CPF `NULL UNIQUE`. Legado ordenado por created_at/id, conteúdo e relações preservados.
2. FKs ON; tabelas TEMP em memória recebem vínculos e todas as versões de prescrições. Retirar linhas filhas, reconstruir pacientes e repor vínculos dentro da transação. Validar integridade/FKs antes do commit; rollback em erro. Evitar DROP de pai ainda referenciado por linhas vivas.
3. Antes de migrar instalação 1/2, snapshot SQLCipher via API SQLite Backup, validado, fechado e reaberto com a mesma chave protegida por DPAPI. Falha bloqueia migration. Cópia fica em migration-snapshots/UUID.db, local/não portátil. Banco vazio e staging restaurado dispensam snapshot extra; backup original continua íntegro.
4. Restore aceita schemas 1/2/3, exige metadata concordante, migra staging e verifica integridade. Envelope continua v1. Preserva credenciais/licença/consumo do destino, autores históricos, auditoria append-only, backup preventivo e bloqueio após sucesso. Importa números de schema3 e conserva maior contador. Legado 1/2 reutiliza números conhecidos por UUID e aloca desconhecidos acima do contador do destino.
5. Backend exige somente nome/nascimento/sexo F/M, valida opcionais informados, ignora número/ID do payload e retorna número gerado. CPF vazio é NULL; lista sem máscara fictícia quando ausente. Pesquisa inclui número exato, preservando busca textual existente.
6. Formulário com radios nativos sem default, responsáveis opcionais, número na lista/cadastro inclusive imediatamente após salvar. Equivalências de sexo legado apenas em exibição/envio; valor desconhecido preservado até escolha. Campos ausentes antigos recebem defaults de formulário sem gravar automaticamente. Acessibilidade, foco e layout existente preservados.

## Arquivos da entrega

- Frontend: `src/App.tsx`, `PatientSexField.tsx`, `api.ts`, `style.css`, `onboarding.ts`.
- Backend/banco: `src-tauri/src/{database,service,recovery,lib}.rs`, `src-tauri/migrations/003_optional_patient_cpf.sql`.
- Testes: `src-tauri/src/patient_tests.rs`; ajustes de fixtures/versão em `tests.rs`, `acceptance_tests.rs`, `license_tests.rs`; `tests/unit/patient-migration.test.ts`, `patient-sex.test.ts`.
- Fontes: requisitos/regras/aceite/casos/matriz; `docs/architecture/data-model.md`, `docs/operations/backup-restore.md`, decisões/status e este pacote WEBFIT-5. Evidência histórica de 2026-10-07 preservada.
- Preexistentes preservados: AGENTS.md, ui-review.md, WEBFIT-10/task.md, LoginInfo.tsx e alterações anteriores de style.css/status/acceptance-criteria.

## Verificação

| Check | Resultado e limite |
|---|---|
| SQL migration real em SQLite Node 3.49.1 | PASS: CPF NULL múltiplo, unicidade, UUID/payload/filhos, ordem dos números e rollback por FK diferida; complementar a SQLCipher |
| SSR/componentes React | PASS: radios, exclusividade, ausência de default, legado/ausente, callbacks, formulário real com apenas três campos obrigatórios e número sem zeros |
| npm run check | PASS na rodada de fechamento: lint, TypeScript, 37 testes Node e build Vite; bundle 549,67 kB WARNING. Inclui três testes da demanda simultânea de backup; sete testes específicos de paciente/migração permanecem PASS |
| npm run format:check | PASS após últimas alterações de frontend/testes |
| Rust/SQLCipher/DPAPI | PASS: `cargo test --locked --offline --manifest-path src-tauri/Cargo.toml`, 46 testes, zero falhas; inclui regressões da demanda simultânea de auditoria/backup |
| Rust fmt/Clippy | PASS: `cargo fmt --manifest-path src-tauri/Cargo.toml --check` e `cargo clippy --locked --offline --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` |
| Build Tauri | PASS: `node node_modules/@tauri-apps/cli/tauri.js build --debug --no-bundle -- --locked --offline`; executável local `.tools/patient-native-target/debug/webfit-desktop.exe`, sem installer/bundle/publicação |
| Windows integrado, teclado/NVDA/zoom | NOT RUN: compilação e testes automatizados não substituem ensaio interativo/aceite |
| Revisão independente | Três passagens estáticas pelo agente review_patient, sem finding funcional concreto aberto. Ressalva do contador da origem atendida com transferência schema3 para destino vazio, agora PASS nativo |

Os testes Rust comprovaram validação direta/autorização, ID/número, obrigatórios/opcionais, arquivo anterior, snapshot cifrado reaberto, rollback, schema futuro, backups1/2/3 e sequência. A transferência schema3 para destino vazio inclui origem com contador maior que o último paciente restante; próximo número preserva esse contador. Erros HMAC SQLCipher na saída pertencem ao teste negativo de chave incorreta, aprovado. Warnings LNK4099 de símbolos PDB OpenSSL não impediram os testes. Primeiro teste Node de rollback esperava erro na inserção, mas FKs diferidas só falham no commit; corrigido para testar COMMIT e rollback real, sem enfraquecer integridade.

## Riscos e decisões provisórias

Sem READY TO SHIP enquanto ensaio Windows estiver pendente. Snapshot local requer chave DPAPI original; não substitui backup portátil. D-PAT-002 continua provisória para aceite final. Numeração automática pode ter lacunas, nunca deve ser renumerada para preenchê-las. Não há definição de identidade global pelo número; UUID mantém vínculos.

A estratégia SQL foi provada tanto no SQLite Node quanto no SQLCipher nativo. A indisponibilidade inicial de Cargo foi superada após autorização de preparação e reutilização do cache local. Nenhuma instalação clínica real foi aberta ou migrada.

Fontes técnicas verificadas: [SQLite AUTOINCREMENT](https://www.sqlite.org/autoinc.html), [TEMP store](https://www.sqlite.org/pragma.html#pragma_temp_store). Nenhuma alteração de stack ou ADR material. [Histórico](../../.harness/evidence/webfit-5/planning.md) não é plano de execução vigente.

## Code Review e resultado

Autorrevisão corrigiu apresentação imediata do número, abertura de legado sem sexo/tags e identidade do rascunho (UUID/número carregados do backend prevalecem sobre draft antigo). SSR do formulário completo comprovou apenas os três campos obrigatórios e rótulos opcionais. Revisão independente estática sem findings funcionais abertos; não substitui teste integrado.

**Resultado: REVIEW PASSED WITH WARNINGS, sem READY TO SHIP enquanto o ensaio Windows/aceite estiver pendente.** Segurança revisada e integração testada: autorização Tauri preservada, SQL parametrizado/transações/FKs, snapshots cifrados, ausência de logs sensíveis. UI revisada estaticamente/SSR, sem ensaio visual/teclado Windows. Rust/SQLCipher/DPAPI e cargo fmt/clippy/test PASS. A tentativa inicial sem Cargo é histórica; não representa bloqueio atual. Build de desenvolvimento não é instalador ou distribuição.

Build Tauri PASS com warnings ambientais de PDB OpenSSL ausente (LNK4099), colisão do nome PDB de bin/lib e STATIC_VCRUNTIME deprecado. Não houve falha de compilação; não ampliado o escopo para mudar configuração/dependências. Bundle Vite final 549,67 kB WARNING, refletindo checkout com trabalho simultâneo preservado. Nenhuma nova versão distribuída.

Alterações concorrentes observadas em auditoria/backup (src-tauri/src/audit_recovery_tests.rs, trechos adicionais de lib/service/recovery, specs/001-primeiro-incremento-saude/plan.md e frontend relacionado) foram preservadas, não atribuídas à WEBFIT-5 nem cobertas como entrega independente por este review. Checks disponíveis registram o checkout no momento da execução; rerodar os afetados se outra demanda modificar as entradas.

Próxima ação: ensaiar cadastro/numeração/migração/restore no Windows com fixtures e obter aceite. Integração/distribuição controladas por Maycon. Sem banco real, commit/push/publicação ou versão distribuída nesta sessão. Plane sync degraded; G5 em execução e G6/G7 preservados.

### Continuação solicitada — 2026-10-08

Conferida conclusão da rodada frontend (37 testes, lint/TS/build/Prettier PASS). HEAD observado 538091c4b25b1cba2ff566c885b9bd255c019a68, main/origin-main alinhados pela referência local; avanço externo sobre base 3558edd, sem operação Git deste chat. Mudanças locais e trabalho simultâneo preservados. Busca inicial não encontrou Cargo; preparação posteriormente autorizada por “Sim” e cache local reutilizado. Verificação nativa concluída conforme tabela, sem reabrir requisito, origem de Amanda ou autorização da migração.

## Refinamento do filtro da lista — 2026-10-09

- Pedido de Maycon: um único seletor em vez dos botões Ativos/Arquivados. Implementado como `<select>` nativo acessível, com seta, nome acessível “Situação dos pacientes” e “Ativos” selecionado ao entrar. O mesmo estado `archived` continua dirigindo a consulta existente; busca e persistência não mudaram.
- Regressão: fixture fictícia arquivada adicionada ao mock; `node scripts/visual-smoke.mjs` PASS nos quatro cenários, incluindo default Ativos, troca para Arquivados e retorno a Ativos. Captura visual `ready.png` inspecionada. `npm run format:check`, Prettier dos arquivos do runner, `npm run check` (lint, TypeScript, 54 Node e Vite) e `git diff --check` PASS. Vite emitiu aviso de bundle 573,08 kB acima de 500 kB.
- Escopo LIGHT, reuso de WEBFIT-5/RF-PAT-002/TA-PAT-020; não altera backend, esquema ou regras. Ensaio nativo WebView2/teclado no Windows e aceite permanecem pendentes.
