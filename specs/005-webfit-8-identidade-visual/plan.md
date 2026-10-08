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

## Correção da barra de tarefas — 2026-10-08

Feedback de Maycon: símbolo novo na janela, W antigo apenas enquanto o app está aberto; iniciado por atalho da área de trabalho. Continuação RF-UX-004/TA-UX-BRAND-002, autorizada no mesmo pedido. Base atual main/680fad5616d54a895dbecc6702595a1b5d232cfd; alterações WEBFIT-10/11 preservadas.

Executável instalado 0.1.9-pilot.16.1 contém seis RT_ICON correspondentes ao ICO escolhido. Atalho aponta para esse executável, com IconLocation implícita. Cache do shell é hipótese, sem confirmação. Código local Tauri runtime 2.12.1/Tao 0.37.1 configura ICON_SMALL e deixa ICON_BIG ausente.

Definir ICON_BIG no setup da janela main, carregando o recurso público WINDOWS_APP_ICON_RESOURCE_ID do módulo atual. LoadImageW com LR_DEFAULTSIZE/LR_SHARED mantém ownership no Windows; nenhum arquivo/cache/atalho do host é alterado. Ativar duas features da dependência windows-sys já existente, sem nova biblioteca. Arquivos: src-tauri/src/branding.rs, lib.rs, Cargo.toml; documentação/evidência desta demanda. Sem banco, auth, versão, publicação ou mudanças arquiteturais. PLAN APPROVED BY SCOPE.

Verificar com janela nativa oculta descartável: WM_GETICON/ICON_BIG deve mudar de ausente para presente após aplicar correção. Rodar checks existentes e build Tauri; inspeção de recursos isolada, sem iniciar produto/dados no host. Aceite visual via instalador atualizado e review independente permanecem separados.
