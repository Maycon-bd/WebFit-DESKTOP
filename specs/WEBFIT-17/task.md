# WEBFIT-17 — Dashboard geral do consultório

2026-10-09 / STRICT / Maycon / branch `feature/pbi-001-primeiro-incremento-saude` / HEAD `88387e46266dbfc6e1e47363da595db545695ddd`.
Plane: `d9a336c7-0171-4ed0-9f13-3ae09f78df20`, WEBFIT-17. Pedido explícito de Maycon neste chat; referência visual anexada é design, não fonte de regras de domínio. Somente dados fictícios. Alterações preexistentes preservadas.

## 1. Discovery — DISCOVERY COMPLETE

Home atual: Pacientes. Resultado solicitado: Dashboard acima de Pacientes, inicial após login, acessível pelo ícone WebFit e extensível conforme módulos futuros. RF-UX-008 / TA-DASH-001..005, aprovados para implementação pelo pedido de Maycon; sem aceite funcional presumido. Risco: contagens globais não podem depender da lista limitada a 200; preservar autenticação, licença, senha obrigatória, rascunhos e update.

## 2. Plan — PLAN APPROVED BY SCOPE

Componente `src/Dashboard.tsx`, tipos/formatadores em `src/dashboard-data.ts`, integração em `src/App.tsx`, estilos específicos em `src/style.css`; agregação em `src-tauri/src/dashboard.rs` exposta pela operação autenticada `dashboard`. Consulta de snapshot consistente sem identificadores/payloads clínicos, sem novo schema, migration, dependência, instalação, permissão ou integração. Gráfico com alternativa textual acessível; estados carregando/vazio/erro e repetir.

Decisões AGENT-PROVISIONAL não bloqueantes, alta confiança, reversíveis, validação no aceite: D-DASH-001 indicadores iniciais de pacientes ativos/arquivados e versões de prescrições por estado (derivação das entidades existentes, sem julgamento clínico); D-DASH-002 período seis meses com opção doze, somente gráfico mensal por criação UTC, cartões totais sem filtro; D-DASH-003 composição da referência com paleta WebFit e atalhos existentes, sem agenda/financeiro fictícios. Alternativa descartada: carregar listas completas e somar na WebView (limite de 200 e exposição desnecessária). Não implementa extensão automática ou framework genérico de widgets: acrescentar indicadores por requisitos futuros.

Checks: npm check/formatação; Rust fmt/clippy/test com SQLCipher e fixtures; build Tauri sem bundle; smoke isolado pronto/vazio/erro/lento, gráfico/período/home/logo e regressão dos pacientes, estreito/zoom. Review independente autorizado pelo fluxo Impeccable. Sem Git mutável/publicação.

## 3. Execução

EXECUTION COMPLETE. Frontend: Dashboard + tipos/formatadores, App (home/menu/logo/atalhos/expiração), CSS próprio. Backend: dashboard.rs + Action Dashboard em service.rs/lib.rs. Testes: dashboard.test.ts, dashboard.rs/tests.rs, mock-service.ts, dashboard-visual-smoke.mjs e adaptação visual-smoke.mjs. Documentação: este registro, RF/aceite/rastreabilidade, scope, DESIGN e status. Sem migrations/dependências/Git mutável.

## 4. Code Review

REVIEW PASSED WITH WARNINGS. Revisores independentes /root/dashboard_review e /root/dashboard_documentation, leitura de recorte/capturas/documentação. Primeira passagem identificou P2 mensagem de sessão perdida, P2 captura loading inadequada e P3 falta de capturas inferiores; callback corrigido, smoke de sessão expirada e capturas adicionais adicionados. Verdict pass: três resolved, disposition ship no recorte. Documenter confirmou extensão visual e correção de nome dashboard-data.ts. Sem reparo de drift alheio. Aceite humano e ensaio Windows/WebView2 permanecem separados.

### Evidence final

| Check | Resultado / ambiente / limite |
|---|---|
| npm run check | PASS, 55 Node + lint/TypeScript/build Vite, Windows/Node 22 |
| npm run format:check; visual tsc; git diff --check | PASS; check documental e tipos dos mocks |
| cargo fmt --check / clippy offline locked all-targets -D warnings | PASS; warnings ambiente cache, sem lint ignorado |
| cargo test offline locked | PASS, 60; SQLCipher real, migração/banco vazio/backup/restore/DPAPI em fixtures fictícias graváveis no workspace |
| node scripts/dashboard-visual-smoke.mjs | PASS, pronto/vazio/lento/falha-repetição/sessão expirada; home/menu/logo/gráfico/tabela/atalhos/rascunho/reflow e CSS zoom 200%, Chrome headless com mock |
| node scripts/visual-smoke.mjs | PASS, quatro cenários regressão login/validação/pacientes |
| Tauri build --debug --no-bundle offline locked | PASS; executável não iniciado/instalado; sem bundle/instalador/release |
| Impeccable engine/detector | NOT RUN, engine 0.1.12 ausente, sem instalação; referências/manual/review independente disponíveis |
| Windows/WebView2/aceite funcional | NOT RUN, Chrome mock não comprova backend+UI integrados; ação humana pendente |

