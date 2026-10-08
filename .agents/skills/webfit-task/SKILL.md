---
name: webfit-task
description: Conduzir demandas do WebFit em Discovery, Plan, Execução e Code Review, com avanço contínuo no escopo, Plane e controles proporcionais. Use para nova demanda ou retomada de engenharia; não para simples consulta de status.
---

# WebFit Task — quatro fases

Considere $ARGUMENTS e recupere o objetivo. Este é o entrypoint WebFit; sav-task pertence a outro projeto. Leia AGENTS.md, docs/project/status.md, [governança](../../../.harness/GOVERNANCE.md), [autonomia](../../../.harness/AUTONOMY-POLICY.md) e [interação humana](../../../.harness/HUMAN-INTERACTION-CONTRACT.md) na entrada. Reutilize contexto atual no mesmo chat; antes de planejar/alterar produto, cumpra as leituras de AGENTS.md.

A invocação explícita autoriza as quatro fases no escopo informado. Continue no mesmo chat até concluir ou encontrar impedimento concreto. Não peça invocação de outra skill nem aprovação genérica entre fases. Autorizações anteriores suficientes mantêm seu escopo; ações sensíveis exigem autorização específica comprovada ou decisão prévia. G5/G6/G7, aceite de domínio e dados reais mantêm sua autoridade.

## 1. DISCOVERY

Entenda problema, resultado, atual/esperado, partes afetadas, restrições, aceite, risco e ambiguidades. Investigue fontes/arquivos antes de perguntar; separe fato, inferência e decisão provisória. Classifique LIGHT/STANDARD/STRICT como profundidade conforme governança; texto literal de botão sem mudança de significado pode ser LIGHT, banco/saúde seguem STRICT mesmo sem migration.

Para ID existente, leia metadata necessária do Plane e recupere artefatos/histórico/autorizações. Para nova STANDARD/STRICT, busque item correspondente antes de criar exatamente um Work Item WebFit nos limites do [contrato Plane](../../../.harness/integrations/plane.md); obtenha ID antes de artefatos formais. Descrição explícita iniciando demanda basta, sem prefixo obrigatório “Nova demanda”. LIGHT dispensa Plane.

Sem Plane com ID conhecido: PLANE SYNC DEGRADED, prossiga localmente quando seguro. Sem ID obrigatório: PLANE ID REQUIRED, pare antes dos artefatos formais. Não duplicar demandas nem escrever em itens alheios.

Confira Git somente leitura (branch, HEAD, status); preserve trabalho preexistente. DEC-054 mantém branch atual, sem bloqueio por nome/base/árvore suja. Retome primeira atividade pendente, sem refazer Discovery/Plan válidos nem selecionar outra demanda pela branch.

Resultado: DISCOVERY COMPLETE. Lacuna material de comportamento: BLOCKED — CLARIFICATION REQUIRED. Ferramenta/autoridade indisponível: BLOCKED com motivo próprio. Pergunte somente o que não puder ser resolvido por investigação técnica; avance independente permitido.

## 2. PLAN

Defina abordagem, arquivos, mudanças, critérios, testes, riscos e impacto em banco/segurança/integrações. Tarefas quando úteis; arquitetura/ADR material, checklist e análise de consistência são responsabilidades internas.

LIGHT usa Plan inline. Para planejamento persistente novo, prefira specs/WEBFIT-XX/task.md com [template único](../../../.harness/templates/task.md). Reutilize Specification/Plan/Tasks históricos válidos sem converter, apagar ou duplicar. Skills oficiais Spec Kit são ferramentas opcionais dentro das fases: consulte [contrato](../../../.harness/integrations/spec-kit.md) quando úteis ou explicitamente solicitadas. Não modificar, simular execução nem invocar workflow completo gerenciado por rotina.

Faça Plan Scope Check: escopo original, aceite compreensível/compatível, proporcionalidade, autorizações existentes, riscos inesperados e ausência de suposições silenciosas. Pedido explícito aprova somente comportamento suficientemente definido pela autoridade competente; registre ID/status/origem, sem inventar requisito aceito.

- PLAN APPROVED BY SCOPE: requisitos aplicáveis aprovados, escopo aderente e nenhuma operação sensível não autorizada/decisão bloqueante. Resultado técnico, não nova aprovação humana; execute imediatamente.
- PLAN REQUIRES HUMAN DECISION: explique fonte, opções, recomendação e operação dependente; peça somente a decisão faltante e avance independente permitido.

Pare para ampliação material, regra indefinida, migration/schema não autorizado, nova dependência/integração, autenticação/autorização sensível, perda/exposição de dados, produção/banco real, acesso a segredos, sobrescrita ou arquitetura material não coberta. Não repetir autorização específica já suficiente; STRICT aprofunda controles sem gate genérico.

## 3. EXECUÇÃO

Implemente integralmente o Plan autorizado, com incrementos verticais quando houver produto. Preserve alterações, padrões e documentação; não refatore fora do escopo, instale dependência não autorizada, altere banco real, destrua ou publique automaticamente.

Implementar → testar → investigar/corrigir falhas no Plan → repetir checks afetados → confirmar todas as mudanças necessárias autorizadas. Converge é essa checagem interna, sem fase extra. Registre critérios/tarefas cobertos e evidência real. Build não substitui teste de comportamento. Execute comandos existentes de formatação, lint, TypeScript, frontend, Rust/SQLite e build Tauri aplicáveis; puro documento usa checks documentais.

No máximo três ciclos sem convergência por problema, depois registre causa/tentativas e decisão necessária. Não enfraqueça testes nem ative scheduler/loop persistente. Risco extraordinário descoberto retorna ao Scope Check, bloqueando somente dependente.

