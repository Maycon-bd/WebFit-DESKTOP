# V05 — Avaliar saída neutra do modal de recuperação

**Status: IMPLEMENTADO / WEBFIT-13 — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: refinamento de UX aprovado por Maycon.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V05; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/DraftRecoveryDialog.tsx:38; capturas 03-patient-new e 04-draft-escape. Modal exige Restaurar/Descartar e impede Escape. Restaurar e depois voltar é saída segura já disponível.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Sair sem decidir entre restaurar e descartar exige restaurar e retornar. O comportamento observado atende ao fluxo binário aprovado; não é violação automática de requisito.

Avaliar uma ação explícita Voltar à lista que preserve integralmente o rascunho e o registro persistido. A alternativa é manter o fluxo aprovado.

## Escopo e restrições

Proposta para recuperação contextual em src/DraftRecoveryDialog.tsx e roteamento em src/App.tsx; especificar destino adequado por contexto antes de implementar.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite propostos na abertura (histórico)

- **V05-AC01 — pendente:** Se a saída neutra for aprovada, ao acioná-la o rascunho não é excluído nem aplicado ao registro persistido; a reentrada oferece a recuperação novamente.
- **V05-AC02 — pendente:** Após a saída, o foco vai a um destino significativo na tela aprovada; Restaurar e Descartar mantêm seus comportamentos e isolamento por contexto.
- **V05-AC03 — pendente:** Escape e clique externo nunca causam descarte silencioso. Seu eventual vínculo com saída neutra depende de decisão explícita.
- **V05-AC04 — pendente:** Se o fluxo binário for mantido, registrar a decisão e encerrar esta proposta sem marcar a ausência da terceira ação como bug corrigido.

## Dependências e decisões na abertura (histórico)

[WEBFIT-7](../../007-recuperar-rascunho-contextual/spec.md), RF-DRF-002, TA-DRF-010. Aprovar e atualizar critérios afetados antes da mudança de comportamento. Relacionado a V06, com objetivos separados.

NEEDS-HUMAN-DECISION: manter decisão binária ou permitir saída neutra? Se aprovada, definir destinos de paciente/perfil/prescrição e tratamento de Escape. Registro solicitado por Maycon não responde essa decisão.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Após decisão: testar sair/reentrar/reiniciar, escopo por usuário/contexto, erro de carregamento e navegação por teclado; conferir persistência sem perda com dados fictícios.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Retomada inicial — 2026-10-08 (histórico)

Discovery parcial STRICT / WEBFIT-13. Fluxo binário RF-DRF-002 aprovado permanece; terceira ação não foi definida pelo pedido geral. Nenhuma implementação. NEEDS-HUMAN-DECISION: manter fluxo atual ou permitir saída neutra sem aplicar/excluir rascunho? Recomendação: ação explícita Voltar, paciente para lista, perfil para lista de pacientes e prescrição para cadastro do paciente; Escape equivalente a Voltar, clique externo permanece inerte. Alternativa: manter Restaurar/Descartar e encerrar proposta. A recomendação não é aprovação; revisar TA-DRF-010 antes de executar. Pendência apresentada ao final como solicitado, demais itens avançam.

## Verificação da retomada inicial (histórico)

Nenhuma execução: BLOCKED. Escolha e atualização de TA-DRF-010 necessárias antes de implementar; critérios continuam propostos.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.

## Aprovação e execução posterior — 2026-10-08

Maycon respondeu “Faça isso” à recomendação de saída/destinos/Escape. D-DRF-EXIT-001 ACCEPTED / Validated by: Human; bloqueio resolvido. Discovery concluída; PLAN APPROVED BY SCOPE.

Critérios vigentes: V05-AC01 aprovado (sair sem excluir/aplicar/regravar, oferecer novamente na reentrada); AC02 aprovado (foco no título de destino e restauração/descarte preservados); AC03 aprovado (Escape = Voltar, clique externo inerte); AC04 SUPERSEDED pela escolha humana de saída neutra, não é trabalho pendente.

Plan/execução: botão contextual e Escape em DraftRecoveryDialog; handler leaveDraft em App encerra apenas estado transitório, limpa referência dirty e muda tela sem chamada API nem resolver/remover rascunho. Consulta existente na reentrada preservada. Ao fechar, saída neutra foca h1 do destino, outras ações mantêm foco no formulário. Nenhuma mudança Rust/banco/dependência.

Teste persistente tests/unit/draft-recovery.test.ts: callbacks Escape/Voltar com busy, destino de foco com document fake e handler real de App nos três contextos sem mutação do rascunho/registro. Lifecycle/DOM simulados apenas nas fronteiras; não comprova showModal/foco real/reentrada ou reinício WebView.

## Evidência da implementação vigente

PASS npm run check: lint, TypeScript, 24 testes Node (3 novos V05), build Vite. PASS npm run format:check, detector Impeccable [] e git diff --check; 111 links relativos dos documentos afetados resolvidos. Nova compilação Tauri após ajuste de foco: PASS (release sem bundle, 1m41s). Rust/SQLite 28/28, fmt/clippy da etapa imediatamente anterior reutilizados: nenhuma entrada backend foi alterada. Aviso JS final 545,39 kB; warnings cache/PDB no build.

V05-AC01: PASS handler real em fixtures sem gravação/exclusão/aplicação; reentrada/reinício em Windows NOT RUN. V05-AC02: PASS callbacks para foco em heading versus formulário e rotas nos três contextos; espera de carga inspecionada; foco real/showModal/tecnologia assistiva NOT RUN. V05-AC03: PASS Escape/Voltar/busy e ausência de handler de clique externo em fixture; comportamento de backdrop WebView NOT RUN. AC04 substituído pela decisão aprovada.

Autorrevisão separada: estado/data flow/erros/escopo conferidos; sem mudanças em autoria, autenticação, persistência ou retenção; restauração/descarte preservados. Revisão independente indisponível nesta passagem e pendente, CODE REVIEW INCOMPLETE, sem REVIEW PASSED/READY TO SHIP. Próxima ação: review independente e ensaio fictício sair/reentrar/reiniciar nos quatro contextos (cadastro/edição/perfil/prescrição), teclado/NVDA/200%, depois aceite humano. Sem Git mutável ou publicação.
