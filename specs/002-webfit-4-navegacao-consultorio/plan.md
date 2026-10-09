# Implementation Plan: Navegação do Consultório

## Refinamento de movimento — 2026-10-09

- Pedido de Maycon: hambúrguer dentro do menu e animação gradual de abrir/fechar, com Impeccable e feedback nas ações. RF-UX-003/TA-NAV-009/T018; PLAN APPROVED BY SCOPE. Reuso da WEBFIT-4, Plane sync degraded, sem novas regras, banco ou dependência.
- Motion thesis: continuidade espacial da lateral e área de trabalho, abertura 300 ms/saída 220 ms com desaceleração; feedback de cores dos botões 140 ms; disclosure de conta 160 ms e diálogo 200 ms, sem animações contínuas/espera. Movimento reduzido remove deslocamento/zoom; feedback de cor permanece breve.
- Implementado em App/style: hambúrguer no sidebar-header aberto e reabertura no toolbar recolhido, foco por useLayoutEffect, lateral sempre montada com inert/aria-hidden, wrappers com clipping, grid e deslocamento interrompíveis. Formulários continuam montados. Breakpoint até 1000 px usa a mesma variável de largura para coluna e lateral; até 700 px mantém fluxo vertical com transição do grid para zero.
- Entrada: feature/pbi-001-primeiro-incremento-saude/818d097edcf473061fb634eb473f7c64a1f56af0, upstream local alinhado sem fetch. Trabalho preexistente de cadastro/componentes compartilhados/FoodPicker/harness preservado; não atribuído a este recorte. Fonte 0.1.10, sem Git mutável/publicação.
- Checks: npm run check PASS (lint/TypeScript/42 Node/build Vite), format:check PASS, issuer:build PASS pelo CSS compartilhado. Após correção exclusiva de CSS, build/format/issuer reexecutados PASS, detector `detect --json src` retornou `[]` e git diff --check PASS. Bundle 551,36 kB WARNING. Rust/SQLite/build Tauri N/A ao recorte de apresentação; testes existentes não comprovam movimento/foco reais.
- Review independente: review_patient encontrou P2 — sidebar fixa em 235 px cortada na coluna de 190 px. Corrigido via --sidebar-width compartilhada, reavaliado sem novo finding. Impeccable animate/craft-floor aplicados, identidade PRODUCT/DESIGN preservada; detector manual src sem findings. Launcher context inicialmente falhou na sessão; fontes locais consultadas, engine já preparado por outra demanda reutilizado sem instalar/dependência de runtime.
- Arquivos/documentação: App/style; spec/tasks da WEBFIT-4, critérios/rastreabilidade/status e este plano. Sem ensaio visual Windows/WebView, foco real, preferência reduzida do SO ou medição de fluidez; NOT RUN. Captura do humano é referência do estado anterior, não prova do novo.
- Resultado: REVIEW PASSED WITH WARNINGS, sem READY TO SHIP enquanto ensaio Windows estiver pendente. Próxima ação: ensaiar abrir/fechar repetidamente, teclado/foco, formulário mantido, 100/150/200% e movimento reduzido com fixtures; integração/aceite humanos. G5/G6/G7 preservados.

**Branch**: `main` (observada; DEC-054) | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md) | **Work Item**: WEBFIT-4

**Input**: spec.md desta feature. Estado: execução aprovada por Maycon em 2026-10-07, incluindo D-NAV-001/002; sem geração de instalador local. HEAD observado: adcf693ffbb9f2658390b93c9682c54e67f78a0b; árvore limpa na entrada. O helper Spec Kit retorna basename da feature em BRANCH sem contexto explícito; isso não é branch Git criada. Git real permanece main.

## Summary