Resultado: EXECUTION COMPLETE ou BLOCKED com motivo e próxima ação.

## 4. CODE REVIEW

Passagem separada da implementação, inicialmente read-only, com revisão independente por outro revisor humano/agente quando disponível e autorizado. Autorrevisão não equivale a review independente; se indisponível, registre pendência sem declarar REVIEW PASSED/READY TO SHIP.

Avalie critérios, bugs, regressões, contratos, integridade, erros e Plan. Execute/reutilize checks correspondentes ao estado final; marque PASS/FAIL/NOT RUN/N/A com comando/ambiente/limite. Use [verification](../../../.harness/prompts/verification.md) e [review](../../../.harness/prompts/review.md) internamente.

- Segurança obrigatória conforme risco: [security-review](../../../.harness/prompts/security-review.md). Mantis condicional/futuro, sem instalação obrigatória; sem integração, execute checks disponíveis e declare limitações. Reprodução somente isolada e especificamente autorizada, nunca host/produção/dados reais.
- Frontend/experiência visual: Impeccable disponível conforme [ui-review](../../../.harness/prompts/ui-review.md), primeira leitura read-only, padrões/design system existentes, acessibilidade/teclado/foco, responsividade, estados e overflow. Diferencie inspeção estática de ensaio visual.
- Deduplicar findings com evidência, severidade, arquivo/trecho e impacto, separando bugs funcionais/visuais. Corrija automaticamente findings seguros no Plan, repita checks/review afetados. Fora do escopo: decisão/backlog sem outro item Plane automático.
- Evidence é resumo final do registro: arquivos, comportamento, checks aprovados/falhos/não executados, findings, riscos, git status, limites, decisões provisórias e resultado. Use [evidence](../../../.harness/prompts/evidence.md); relatório separado só quando necessário, sem duplicar logs.

Resultados: REVIEW PASSED, REVIEW PASSED WITH WARNINGS ou CHANGES REQUIRED. Critérios técnicos satisfeitos, checks aplicáveis, review independente e nenhum bloqueador: READY TO SHIP, com warnings e aceite final pendente explícitos. Não aprova uso clínico, G6/G7, Plane Done ou publicação.

## Continuidade e saída

### Phase Summary — Resumo Executivo por Fase

O chat é a interface principal de acompanhamento; arquivos mantêm a documentação completa aplicável. Ao concluir cada fase STANDARD/STRICT, publique seu resumo imediatamente no chat antes de continuar à próxima; não acumule os quatro para o final. São saídas informativas das quatro fases, sem nova fase, Approval Gate ou pedido para continuar.

Use português brasileiro, Markdown simples, título com ID Plane quando houver (ex.: WEBFIT-12 — PLAN COMPLETE) e bullets curtos, em geral 5–10 linhas. STRICT explicita riscos/controles/decisões sensíveis sem expor secrets, dados pessoais ou de saúde. LIGHT pode reunir fases numa mensagem curta de alteração/revisão quando a ação for breve; duração relevante ou bloqueio exige atualização imediata. Não refazer fases válidas para gerar resumos.

- Discovery Summary: status, problema, atual/esperado, escopo/componentes, risco, dúvidas/limites e documento criado/atualizado ou ausência de novo registro.
- Plan Summary: status, abordagem, arquivos/componentes, mudanças funcionais, impacto em banco/segurança/integrações, testes planejados, riscos/decisões, Plan Scope Check e documento. Scope Check aprovado permite execução automática, sem aprovação redundante.
- Execution Summary: status, implementação efetiva, arquivos criados/modificados, comportamento, testes executados/resultados, pendências do Plan e desvios/limites. Agrupar muitos arquivos por Frontend, Backend, Banco, Testes e Harness/documentação, conforme aplicável.
- Code Review Summary: status geral, Correctness, testes/build/typecheck/lint relevantes, Security/UI aplicáveis, findings identificados/corrigidos/abertos, riscos/limites e resultado final READY TO SHIP, REVIEW PASSED WITH WARNINGS ou CHANGES REQUIRED conforme evidência/governança. Distinguir PASS, FAIL, WARNING, NOT RUN e NOT APPLICABLE com motivo; não inferir aprovação de teste, segurança ou UI não verificados.

Quando a fase gravar documentação, incluir Documentação atualizada: nome/caminho clicável, criado/modificado e uma frase do conteúdo efetivamente gravado. Mostrar principais e agrupar demais, apontando inventário completo existente; não copiar documentos nem criar arquivos apenas para resumos. Planejado não é gravado; consulta/reuso sem edição não é atualização.

Bloqueio recebe resumo parcial com status, fatos confirmados, pendência/decisão e próxima ação antes de pausar dependente, sem declarar conclusão; continue independente autorizado. Fases demoradas recebem progresso útil, sem narração de comandos. ID Plane identifica a demanda nos resumos; nenhuma escrita remota só para registrar mensagem, mantendo sincronização existente.

Detalhes: [Phase Summary no contrato de interação](../../../.harness/HUMAN-INTERACTION-CONTRACT.md#phase-summary--resumo-executivo-por-fase). Conclua entrega com resultado real, evidência, limites, pendências e próxima ação. Atualize checkpoint ao encerrar trabalho material preservando demais trilhas. webfit-checkpoint e webfit-verificar são auxiliares internos, sem fases/gates extras.

Sincronize só o item Plane atual nos estados existentes; Done apenas após aceite final humano. Git/PR/release/produção mantêm autorização humana específica; nenhuma fase executa commit/push/merge/deploy por iniciativa própria.
