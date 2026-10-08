# Implementation Plan: Informações globais

**Branch**: `main` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)
**Work Item**: WEBFIT-6 · STANDARD · HEAD-base e07cdc8300de0421dbdc7fd64aafe7d30a191e80
**Status**: preparação concluída; D-INFO-001 e Implementation Approval pendentes.

## Summary

Reutilizar o componente de informações nos shells público e autenticado. Tornar onAdmin opcional e condicionar sua seção à presença do callback, preservando login. Montar instância interna sem callback, sem navegação ou manipulação de sessão. Fixar ícone no canto inferior direito e reservar espaço inferior para controles finais.

## Technical Context

**Language/Version**: TypeScript 5.9.3; Rust existente sem alteração.
**Primary Dependencies**: React 19.1.0, Tauri 2 e API getVersion existentes; nenhuma nova dependência.
**Storage**: nenhuma nova persistência; banco/backup/rascunhos preservados.
**Testing**: checks npm e Rust/SQLite existentes; ensaios TA-INFO-001..006 e regressão TA-UX-002.
**Target Platform**: Windows 10 x64, WebView desktop.
**Project Type**: desktop-app local/offline.
**Performance Goals**: abrir informações sem consulta a dados de domínio ou rede; consultar versão pelo mecanismo existente.
**Constraints**: dados fictícios, Git humano, UI vigente, nenhuma alteração de autenticação.
**Scale/Scope**: um componente, dois shells e CSS; todas as páginas internas existentes.

## Constitution Check

Antes da pesquisa e após design: I/III/IV/IX/X atendidos no planejamento por IDs, proposta explícita e gate humano pendente; II exige Verification/Review/Evidence na execução; V/VIII preservam autorização, banco e dados; VI/VII atendidos por reutilização. Sem exceção constitucional. Redação histórica de arquitetura para spike subordinada ao ADR-0001 aceito/DEC-042/045. Não iniciar implementação antes do gate.

## Phase 0 — Research

Pesquisa delegada somente leitura pela skill Plan, agente info_research. Componente nativo já atende informações e modal; montagem apenas no login é a causa. [research.md](research.md) consolida evidências e alternativas. Sem incerteza técnica restante; D-INFO-001 é proposta de produto para validação.

## Phase 1 — Design & Contracts

[data-model.md](data-model.md) delimita estado transitório; [contracts/information.md](contracts/information.md) define contrato UI; [quickstart.md](quickstart.md) descreve ensaios. Camada do ícone abaixo de tour/modais; reserva inferior nas media queries. Ensaiar retorno nativo do foco e corrigir explicitamente somente se necessário.

## Project Structure

### Documentation (this feature)

spec.md, checklists/requirements.md, plan.md, research.md, data-model.md, contracts/information.md, quickstart.md e tasks.md nesta pasta; evidência em .harness/evidence/webfit-6/.

### Source Code (repository root)

- src/LoginInfo.tsx: callback administrativo opcional, sem duplicação de painel.
- src/App.tsx: montar como irmão do workspace-main no shell autenticado, incluindo troca obrigatória de senha.
- src/style.css: posicionamento compartilhado e reserva inferior nos dois shells.
- docs/requirements/{functional-requirements,acceptance-criteria,traceability}.md, docs/project/{decision-log,status}.md e DESIGN.md: comportamento aprovado e rastreabilidade na execução.

**Structure Decision**: preservar componente/nome atual para reduzir diff; sem sistema paralelo de modais ou backend novo.