Reorganizar apenas o shell existente: um hambúrguer sempre disponível, módulo Consultório, engrenagem para índice Configurações, nome para opções da conta. Reutilizar telas e função navigate; nenhuma mudança Tauri, schema, credencial, dependência ou arquitetura.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.1.0; CSS existente.
**Primary Dependencies**: existentes, sem instalação: Vite 8.0.16 e APIs Tauri 2.
**Storage**: estado de interface em memória; SQLCipher/DPAPI e rascunhos existentes preservados; sem localStorage de domínio.
**Testing**: node:test existente; lint/TypeScript/build, testes onboarding e ensaio interativo dos TA. Rust/SQLite/Tauri conforme DoD ao entregar pacote.
**Target Platform**: Windows 10 x64 em WebView; janela padrão e zoom 200%.
**Project Type**: desktop-app local/offline.
**Performance Goals**: recolher/reabrir sem operações de domínio/rede e sem desmontar formulário/updater; critério SC-001.
**Constraints**: dados fictícios, Git humano, preservar rascunhos/autorizações/tours/updater. Sem novas dependências, router ou migração.
**Scale/Scope**: um módulo, uma nova tela índice, duas opções da conta, cinco destinos existentes preservados.

## Constitution Check

Pré-pesquisa e pós-design: PASS para planejar. I/IX: RF-UX-003, TA-UX-NAV e tasks rastreáveis antes de implementar. II: verification/review/evidence previstos; planejamento não prova execução. III/IV/X: escopo humano registrado e D-NAV-001/002 ACCEPTED; execução aprovada por Maycon em 2026-10-07. V/VIII: domínio/autorização/backup preservados, sem dados reais. VI/VII: reutilização das telas/navigate sem novo framework. Direção arquitetural aceita pelo ADR-0001/DEC-042/045 prevalece sobre redação constitucional histórica de spike; este plano não propõe alteração de arquitetura ou Constitution. Git atual conforme DEC-054, mesmo em main, sem Git mutável.

## Phase 0: Research

Pesquisa local delegada conforme speckit-plan, somente leitura; resultados em [research.md](research.md). Sem desconhecidos técnicos materiais ou pesquisa externa necessária. Sem Clarify adicional: descrição humana define comportamento; detalhes reversíveis sujeitos ao review em lote.

## Phase 1: Design

Contrato [contracts/navigation.md](contracts/navigation.md); estado [data-model.md](data-model.md); roteiro [quickstart.md](quickstart.md). Hambúrguer fora do contêiner ocultável; sidebar inteira oculta e coluna removida. Não remontar conteúdo/updater por toggles. Nome usa disclosure com botões normais; engrenagem independente. Settings monta só índice, audit/backup continuam páginas existentes com retorno. Todos os destinos usam navigate.

Não criar TourId persistido para settings: omitir GuidedTour somente no índice; manter tours nas ferramentas. Revisar seletor de menu e logout com data-tour estável, fallback para hambúrguer se alvo estiver oculto. Atualizar cópia existente, sem mudar política de onboarding.

## Project Structure

### Documentation (this feature)

specs/002-webfit-4-navegacao-consultorio/: spec.md, plan.md, research.md, data-model.md, quickstart.md, contracts/navigation.md, checklists/requirements.md e tasks.md.

### Source Code (repository root)

- src/App.tsx: Page/settings, shell, estado transitório, disclosure de conta, índice/retornos, tourScreen e navigate preservado.
- src/style.css: lateral aberta/recolhida, botões, conta e índice, tamanhos reduzidos/zoom.
- src/onboarding.ts e src/GuidedTour.tsx: textos, alvos estáveis e tratamento de alvo oculto quando necessário.
- tests/unit/onboarding.test.ts: regressão relevante dos tours existentes. Sem infraestrutura DOM nova.
- docs/requirements/{functional-requirements,acceptance-criteria,traceability}.md e docs/ux/flows.md: rastreabilidade/comportamento.
- .harness/evidence/webfit-4/: verificação, review/UI gate e evidência distinguíveis após implementação.

**Structure Decision**: manter componentes de página existentes em App; extrair componente pequeno apenas se tornar a composição claramente mais simples, sem criar sistema de roteamento.

## Verification and Review

Rodar comandos existentes em quickstart após implementação. UI gate obrigatório; evidence distingue checks automatizados, revisão independente e ensaio visual Windows. Nenhum resultado não executado é declarado aprovado. Testes Rust e build Tauri não são necessários para aprovar estes Markdown; pertencem à entrega de código/pacote conforme DoD.

