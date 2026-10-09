# Governança do harness

## Fontes e autoridade

| Informação | Fonte canônica |
|---|---|
| Produto, requisitos, regras e aceite | docs/product/, docs/requirements/ e docs/ux/ aprovados |
| Arquitetura | ADR ACCEPTED em docs/architecture/adr/ |
| Princípios | .specify/memory/constitution.md |
| Demanda nova persistente | specs/WEBFIT-XX/task.md, proporcional, referenciando requisitos aprovados |
| Features existentes | Artefatos válidos em specs/, sem duplicação/conversão obrigatória |
| Processo/contexto | AGENTS.md, harness e webfit-task |
| Decisões | docs/project/decision-log.md; ledger em knowledge/DECISIONS-REGISTER.md |
| Gestão operacional | Plane: ID, backlog, prioridade, módulo, responsável e estado |
| Conhecimento | Obsidian sobre os mesmos arquivos |
| Checks, review e evidência | Registro da demanda; evidence/ e reviews/ existentes quando necessários |
| Checkpoint | docs/project/status.md |

Precedência: decisão humana ACCEPTED → ADR ACCEPTED → documentação/requisito aprovado → Constitution → artefatos da demanda → código → evidência. Hipótese/legado não é requisito aceito. Divergência Plane/canônico: PLANE / SOURCE-OF-TRUTH MISMATCH. [DEC-057](../docs/project/decision-log.md#dec-057--harness-com-quatro-fases) substitui obrigação de cadeia Spec Kit e gate intermediário genérico, preservando ferramentas oficiais/histórico.

## Quatro fases

Discovery → Plan → Execução → Code Review → READY TO SHIP. Demanda/Plane são entrada; Git/publicação são ações humanas posteriores. Pesquisa, ADR, checklist, tasks, análise, convergência, Verification, Security/UI e Evidence são responsabilidades internas.

- **Discovery:** objetivo, atual/esperado, fontes, aceite, risco e ambiguidades; Plane/contexto local. Pergunte só lacuna material não resolvida por investigação.
- **Plan:** abordagem, arquivos, testes, riscos, tarefas proporcionais e consistência; ADR/threat model conforme impacto. Scope Check antecede execução.
- **Execução:** implementar Plan autorizado, testar, corrigir e confirmar escopo completo. Até três ciclos sem convergência por problema; depois apresentar causa/tentativas e decisão necessária. Sem scheduler/loop persistente.
- **Code Review:** checks e review independente inicialmente read-only; segurança/UI condicionais. Findings seguros no Plan retornam à Execução e revisão afetada sem aprovação redundante. Evidence resume entrega, sem documento separado obrigatório.

## Profundidade

| Nível | Critério | Aplicação nas mesmas quatro fases |
|---|---|---|
| LIGHT | Texto/documentação/cosmética localizada sem mudança material ou risco | Discovery curta, Plan inline, checks/review proporcionais; sem Plane/task.md obrigatório |
| STANDARD | Feature, bug ou fluxo comum sem condição STRICT | ID Plane, contexto e Plan suficientes, execução contínua e review proporcional completo |
| STRICT | Saúde/dados sensíveis, autenticação/autorização, financeiro, banco/schema/migration, arquivos/backup, arquitetura, dependência, infraestrutura ou integração de risco | ID Plane, impacto/autorização específica e checks reforçados |

Bug de persistência SQLite sem schema ainda é STRICT neste projeto. Isso aprofunda controles, sem fase ou gate genérico extra. Correção literal de botão sem alterar significado pode ser LIGHT; reclassifique se surgir risco material.

## Autorização e Plan Scope Check

Invocação explícita de $webfit-task autoriza as quatro fases no escopo suficientemente definido, sujeito à autoridade de quem pediu. Pedido local explícito equivalente pode autorizar seu escopo, sem repetir comando. Desenvolvimento não equivale a aceite final, aprovação clínica ou autorização sensível.

Scope Check: aderência ao pedido, aceite compatível/compreensível, proporcionalidade, ID/status aprovado dos requisitos, autorizações suficientes e nenhuma mudança extraordinária não coberta.

- PLAN APPROVED BY SCOPE é resultado técnico, não aprovação humana criada pelo agente; prossiga imediatamente.
- PLAN REQUIRES HUMAN DECISION exige explicar fonte, impacto, opções/recomendação e pedir só autoridade/decisão faltante. Continue independente permitido.

Antes de agir, exigir autorização específica comprovada para: ampliação material, regra indefinida, migration/schema não autorizado, dependência/integração nova, autenticação/autorização sensível, arquitetura material não coberta, produção/banco real, destruição, perda/exposição de dados, acesso a secrets e sobrescrita. Não reabrir aprovação anterior suficiente. Nunca solicitar secrets em texto claro ou registrar dados clínicos.

Decisões não sensíveis reversíveis podem avançar AGENT-PROVISIONAL segundo [autonomia](AUTONOMY-POLICY.md), com validação em lote no aceite final se não bloquearem o próximo passo. ASK-FIRST/NEEDS-HUMAN-DECISION material param só dependente. Sem gate de implementação genérico entre Plan e Execução.

Amanda mantém domínio/aceite funcional; Maycon PO/responsabilidade técnica/Git. Mudança relevante de produto/escopo mantém aprovação conjunta quando aplicável; pedido de Maycon não aprova decisão clínica de Amanda por inferência. G5/G6/G7 são gates do produto, distintos das fases da demanda.

## Code Review e prontidão

Verificar critérios, regressões, contratos, integridade, erros e Plan. Registrar comando/ambiente/versão, PASS/FAIL/NOT RUN/N/A. Manter checks obrigatórios da DoD; documentação pura usa consistência/links/skills/diff. Reutilizar resultados válidos finais e repetir checks afetados por correção.

Passagem independente da implementação, com outro revisor humano/agente disponível e autorizado. Autorrevisão não substitui independência; ausência é pendência explícita e impede REVIEW PASSED/READY TO SHIP. Findings reais, deduplicados, com evidência/severidade/impacto, funcionais ou visuais. Fora do Plan: decisão/backlog sem escrita Plane extra automática.

Segurança conforme [política](security/POLICY.md); indisponibilidade de Mantis não elimina review disponível nem permite afirmar reprodução. UI usa Impeccable disponível, primeira leitura read-only, padrões existentes e limites visuais explícitos.

Regra persistente de UI: distinguir foco de interação de foco de leitura/contexto. Títulos focados programaticamente preservam o foco sem contorno de controle (`focus-anchor`/`tabIndex={-1}`); controles mantêm foco visível. Implementação e review seguem [foco de contexto](prompts/ui-review.md#foco-de-interação-e-de-contexto--maycon-2026-10-09), aprovado por Maycon em 2026-10-09.

Resultados: REVIEW PASSED, REVIEW PASSED WITH WARNINGS ou CHANGES REQUIRED. READY TO SHIP exige critérios técnicos satisfeitos, checks aplicáveis, review independente e nenhum finding impeditivo. Warnings/aceite final pendente explícitos; não concede aceite clínico, G5/G6/G7, Done ou publicação.

## Condução proporcional e retomada

Primeira atividade pendente, checkpoint/Git/fontes e artefatos/autorização válidos. Reabrir só por mudança material, conflito, evidência inválida ou decisão faltante. Não repetir leitura/check pelo nome da fase ou novo turno. Gatilho de AGENTS.md mantém leitura integral do checkpoint.

Preferir [task.md](templates/task.md) único em specs/WEBFIT-XX quando persistência ajudar; LIGHT inline. Não mover históricos nem criar specs concorrentes no harness. Artefatos oficiais detalhados são opcionais pelo [contrato Spec Kit](integrations/spec-kit.md). Verification, Review e Evidence têm responsabilidades/resultados distinguíveis no mesmo registro.

## Phase Summary e transparência

O chat é a interface principal de acompanhamento. O [contrato de interação](HUMAN-INTERACTION-CONTRACT.md#phase-summary--resumo-executivo-por-fase) exige resumo verificável de cada fase STANDARD/STRICT imediatamente ao concluir e antes de avançar; LIGHT breve pode agrupar alteração/revisão. Bloqueio exige resumo parcial, sem conclusão fictícia.

Mostrar status/ID Plane, conteúdo da fase, riscos/limites, checks reais e documentação criada/modificada com caminho/uma frase. Distinguir PASS, FAIL, WARNING, NOT RUN e NOT APPLICABLE. Documentação completa permanece nas fontes existentes; resumo não cria arquivo, fase, aprovação ou escrita Plane adicional. Continuar automaticamente no escopo autorizado.

## Git e preservação

DEC-054: branch atual, sem exigir nome/base/develop/árvore limpa. Inspeção somente leitura antes/depois. Sem criar/trocar branch/worktree, fetch/pull, stash/reset/clean, commit/push/merge, PR, tag, release/deploy por iniciativa própria. Autorização posterior delimita operação; aceite final não autoriza Git automaticamente. Conflito concreto bloqueia só edição dependente, sem apagar/esconder trabalho.

## Plane e evidência

[Plane](integrations/plane.md) mantém gestão ativa/escrita controlada no item atual. STANDARD/STRICT exigem ID antes dos artefatos formais e busca de duplicatas. Sem ID: PLANE ID REQUIRED; com ID conhecido e falha: PLANE SYNC DEGRADED, continue seguro e registre sync pendente. LIGHT documental não exige contato.

READY TO SHIP mantém Review até aprovação final; Done só com aceite humano. Sem alterações automáticas de configuração/estados/membros/ciclos ou itens alheios.

Evidence no Code Review: arquivos, comportamento, requisito/aceite, branch/HEAD/status, checks, review/findings, riscos, limites, sync e Agent Decisions. Referenciar logs/documentos sem duplicar. Sem secrets/dados reais; aceite final permanece separado da prontidão técnica.
