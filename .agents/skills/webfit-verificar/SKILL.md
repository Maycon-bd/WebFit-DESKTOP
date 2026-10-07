---
name: webfit-verificar
description: Verificar alterações ou uma entrega do WebFit Desktop com checks proporcionais, rastreabilidade e evidência breve. Use para validar documentação, executar verificações ou preparar Verification; não substitui Analyze do Spec Kit, review independente, aceite humano ou publicação.
---

# WebFit Verificar

Leia AGENTS.md e aplique o [contrato de Verification](../../../.harness/prompts/verification.md), a [governança](../../../.harness/GOVERNANCE.md) e o [contrato de evidência](../../../.harness/prompts/evidence.md). Reutilize os que já estiverem atuais no chat.

## Definir o que será verificado

Recupere o objetivo, arquivos alterados, requisito/TA quando aplicável, critérios de aceite, versão e evidências anteriores. Inspecione `git status --short --branch`, `git rev-parse HEAD` e o diff pertinente. Inclua arquivos novos relevantes; `git diff` sozinho não os cobre. Não atribua alterações preexistentes a esta entrega.

Se a entrada for uma entrega específica, confira somente seus owners e dependentes. Se o pedido for validar tudo, identifique o escopo real e os comandos disponíveis antes de executá-los. Inspecione diferenças finais: evidência do mesmo HEAD com worktree diferente pode estar desatualizada.

## Selecionar checks pelas mudanças

| Mudança | Verificação aplicável |
|---|---|
| Documentação/instruções | fonte/status coerentes, links locais, ausência de placeholders, consistência de nomes e `git diff --check` com paths afetados; valide skills alteradas com validador disponível |
| Specification/Plan/Tasks | siga [speckit-analyze](../speckit-analyze/SKILL.md) para consistência entre esses artefatos; não duplique seu procedimento |
| Código de produto/spike | comandos existentes de formatação, lint, TypeScript, testes frontend, Rust, integração SQLite e build Tauri aplicáveis à mudança e à DoD |
| Banco/backup | migração em banco vazio e versão anterior, integridade, snapshot/restauração e cenários de falha aprovados, somente em ambiente fictício adequado |
| Workflow/release preparado | coerência estática de gatilho, origem, checks, assinatura e pós-publicação com o contrato aprovado; execução externa exige autorização específica |

Descubra os comandos no README, manifests, scripts e plano do owner. O spike descartável tem rotas documentadas em `spikes/g4-tauri-foundation/README.md`; elas não são comandos de uma aplicação de produto. Não invente scripts nem instale dependências para preencher ausência. Registre checks inexistentes/não aplicáveis conforme o handoff exigido por AGENTS.md.

## Executar e interpretar

Execute os checks relevantes após a última alteração de suas entradas. Guarde comando, cwd, ambiente/fixture, revisão, escopo do diff e resultado. Paralelize apenas checks independentes que não disputem estado, arquivos ou banco. Testes de dados usam fixtures fictícias e ambiente apropriado; nenhum acesso a produção ou diagnóstico com informação clínica.

Um build não substitui um teste de comportamento; `git diff --check` não comprova implementação. Resultado anterior pode ser referenciado quando cobre exatamente as entradas finais e satisfaz a DoD. Entrada alterada, falha pendente ou equivalência incerta exige nova verificação. Não repita uma suíte que já passou sem mudança ou preocupação nova.

Ao falhar, localize causa e impacto. Reparar somente se a solicitação autorizar a correção e ela estiver dentro dos gates e escopo vigentes; caso contrário, entregue o finding e continue checks independentes. Após correção, reexecute o check original ou equivalente justificado. Não contorne autorização, remova teste nem ignore falha para declarar sucesso.

## Entregar evidência breve

Registre critérios cobertos, comandos/resultados, falhas, não executados e limites na evidência/handoff da demanda. Reutilize o registro existente quando suficiente; nova evidência só quando necessária. Mantenha decisões provisórias identificadas e resultados de Verification distinguíveis do Review.

Use os estados do contrato de evidência: `READY`, `READY WITH WARNINGS`, `READY FOR HUMAN DECISION REVIEW` ou `NOT READY`, com razão concreta e próxima ação. Não crie gates adicionais nem declare aceite humano, publicação, Repair Progress ou prontidão clínica com base em checks locais. Review independente e aprovações permanecem responsabilidades separadas. Confira Git ao concluir.
