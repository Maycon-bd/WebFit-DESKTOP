# Refatoração do harness — quatro fases

Data: 2026-10-08. Escopo documental/operacional expressamente autorizado por Maycon; sem produto, banco, dependências, Git mutável ou publicação. Fonte: texto anexado “Refatoração do Harness WebFit — Workflow de 4 Fases”; decisão canônica [DEC-057](../../docs/project/decision-log.md#dec-057--harness-com-quatro-fases). Manutenção documental sem demanda funcional nova: sem Work Item Plane criado. A política de ID STANDARD/STRICT permanece no entrypoint.

Branch/HEAD: main, e07cdc8300de0421dbdc7fd64aafe7d30a191e80. Upstream local origin/main 0/0, sem fetch/pull/consulta remota. A árvore já continha alterações WEBFIT-6/8/9 e outras; esta entrega não as atribui a si. Na conferência final surgiram também .harness/evidence/webfit-7/ e src/DraftRecoveryDialog.tsx, de trabalho paralelo; preservados sem edição nem atribuição a esta refatoração. Conferir [checkpoint](../../docs/project/status.md).

## Discovery e Plan desta manutenção

Mapeados README, Governance, skill/auxiliares, Constitution, autonomia/interação, contratos Plane/Spec Kit/Codex/Git/segurança/UI e prompts/templates. O workflow oficial gerenciado .specify/workflows/speckit/workflow.yml permanece intacto como opção explícita, sem ser acionado pelo entrypoint. Não foi necessário instalar ferramentas ou executar produto.

Scope Check: refatoração operacional explicitamente definida/autorizada; sem nova aprovação intermediária. A troca incompatível de governança foi registrada em DEC-057 e Constitution 2.0.0. Não gera ADR técnico de produto. task.md fica em specs/WEBFIT-XX quando necessário, evitando árvore concorrente .harness/specs/.

## Execução e resumo dos diffs

| Antes | Depois |
|---|---|
| Cadeia de 21 etapas operacionais | Quatro fases principais contínuas |
| Specify/Clarify como passagens | Contexto/aceite/ambiguidades na Discovery |
| Architecture/ADR/Plan/Checklist/Tasks/Analyze | Responsabilidades internas proporcionais do Plan |
| Human Gate genérico antes de Implement | Scope Check, pedido autoriza escopo; específico só quando necessário |
| Implement e Converge separados | Execução com testes, correções e cobertura integral |
| Verification/Review/Security/UI/Evidence separados | Code Review com responsabilidades/resultados distinguíveis |
| Arquivos formais separados obrigatórios | Inline LIGHT; registro único persistente ou históricos reutilizados |
| Índice Plane/MCP desatualizado; Impeccable marcado indisponível | Estados documentais alinhados aos contratos/catalogo da sessão |

Segurança/Git/Plane/aceite final mantidos. READ ONLY primeiro no review independente; indisponibilidade do revisor impede prontidão. Até três ciclos sem convergência por problema, sem scheduler. READY TO SHIP não concede Done, G6/G7, dados reais ou Git/publicação.

## Arquivos desta entrega

- `.agents/skills/webfit-task/SKILL.md`
- `.harness/README.md`
- `.harness/GOVERNANCE.md`
- `.harness/integrations/spec-kit.md`
- `.harness/templates/task.md`
- `.harness/prompts/plan.md`
- `.harness/prompts/planning-review.md`
- `.harness/prompts/implementation.md`
- `.harness/prompts/review.md`
- `.harness/prompts/security-review.md`
- `.harness/prompts/ui-review.md`
- `.harness/prompts/evidence.md`
- `.harness/templates/evidence.md`
- `.harness/integrations/impeccable.md`
- `.harness/integrations/mantis.md`
- `.harness/integrations/README.md`
- `.harness/security/POLICY.md`
- `.harness/evidence/README.md`
- `AGENTS.md`
- `.harness/HUMAN-INTERACTION-CONTRACT.md`
- `.harness/AUTONOMY-POLICY.md`
- `.harness/integrations/plane.md`
- `.harness/integrations/codex-skill.md`
- `.harness/integrations/github.md`
- `.harness/loops/LOOP-POLICY.md`
- `.harness/PROJECT-STATE.md`
- `docs/project/decision-log.md`
- `.harness/knowledge/DECISIONS-REGISTER.md`
- `.specify/memory/constitution.md`
- `docs/project/development-lifecycle.md`
- `.agents/skills/webfit-verificar/SKILL.md`
- `.agents/skills/webfit-checkpoint/SKILL.md`
- `.harness/prompts/architecture-review.md`
- `docs/project/status.md`
- Este relatório de evidência.

Prompts de intake/investigation/research/verification e templates ADR/spike/threat-model continuam referências internas úteis, sem fases novas. Reviews/evidências/specs históricos, skills oficiais e scripts/templates/workflow gerenciados preservados. Obsidian permanece sobre mesmos arquivos; seu contrato não exigiu mudança. Mermaid é opcional na Discovery/Plan; Impeccable disponível condicional no Code Review; Mantis não instalado/executado, com reprodução somente isolada/autorizada; DefectDojo FUTURE sem infraestrutura/serviço ou substituição de Plane.

## Validação estática A–H

| Cenário | Decisão/conduta prevista | Resultado da análise |
|---|---|---|
| A — texto literal de botão | LIGHT, Discovery breve, Plan inline, execução e review proporcionais; sem Spec/ADR/Plane obrigatório | Coerente |
| B — persistência sem schema | Quatro fases e execução no escopo; neste WebFit SQLite é STRICT mesmo sem schema, pela regra de dados existente | Coerente com segurança; classificação do exemplo ajustada |
| C — acesso a saúde | STRICT, impacto/autorização específica, segurança backend e review reforçado | Coerente |
| D — tela | Impeccable disponível, primeira análise read-only, findings/limites visuais e correções dentro do Plan | Coerente |
| E — WEBFIT-12 com Plan concluído | Ler item/fontes/checkpoint, retomar primeira atividade pendente sem duplicar artefatos | Coerente |
| F — migration inesperada | PLAN REQUIRES HUMAN DECISION, parar operação dependente antes do schema | Coerente |
| G — bug introduzido no escopo | Corrigir/testar/revisar afetados automaticamente, limite de tentativas | Coerente |
| H — READY TO SHIP | Manter Review/aceite final pendente; sem Git/PR/release/deploy automático | Coerente |

É validação de instruções/referências, não execução de oito demandas reais, testes de produto ou integração remota. Sem produção ou dados reais.

## Code Review e checks

- Validador `python C:/Users/Maycon Garcia Silva/.codex/skills/.system/skill-creator/scripts/quick_validate.py <skill-dir>` com PYTHONUTF8=1: webfit-task, webfit-checkpoint e webfit-verificar PASS.
- Review independente read-only por agente distinto: owners/autorizações/cenários inspecionados; referência derivada à Constitution 1.0.0 apontada e corrigida para 2.0.0. Conferência final concluída pelo mesmo revisor independente após correção: nenhum finding novo.
- Links/âncoras: script Python read-only conferiu 35 arquivos, 124 links locais e 10 âncoras, zero erros; UTF-8 sem caracteres de substituição e fences balanceados. `git -c core.safecrlf=false diff --check -- <35 owners>` PASS. Primeira rodada detectou linhas extras no EOF, corrigidas antes do resultado final.
- Integridade: `git diff --name-only` nos dez owners speckit oficiais, .specify/scripts, .specify/templates, .specify/workflows e specs sem diferenças rastreadas. Git status inicial/final preserva branch/HEAD e alterações de produto preexistentes; edits desta entrega restritos aos owners listados. Arquivos novos task.md-template/evidence incluídos no check de links; históricos de specs/reviews/evidence não editados.
- TypeScript, lint/frontend, testes Rust/SQLite e build Tauri: NOT RUN / N/A nesta entrega documental; não são declarados aprovados.
- Plane remoto e descoberta das skills em outra máquina: NOT RUN. Contrato preservado/alinhado, sem sincronização externa desta manutenção.

## Agent Decisions e limites

Zero decisões técnicas provisórias novas; processo e localização proporcional seguem autorização explícita/estrutura existente. Nenhuma decisão pendente de outras demandas foi aceita. A–H comprovam coerência estática, não garantem comportamento futuro do agente. Aceite final/documentação e operações Git permanecem de Maycon. Ganho de velocidade não foi medido.

Resultado: REVIEW PASSED WITH WARNINGS — READY TO SHIP para esta infraestrutura documental, com checks e review independente concluídos. Warnings/limites: validação estática de instruções, sem execução real A–H, sync Plane ou descoberta em outra máquina; resumos antigos de produto no PROJECT-STATE permanecem dívida documental preexistente fora do escopo, subordinada ao checkpoint. Aceite humano final e integração Git por Maycon, sem operação automática.
