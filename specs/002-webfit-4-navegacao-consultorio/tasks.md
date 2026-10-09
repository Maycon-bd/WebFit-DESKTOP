# Tasks: Navegação do Consultório

**Input**: spec.md, plan.md, research.md, data-model.md e contracts/navigation.md desta feature.
**Work Item**: WEBFIT-4. **Branch**: main (DEC-054). **Status**: execução aprovada por Maycon em 2026-10-07; D-NAV-001/002 ACCEPTED. Sem instalador local; distribuição pelo pipeline/updater após Git humano.
**Tests**: regressões de onboarding e ensaios TA-UX-NAV solicitados na spec; manter infraestrutura existente, sem testes que espelhem markup.

## Phase 1: Setup

- [x] T001 Conferir escopo/autorizações e baseline de App/onboarding/updater em src/App.tsx e specs/002-webfit-4-navegacao-consultorio/plan.md, preservando alterações posteriores e mantendo branch ativa.
- [x] T002 Revisar rastreabilidade RF-UX-003/TA-UX-NAV-001..008 em docs/requirements/traceability.md e specs/002-webfit-4-navegacao-consultorio/spec.md antes do código.

## Phase 2: Foundational

- [x] T003 Integrar destino settings e estado UI em src/App.tsx: sidebarOpen boolean inicialmente true e accountOpen boolean inicialmente false; todos os destinos passam por navigate; must_change continua impondo AccessPage; ocultar sidebar implica accountOpen false; FR-001/004/005/006/008.

## Phase 3: US1 — Menu e Consultório (P1)

**Independent test**: ocultar/reabrir lateral durante edição preserva tela/campos; apenas Consultório/Pacientes aparecem no menu.

- [x] T004 [US1] Implementar hambúrguer fora do contêiner ocultável e módulo Consultório com Pacientes em src/App.tsx; não remontar formulário/UpdatePanel, não mudar page por toggle; FR-001/002/008.
- [x] T005 [US1] Aplicar estados aberto/recolhido e remover coluna lateral inteira em src/style.css, incluindo janela reduzida/zoom 200%, labels e foco visível; FR-001/008.
- [x] T006 [US1] Atualizar tour geral/seletores do menu em src/onboarding.ts e tratamento de alvo oculto em src/GuidedTour.tsx quando necessário, com alvo estável no hambúrguer e sem abrir menu automaticamente; FR-007.
- [x] T007 [US1] Executar TA-UX-NAV-001/002 e partes de 007/008 via specs/002-webfit-4-navegacao-consultorio/quickstart.md; registrar campos/teclado/janela e limitações em .harness/evidence/webfit-4/verification.md; SC-001/003/004.

## Phase 4: US2 — Configurações (P1)

**Independent test**: engrenagem abre índice; selecionar ferramenta abre tela existente; índice sozinho não registra abertura da auditoria.

- [x] T008 [US2] Implementar engrenagem junto ao nome, índice Configurações e retornos de audit/backup em src/App.tsx; montar ferramentas só na seleção e preservar regras/confirmar/restaurar; FR-003/004/006.
- [x] T009 [US2] Estilizar índice e engrenagem no padrão existente em src/style.css, com nomes acessíveis e ordem visual/foco; FR-003/008.
- [x] T010 [US2] Executar TA-UX-NAV-003/004 e regressões de auditoria/backup via specs/002-webfit-4-navegacao-consultorio/quickstart.md; registrar eventos antes/depois, retornos e limitações em .harness/evidence/webfit-4/verification.md; SC-002/004.

## Phase 5: US3 — Conta do usuário (P1)

**Independent test**: nome abre Acesso/Perfil; seleção salva rascunho antes de navegar; Escape fecha e mantém foco visível.