## Complexity Tracking

Nenhuma violação constitucional ou complexidade adicional a justificar.


## Painel da conta e confirmação de fechamento — 2026-10-09

- Discovery/Plan: STANDARD reutilizando WEBFIT-4, Plane sync degraded. Pedido explícito de Maycon aprova RF-UX-003/TA-UX-NAV-010 e RF-UX-006/TA-UX-WINDOW-003. PLAN APPROVED BY SCOPE; nenhum gate genérico/dependência/schema/alteração de autorização.
- Implementação: App mantém guarda montada entre login/sessão/legado; painel compacto com nome/papel e ícones Configurações/Sair da conta (44px, nomes acessíveis, tooltip, foco existente). Mesmo handler de salvar rascunho/logout, data-tour preservado e texto do tutorial atualizado. Separador discreto na conta; sem remodelar conteúdo clínico.
- WindowCloseGuard/window-close: interceptação síncrona do X, diálogo nativo com Cancelar inicialmente focado e Escape, checkbox controlado Não perguntar novamente. localStorage contém somente chave webfit:skip-close-confirmation com literal true, uma preferência de UI por perfil Windows; nenhum dado de domínio/session/token. Cancelar não persiste; confirmar salva rascunho, grava booleano quando marcado e destrói janela. Opt-out dispensa pergunta, preserva gravação e aguarda busy terminar; progresso modal bloqueia edição enquanto destruição/salvamento está em curso. Erro mantém janela, mostra recuperação e permite repetir/desmarcar preferência. Storage desconhecido/inacessível mantém pergunta.
- Testes: window-close.test.ts cobre padrão/opt-out, cancelamento, ordem save→remember→destroy, repetição, busy/adiamento, leitura e escrita indisponíveis, falha de salvamento e callback atualizado. window-close-dialog.test.ts renderiza o componente real para semântica/rótulo/Cancelar/disabled/status. São testes de contrato e markup; não simulam WebView/top layer/API nativa.
- Impeccable: contexto instalado reutilizado, craft-floor/polish e padrões existentes aplicados; detect --json src retornou []. Inspeção estática de largura/overflow, alvo/foco, diálogo e reduced-motion; ensaio visual Windows NOT RUN.
- Checks: frontend/check e format/issuer:build PASS no conjunto simultâneo (52 Node no estado final; build 556,61 kB, aviso de bundle >500 kB); cargo fmt PASS e cargo test --offline PASS, 46 Rust/SQLite. Cargo inicialmente ausente do PATH: usada .tools/patient-native-env.ps1 existente, sem instalação. cargo clippy --offline --all-targets -- -D warnings PASS com avisos de hard links/PDB de cache. Build Tauri final PASS: .\node_modules\.bin\tauri.cmd build --debug --no-bundle, 35,62s, candidato ignorado em .tools/patient-native-target/debug/webfit-desktop.exe. Não iniciado/instalado no host, sem bundle/distribuição. Primeiro npm run tauri perdeu flags no PowerShell; compilação interrompida com Ctrl+C antes de concluir, substituída por CLI direto. Avisos não impeditivos de PDB/colisão de nome de símbolos, cache e STATIC_VCRUNTIME.
- Autorrevisão: corrigida montagem estável da guarda entre sessões e bloqueio de edição também no opt-out. Sem finding impeditivo conhecido no escopo. CODE REVIEW INCOMPLETE: revisão independente deste recorte e ensaio Windows/foco/reabertura/fechamento ainda pendentes; não inferir READY TO SHIP/aceite. Inspecionar X nativo e o X da barra customizada simultânea (usa window.close, não destroy), cancelar/Escape, checkbox com reinício, operação pendente e falha fictícia de save_draft.
- Arquivos: App.tsx, style.css, onboarding.ts; novos WindowCloseGuard.tsx/window-close.ts e dois testes; requisitos/aceite/rastreabilidade, spec/tasks/plano e checkpoint atualizados. Alterações simultâneas de título/tutorial/backend/cadastro preservadas sem atribuí-las ao recorte. Branch atual/base 818d097, sem Git mutável/publicação por este executor.
