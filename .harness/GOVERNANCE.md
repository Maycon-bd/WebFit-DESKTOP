# Governança do harness

## Source-of-truth matrix

| Informação | Fonte canônica |
|---|---|
| Visão de produto | documentação aprovada em docs/product/ |
| Regra de negócio | requisito/regra aprovada em docs/requirements/ |
| Decisão arquitetural | ADR em docs/architecture/adr/ |
| Constitution | .specify/memory/constitution.md |
| Feature | Spec Kit Specification em specs/, após criação e aprovação |
| Plano técnico | Spec Kit Plan |
| Tasks | Spec Kit Tasks |
| Contexto para agente | AGENTS.md |
| Política de autonomia | .harness/AUTONOMY-POLICY.md |
| Interação humana | .harness/HUMAN-INTERACTION-CONTRACT.md |
| Registro navegável e ledger | .harness/knowledge/DECISIONS-REGISTER.md; decisão canônica permanece em docs/ ou ADR aplicável |
| Gestão de trabalho | Plane, quando conectado, exclusivamente para backlog, prioridade, módulo, responsável, estado e acompanhamento |
| Navegação de conhecimento | Obsidian sobre este workspace |
| Integrações | MCP e documentação em .harness/integrations/ |
| UI/UX | docs/ux/ + decisões de produto + Impeccable quando ativo |
| Segurança | threat model + revisão/Mantis quando aplicável |
| Verificação | prompts/verification.md + evidências |
| Review | prompts/review.md + registro independente |
| Evidência final | Evidence Report em .harness/evidence/ |
| Automação futura | .harness/loops/ |

Auxiliares nunca publicam requisitos ou decisões concorrentes. Plane é gestão operacional, não fonte canônica do produto ou da engenharia.

Em caso de conflito, prevalecem: decisão humana `ACCEPTED`; ADR `ACCEPTED`; requisito ou documentação canônica aprovada; Constitution; Specification/Plan/Tasks da feature; código; evidência. AGENTS.md e o harness governam a condução do trabalho, sem substituir conteúdo canônico. Conflitos devem ser expostos e resolvidos na fonte competente. Ver [integrations/spec-kit.md](integrations/spec-kit.md).

## Níveis de mudança

### LIGHT

Correção documental ou alteração trivial sem comportamento, arquitetura, dados ou integração externa. Exige fonte, revisão de links e registro breve de evidência.

### STANDARD

Feature, bug, fluxo de UI, endpoint ou regra comum sem condição STRICT. Exige requisito aprovado e uso proporcional de Specification, Plan, Tasks e Analyze antes do gate; após aprovação, implementação, testes, Converge, Verification, Review, documentação e Evidence Report.

### STRICT

Arquitetura, autenticação, autorização, dados sensíveis, financeiro, migração/schema, arquivos, backup, infraestrutura, dependência nova ou integração externa. Exige ADR/spike quando aplicável, aprovação humana prévia e gates especializados.

O nível STRICT não elimina análise autônoma: o agente pode comparar e recomendar alternativas, mas condições ASK-FIRST não podem ser executadas com base apenas em `AGENT-PROVISIONAL`.

## Condução proporcional e retomada

Use o fluxo a partir da primeira etapa pendente da demanda. Um novo turno, chat ou pedido de continuação não reinicia discovery, Specification, Plan ou Tasks que já estejam válidos. Confirme o checkpoint, o estado Git e as fontes afetadas; reabra uma etapa apenas diante de mudança de escopo, conflito, evidência inválida ou aprovação ainda necessária. O gatilho de retomada de AGENTS.md continua exigindo leitura integral do checkpoint.

- Leia AGENTS.md, checkpoint e políticas aplicáveis na entrada; reutilize o contexto já lido no mesmo chat enquanto arquivos, escopo, branch e aprovações continuarem válidos. Reconfira Git antes de editar e ao concluir. Consulte o ledger e os documentos de domínio por assunto; não carregue todos por rotina. As leituras obrigatórias antes de planejar ou alterar o produto permanecem vigentes.
- LIGHT documental segue fonte → alteração → revisão de consistência/links → evidência breve. Não exige Work Item, Specification, Plan, Tasks ou pedido genérico para continuar. Uma solicitação explícita de correção local autoriza essa correção no escopo descrito; ações externas e gates de produto mantêm suas regras.
- STANDARD/STRICT reutilizam artefatos aprovados da mesma demanda. Execute as skills necessárias à fase e atualize os artefatos afetados; não gere cópias nem simule que uma etapa obrigatória foi executada. Checklist, ADR, pesquisa e gates especializados só entram quando houver seu motivo concreto.
- Continue o trabalho autorizado entre etapas no mesmo chat. Ler e seguir uma skill oficial disponível é sua execução instrucional; a ausência de uma API de chamadas aninhadas não exige que o humano a invoque novamente. Handoff ocorre somente quando instruções, ferramentas, ambiente ou autoridade necessários estiverem de fato indisponíveis.
- Uma pergunta bloqueia somente o trabalho que depende da resposta. Reaproveite autorização suficiente e agrupe decisões relacionadas; não peça confirmação por arquivo, comando permitido ou transição de fase. Um lote pode cobrir gates relacionados quando explicitar separadamente escopo, responsáveis e condições de cada aprovação.
- Registre Verification, Review e Evidence com responsabilidades e resultados distinguíveis. Referencie os mesmos comandos e evidências em vez de duplicá-los em cada documento. Reexecute checks quando mudar seu código/configuração de entrada, quando o resultado não corresponder ao estado final ou houver falha pendente. Independência de review e checks exigidos pela DoD permanecem obrigatórios.

