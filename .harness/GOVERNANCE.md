# Governança do harness

## Source-of-truth matrix

| Informação | Fonte canônica |
|---|---|
| Visão de produto | documentação aprovada em docs/product/ |
| Regra de negócio | requisito/regra aprovada em docs/requirements/ |
| Decisão arquitetural | ADR em docs/architecture/adr/ |
| Feature | Spec Kit, quando inicializado e aprovado |
| Plano técnico | Spec Kit Plan |
| Tasks | Spec Kit Tasks |
| Contexto para agente | AGENTS.md |
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

## Níveis de mudança

### LIGHT

Correção documental ou alteração trivial sem comportamento, arquitetura, dados ou integração externa. Exige fonte, revisão de links e registro breve de evidência.

### STANDARD

Feature ou bug comum. Exige requisito aprovado, investigação, plano, implementação, testes, review, documentação e evidence report.

### STRICT

Arquitetura, autenticação, autorização, dados sensíveis, financeiro, migração/schema, arquivos, backup, infraestrutura, dependência nova ou integração externa. Exige ADR/spike quando aplicável, aprovação humana prévia e gates especializados.

## Gates e autoridade

- Amanda aprova domínio e aceite funcional.
- Maycon é Product Owner, responsável técnico, administrador e aprovador técnico.
- Mudança de escopo ou decisão relevante requer aprovação conjunta.
- Nenhuma ferramenta externa cria work item, altera estado, abre PR ou envia dados sem autorização explícita.

## Retenção de evidência

Evidence Reports devem apontar requisito, versão/commit quando houver, comandos, ambiente, resultados, findings, riscos residuais e itens não verificados. Não incluir dados reais ou secrets.