- [x] T011 [US3] Implementar disclosure de conta com botões normais, aria-expanded/controls, Escape e foco em src/App.tsx; toggles não navegam; fechar na seleção/recolhimento; preservar busy/must_change/logout e falha de rascunho; FR-005/006/008.
- [x] T012 [US3] Ajustar nome longo, alinhamento com engrenagem e opções da conta em src/style.css, incluindo zoom/rolagem; FR-005/008.
- [x] T013 [US3] Atualizar alvos/textos de Acesso/logout em src/onboarding.ts; em src/App.tsx omitir GuidedTour somente no índice settings e manter IDs/tours das ferramentas; FR-007.
- [x] T014 [US3] Atualizar regressões reais de onboarding em tests/unit/onboarding.test.ts e executar TA-UX-NAV-005/006/007/008 via specs/002-webfit-4-navegacao-consultorio/quickstart.md, registrando resultado em .harness/evidence/webfit-4/verification.md; FR-005/006/007/008 e SC-002/003/004.

## Phase 6: Cross-Cutting Quality

- [x] T015 Atualizar navegação/tour e evidência de implementação em docs/ux/flows.md, DESIGN.md e docs/requirements/traceability.md, mantendo o espaço Saúde e sem promover escopo futuro.
- [x] T016 Executar checks de formatação/lint/TypeScript/frontend/build e Rust/SQLite/Tauri aplicáveis à entrega conforme specs/002-webfit-4-navegacao-consultorio/quickstart.md; registrar resultados/limitações/versionamento em .harness/evidence/webfit-4/verification.md; não instalar dependências ou publicar.
- [x] T017 Executar Converge, Verification, Review independente e UI/UX gate; documentar findings/limitações em .harness/evidence/webfit-4/review.md e .harness/evidence/webfit-4/evidence.md; atualizar docs/project/status.md e parar no aceite final sem Git mutável.

## Dependencies and Execution Order

T001 → T002 → T003 → US1 (T004..007) → US2 (T008..010) → US3 (T011..014) → T015..017. US2/US3 dependem do estado/navigate e lateral da fundação; testes de cada jornada são independentes após sua implementação. Converge antecede verificação/review final. Não marcar tarefa completa só porque seu arquivo foi planejado.

## Parallel Opportunities

Sem marcadores [P]: tarefas de implementação compartilham src/App.tsx, src/style.css e onboarding; execução sequencial evita colisões. Após código estável, ensaios TA das três jornadas podem ser divididos por responsabilidade se houver delegação autorizada, usando a mesma evidência, sem instalar ferramentas.

## Implementation Strategy

Primeiro incremento técnico US1; entrega solicitada exige as três jornadas, não encerrar após hambúrguer. Implementar/validar cada slice e consolidar documentação/erros/revisão. Não alterar código de backend, SQLCipher, migrações ou updater para simplificar ensaio. Qualquer mudança sensível retorna à autoridade aplicável.

## Execution notes

- [x] T018 RF-UX-003/TA-NAV-009: hambúrguer no menu aberto, abertura/fechamento graduais, foco/interação ocultos, feedback de ações e reduced-motion. Pedido de Maycon, 2026-10-09; checks/review e limites em plan.md.

T007/T010/T014 executados em frontend compilado com IPC ficticio: 17 assertions PASS; limites e ensaio Windows/teclado nativo pendentes em verification.md. T016 checks PASS (8 Node, 18 Rust/SQLite, build Tauri sem bundle). T017 Converge e review de codigo executados; UI/UX gate integrado PARTIAL, aceite humano pendente. Checks marcados indicam execucao e registro, nao aprovacao humana nem certificacao integral de SC-003/004. Nenhum instalador ou Git mutavel.


## Complemento — conta e fechamento, 2026-10-09

- [x] T019 RF-UX-003/TA-UX-NAV-010: compactar painel e substituir botão textual por ícone acessível Sair da conta, preservando handler/rascunho/busy e alvos do tutorial.
- [x] T020 RF-UX-006/TA-UX-WINDOW-003: guarda de fechamento nativo, diálogo/checkbox visual persistido, confirmação/cancelamento, falha/repetição/operação pendente; testes automatizados e documentação. Ensaio real Windows e revisão independente pendentes, não incluídos como PASS.
