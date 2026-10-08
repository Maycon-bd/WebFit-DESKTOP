# Implementation Plan: WEBFIT-9

**Branch**: main | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)
**Input**: proposta apresentada e implementação autorizada por Maycon. Helper BRANCH é nome lógico da feature; Git real permanece main/e07cdc8300de0421dbdc7fd64aafe7d30a191e80.

## Summary
Consultar em sessão pelo mecanismo existente, substituindo cache eterno. Faixa global compacta acima da lateral/conteúdo, preservando formulários e instalação protegida.

## Technical Context
**Language/Version**: TypeScript 5.9.3, React 19.1.0; Rust 2021 intacto.
**Primary Dependencies**: Tauri 2/Vite existentes; nenhuma instalação.
**Storage**: somente memória; sem schema/migração.
**Testing**: Node com relógio/eventos controlados, npm check/format, Cargo fmt/clippy/test incluindo SQLite fictício. Distribuição pelo pipeline humano; instalador local dispensado conforme DEC-055.
**Target Platform**: desktop Windows/WebView, teclado e zoom 200%.
**Project Type**: desktop-app.
**Performance Goals**: 30 minutos, retorno com cooldown um minuto, uma consulta em andamento por sessão; timeout backend existente de 15s.
**Constraints**: checks não usam task/busy; cleanup e guarda de resposta antiga; pausa durante instalação; backend/release/banco intactos.
**Scale/Scope**: src/{App,UpdatePanel}.tsx, src/update-check.ts, src/style.css, tests/unit/update-check.test.ts; preservar branding concorrente.

## Constitution Check
Pré/pós-design PASS: requisito identificado/aprovado, aceite explícito; ADR-0001/DEC-045 prevalecem sobre texto histórico de spike da Constitution. Git só leitura. Sem mudança sensível. Verification/Review independentes previstos; aceite Windows/G6/G7 não inferidos. D-UPD9-001 provisória permitida, reversível.

## Phase 0: Research
[research.md](research.md). Pesquisa delegada concluída: backend suporta checagem repetida sem escrita/renovar sessão. Deduplicação em memória, relógio injetável e cleanup.

## Phase 1: Design
[data-model.md](data-model.md), [contracts/ui.md](contracts/ui.md), [quickstart.md](quickstart.md). Checker compartilha promise por token/TTL. Subscription independente de React para testar timers/focus/visibility/cleanup e pausa. UpdatePanel preserva progresso e adia por versão. Wrapper application-frame reserva faixa no topo, shell restante com altura disponível e scroll sem remontar formulários; em janela estreita shell rola abaixo da faixa. Detalhes sob demanda preservam notas.

## Project Structure
Artefatos em specs/006-webfit-9-faixa-atualizacao/. Evidence em .harness/evidence/webfit-9/. Ampliar componentes existentes, sem arquitetura nova.