Essas orientações reduzem repetição operacional; não concedem G5, aprovação sensível, aprovação final, escrita externa ou ativação de loops. Ganho de tempo só poderá ser afirmado após observação de demandas comparáveis.

## Proteção de branches

**DEC-054 — ACCEPTED por Maycon em 2026-10-07:** Git é responsabilidade humana. Todas as demandas são conduzidas na branch atualmente ativa, independentemente do nome, associação ao ID, base ou presença de alterações de outras demandas. Esta decisão substitui as exigências anteriores de setup por demanda e a parte correspondente da DEC-010 para atuação do agente.

O agente não cria/troca branches ou worktrees e não executa fetch/pull, stash/reset/clean, commit/push/merge, PR, tag ou release por iniciativa própria. Inspeção somente leitura é permitida para contexto, rastreabilidade e preservação. Mudança explícita de autorização posterior deve delimitar a operação.

Worktree sujo, branch compartilhada, base diferente de `develop` e nome protegido não produzem `BRANCH SETUP BLOCKED`. Preserve alterações existentes, limite o diff ao escopo e bloqueie somente a edição afetada por conflito concreto no conteúdo, sobrescrita ou atribuição que impeça preservação segura; explique a condição ao humano. Não exija resolver todo o trabalho anterior para continuar.

STANDARD/STRICT mantêm ID Plane, especificação, critérios de aceite e gates aplicáveis. A rastreabilidade usa ID nos artefatos e registra a branch observada, sem exigir ID no nome da branch. Git Flow e proteções remotas são administrados por Maycon; este ajuste não altera configurações do GitHub nem ativa publicação.

## Estados e autoridade decisória

- `ACCEPTED`: decisão validada pelo responsável.
- `AGENT-PROVISIONAL`: escolha autônoma justificada, ainda não aprovada por humano.
- `NEEDS-HUMAN-DECISION`: escolha bloqueada por evidência insuficiente, alternativas equilibradas ou condição ASK-FIRST.
- `REJECTED`: alternativa ou decisão rejeitada, sem apagar histórico.
- `SUPERSEDED`: decisão substituída e vinculada à sucessora.

Aplicar a matriz e o processo de [AUTONOMY-POLICY.md](AUTONOMY-POLICY.md). A existência de `AGENT-PROVISIONAL` permite `READY FOR HUMAN DECISION REVIEW`; não equivale a gate aprovado.

## Gates e autoridade

Aplicar o [HUMAN INTERACTION CONTRACT](HUMAN-INTERACTION-CONTRACT.md) em toda conversa conduzida pelo harness. DISCOVERY, DECISION e EXECUTION regulam comunicação, sem substituir classificação, estados ou gates. Antes de pedir decisão, explicar origem, estado, opções, recomendação e impacto; uma dependência técnica não herda autorização de instalação. Antes de `READY FOR IMPLEMENTATION`, verificar compreensão do comportamento e dos critérios de aceite, decisões discutidas, perguntas importantes respondidas e ausência de suposições silenciosas de produto. Registrar evidências na revisão existente, sem criar gate adicional.

- Amanda aprova domínio e aceite funcional.
- Maycon é Product Owner, responsável técnico, administrador e aprovador técnico.
- Mudança de escopo ou decisão relevante de produto requer aprovação conjunta. Análise, especificação e planejamento podem avançar com decisões técnicas provisórias permitidas pela política de autonomia.
- A leitura do Plane é permitida automaticamente para o fluxo. A escrita fica autorizada somente no contrato controlado de `$webfit-task`: criar um único Work Item para uma nova demanda STANDARD/STRICT explicitamente iniciada e sincronizar apenas esse item nos gates previstos. Fora desse contrato, operações Plane continuam ASK-FIRST. Nenhuma ferramenta externa abre PR ou envia dados fora do escopo autorizado.

## Plane como gestão operacional

O Work Item Plane identifica e acompanha a demanda, mas não substitui requisitos, regras, ADRs, arquitetura, Specification, Plan, Tasks ou Evidence. O ID Plane é a chave de rastreabilidade operacional entre Plane, branch, Spec Kit, artefatos e Evidence.

Uma divergência entre Plane e documentação canônica deve ser registrada como `PLANE / SOURCE-OF-TRUTH MISMATCH`; a fonte canônica prevalece e não deve ser sobrescrita automaticamente.

O contrato detalhado de leitura, escrita controlada, estados, módulos, prioridade, bloqueio e modo degradado está em [integrations/plane.md](integrations/plane.md).

## Retenção de evidência

Evidence Reports devem apontar requisito, versão/commit quando houver, comandos, ambiente, resultados, findings, riscos residuais, itens não verificados e o resumo `Agent Decisions`. Não incluir dados reais ou secrets.
