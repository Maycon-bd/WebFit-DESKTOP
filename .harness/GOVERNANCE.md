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
| Registro navegável e ledger | .harness/knowledge/DECISIONS-REGISTER.md; decisão canônica permanece em docs/ ou ADR aplicável |
| Gestão de trabalho | Plane, quando conectado |
| Navegação de conhecimento | Obsidian sobre este workspace |
| Integrações | MCP e documentação em .harness/integrations/ |
| UI/UX | docs/ux/ + decisões de produto + Impeccable quando ativo |
| Segurança | threat model + revisão/Mantis quando aplicável |
| Verificação | prompts/verification.md + evidências |
| Review | prompts/review.md + registro independente |
| Evidência final | Evidence Report em .harness/evidence/ |
| Automação futura | .harness/loops/ |

Auxiliares nunca publicam requisitos ou decisões concorrentes.

Em caso de conflito, prevalecem: decisão humana `ACCEPTED`; ADR `ACCEPTED`; requisito ou documentação canônica aprovada; Constitution; Specification/Plan/Tasks da feature; código; evidência. AGENTS.md e o harness governam a condução do trabalho, sem substituir conteúdo canônico. Conflitos devem ser expostos e resolvidos na fonte competente. Ver [integrations/spec-kit.md](integrations/spec-kit.md).

## Níveis de mudança

### LIGHT

Correção documental ou alteração trivial sem comportamento, arquitetura, dados ou integração externa. Exige fonte, revisão de links e registro breve de evidência.

### STANDARD

Feature, bug, fluxo de UI, endpoint ou regra comum sem condição STRICT. Exige requisito aprovado e uso proporcional de Specification, Plan, Tasks e Analyze antes do gate; após aprovação, implementação, testes, Converge, Verification, Review, documentação e Evidence Report.

### STRICT

Arquitetura, autenticação, autorização, dados sensíveis, financeiro, migração/schema, arquivos, backup, infraestrutura, dependência nova ou integração externa. Exige ADR/spike quando aplicável, aprovação humana prévia e gates especializados.

O nível STRICT não elimina análise autônoma: o agente pode comparar e recomendar alternativas, mas condições ASK-FIRST não podem ser executadas com base apenas em `AGENT-PROVISIONAL`.

## Estados e autoridade decisória

- `ACCEPTED`: decisão validada pelo responsável.
- `AGENT-PROVISIONAL`: escolha autônoma justificada, ainda não aprovada por humano.
- `NEEDS-HUMAN-DECISION`: escolha bloqueada por evidência insuficiente, alternativas equilibradas ou condição ASK-FIRST.
- `REJECTED`: alternativa ou decisão rejeitada, sem apagar histórico.
- `SUPERSEDED`: decisão substituída e vinculada à sucessora.

Aplicar a matriz e o processo de [AUTONOMY-POLICY.md](AUTONOMY-POLICY.md). A existência de `AGENT-PROVISIONAL` permite `READY FOR HUMAN DECISION REVIEW`; não equivale a gate aprovado.

## Gates e autoridade

- Amanda aprova domínio e aceite funcional.
- Maycon é Product Owner, responsável técnico, administrador e aprovador técnico.
- Mudança de escopo ou decisão relevante de produto requer aprovação conjunta. Análise, especificação e planejamento podem avançar com decisões técnicas provisórias permitidas pela política de autonomia.
- Nenhuma ferramenta externa cria work item, altera estado, abre PR ou envia dados sem autorização explícita.

## Retenção de evidência

Evidence Reports devem apontar requisito, versão/commit quando houver, comandos, ambiente, resultados, findings, riscos residuais, itens não verificados e o resumo `Agent Decisions`. Não incluir dados reais ou secrets.
