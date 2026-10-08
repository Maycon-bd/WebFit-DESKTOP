# Implementation Plan: WEBFIT-8

**Branch**: `main` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md).
**Base**: e07cdc8300de0421dbdc7fd64aafe7d30a191e80. STANDARD. Pedido explícito autoriza aplicação local; aceite final separado.

## Summary

Versionar PNG transparente escolhido em public/brand/webfit-icon.png. Gerar derivados com CLI Tauri instalado; substituir conjunto nativo da raiz, configurar NSIS, substituir duas wordmarks, incluir imagem no Sobre e favicon. Sem dependências novas.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.1.0, Rust edition 2021.
**Primary Dependencies**: Vite 8.0.16, Tauri CLI 2.11.3 existentes.
**Storage**: recursos estáticos; nenhum banco afetado.
**Testing**: format/lint/typecheck/Node, Rust/SQLite, build Tauri, inspeção PNG/ICO/PE.
**Target Platform**: Windows 10/11 e WebView.
**Project Type**: desktop local.
**Performance Goals**: recurso local sem rede; dimensões explícitas.
**Constraints**: símbolo sem texto, transparência, identidade/versão estáveis; sem Git/publicação/instalação no host.
**Scale/Scope**: sete pontos existentes e derivados nativos já versionados.

## Constitution Check

PASS antes/após design: RF-UX-004/DEC-056 e critérios explícitos; evidências e limitações; complexidade mínima, CLI existente, dados/segurança intactos. ADR-0001/DEC-045 prevalecem sobre texto histórico de estágio spike na Constitution. DEC-054 rege Git.

## Project Structure

Documentos nesta pasta: spec/plan/research/data-model/quickstart/tasks, contracts/branding.md e checklist.
Produto: public/brand/webfit-icon.png; src/App.tsx; src/LoginInfo.tsx; src/style.css; index.html; src-tauri/icons/**; src-tauri/tauri.conf.json.
Evidência: .harness/evidence/webfit-8/.
**Structure Decision**: fonte única pública e derivados nativos; nenhuma biblioteca/serviço/componente novo para três imagens.

## Complexity Tracking

Nenhuma exceção.
