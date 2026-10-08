# Tasks: WEBFIT-8 — identidade visual

**Input**: spec/plan/research/data-model/quickstart, contracts/branding.md. **Branch**: main.
Checks existentes; não criar testes que apenas espelham markup. Aplicação solicitada no chat.

## Phase 1: Setup

- [x] T001 Registrar RF-UX-004/DEC-056, aceite e rastreabilidade em docs/requirements/ e docs/project/decision-log.md.

## Phase 2: Foundational

- [x] T002 Copiar fonte escolhida para public/brand/webfit-icon.png e verificar quadrado/alpha (FR-001).

## Phase 3: User Story 1 — Windows

Teste independente: ICO/PE e pacote.

- [x] T003 [US1] Gerar src-tauri/icons/** pelo CLI Tauri da fonte escolhida (FR-001/002).
- [x] T004 [US1] Configurar NSIS installerIcon/uninstallerIcon em src-tauri/tauri.conf.json preservando versão/identificador (FR-002/004).

## Phase 4: User Story 2 — interface

Teste independente: build e inspeção visual.

- [x] T005 [US2] Substituir wordmarks e incluir símbolo no Sobre em src/App.tsx, src/LoginInfo.tsx, src/style.css com alt/dimensões e lateral recolhida preservados (FR-003/004).
- [x] T006 [P] [US2] Adicionar favicon local em index.html (FR-003).

## Phase 5: Verification and evidence

- [x] T007 Executar checks/build Tauri/inspeção recursos e registrar limites em .harness/evidence/webfit-8/verification.md (FR-001..004/SC-001..003).
- [x] T008 Convergir por spec/plan/tasks, revisar escopo, documentar manutenção em docs/ux/system-branding.md e evidência/checkpoint em .harness/evidence/webfit-8/evidence.md e docs/project/status.md.

## Dependencies / parallel opportunities / strategy

- [x] T009 [US1] Corrigir ICON_BIG na inicialização Windows e executar teste nativo isolado, checks/build; atualizar evidência e checkpoint (RF-UX-004/TA-UX-BRAND-002, feedback 2026-10-08). Review independente/aceite visual do piloto atualizado pendentes.

T001 → T002 → T003/T004 → T005/T006 → T007 → T008. T006 independente de T005. Execução sequencial suficiente, sem agentes extras. MVP Windows primeiro, depois interface. Aceite Windows/review independente separados de checks.