Logs/capturas ignorados em `.artifacts/visual-test/WEBFIT-17/`, incluindo `rust-tests.log`, `frontend-check.log`, `tauri-build.log`, `visual-check.log`, `results.json`, capturas ready/empty/error/slow/loading/unauthorized e inferiores compact/narrow/zoom200. Regressões pacientes em `.artifacts/visual-test/WEBFIT-15/headless/`. Falhas intermediárias: colisão de nomes Dashboard.tsx/dashboard.ts no Windows (renomeado dashboard-data.ts), lifetime da query Rust (binding local), CSS global dl e zoom (escopo/container queries), teste auth ordenado após happy path (token inválido revoga), backups em TEMP fora workspace (fixtures locais), mock de expiração durante login sobrepunha erro por consulta drafts (teste de expiração isolado após sessão estabelecida). Nenhum teste removido/enfraquecido, proteção do backend preservada.

Security: leitura agregada autenticada/licenciada, períodos 6/12 validados, snapshot transacional e consulta parametrizada; nenhum identificador/payload/segredo/log clínico. Schema v3/backup/restore preservados. UI: revisão visual independente por capturas e código, estados, semântica, tabela alternativa e foco via navegação; ensaio completo teclado/contraste/WebView2 permanece limite, não inferido.

Agent Decisions: três AGENT-PROVISIONAL, zero aprovações humanas inventadas, zero decisões sensíveis novas. Próxima ação: confirmar indicadores, testar no Windows e aceitar funcionalmente. READY TO SHIP somente no recorte técnico com warnings, sem liberar uso clínico/G5-G7/Done/publicação. Plane Review. Branch/base/upstream local 0/0 preservados. Sem commit/push/instalação.

## Extensão — histórico anual de consultas, 2026-10-09

### Discovery / Plan

Pedido de Maycon + confirmação explícita: preparar histórico de consultas realizadas por ano com estado vazio até o módulo existir. Referência anexada usa cadastros de pacientes, mas o título/propósito solicitado é consultas realizadas. RF-AGE-001 permanece proposto; não implementar cadastro/schema nem interpretar prescrições/visualizações de paciente como consultas.

RF-UX-008 complemento / TA-DASH-006..008 aprovado para implementação pela resposta de Maycon em 2026-10-09. STANDARD frontend, sem leitura nova de dados de saúde. DISCOVERY COMPLETE / PLAN APPROVED BY SCOPE. Arquivos: novo `src/ConsultationHistory.tsx`, inclusão em Dashboard.tsx, CSS específico, smoke dashboard, docs RF/aceite/rastreabilidade/DESIGN/status. Componente mostra título, seletor de ano e Jan–Dez em painel claro/verde da identidade WebFit. Mensagem distingue recurso indisponível de zero consultas; não mostra valores fictícios ou coluna quantitativa simulada. Indicadores/fluxos existentes preservados.

D-DASH-004 AGENT-PROVISIONAL, baixo risco/reversível: ano corrente e quatro anteriores como intervalo inicial de visualização (não limita futuro histórico armazenado). Não criar framework ou contrato de consulta inexistente. Teste observável no smoke: ano corrente/alteração de ano, doze meses, aviso indisponível, nenhuma barra/contagem de consultas, navegação/rascunho e reflow. Frontend check/formatação/typecheck visual/diff/build Vite. Rust/SQLite/migration/Tauri build não aplicáveis a esse recorte somente visual; evidência anterior de backend não apresentada como novo ensaio. Review independente e capturas desktop/estreito/zoom. Aceite humano separado.

### Execução da extensão

EXECUTION COMPLETE. Criado `src/ConsultationHistory.tsx`, incluído após os quatro indicadores de Dashboard.tsx, CSS `consultation-*`, seletor via FormField. Ano corrente e quatro anteriores; título do estado indisponível acompanha seleção; lista Jan–Dez. Mantidos pacientes, prescrições, atalhos e navegação. Sem operação API/migration/schema/persistência ou zero demonstrativo de consultas.

Checks desta extensão: `npm run check` PASS (55 Node, lint, TypeScript, Vite); `npm run format:check`, `npx tsc --project tests/visual/tsconfig.json --noEmit` e `git diff --check` PASS. `node scripts/dashboard-visual-smoke.mjs` PASS em cinco cenários com novas assertions ano corrente/ano anterior/doze meses/ausência de barras fictícias, mais regressões da dashboard. Screenshots `ready-consultation.png`, `consultation-narrow.png`, `consultation-zoom200.png` em `.artifacts/visual-test/WEBFIT-17/`, Chrome headless/mocks, CSS zoom 200%. Rust/SQLite/Tauri NOT APPLICABLE à extensão frontend; resultados anteriores são históricos. Não comprova módulo de consultas, Windows/WebView2 ou aceite humano. Alterações concomitantes externas em versão/config/lockfiles/lateral preservadas; branch/HEAD permanecem iguais. Revisão independente em andamento.

### Code Review da extensão

REVIEW PASSED WITH WARNINGS / disposition ship no recorte TA-DASH-006..008. `/root/consultation_review` revisou código/documentação/capturas desktop/480px/zoom200, sem finding P0–P3; `/root/dashboard_documentation` confirmou fidelidade documental da extensão. Não executaram teclado/leitor de tela/Windows nativo. Resultados de smoke/mock e frontend preservados; engine/detector indisponível, sem instalação. D-DASH-004 continua AGENT-PROVISIONAL, aceite no Windows e futuro RF-AGE-001 pendentes. Próxima ação: Maycon validar apresentação e, quando priorizado o módulo consultas, definir estados/regras/fonte de histórico com autoridade de domínio. Nenhum Git/publicação/instalação/Done.
