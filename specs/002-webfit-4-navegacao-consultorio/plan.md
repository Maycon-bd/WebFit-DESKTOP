# Implementation Plan: Navegação do Consultório

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
