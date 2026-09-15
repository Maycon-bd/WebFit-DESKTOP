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

## Proteção de branches

A convenção canônica permanece DEC-010 e [docs/project/git-workflow.md](../docs/project/git-workflow.md): `main` e `develop` são permanentes; `feature/<id>-<resumo>` nasce de `develop`; `hotfix/<id>-<resumo>` nasce de `main` somente no caso aprovado. `main`, `master`, `develop` e qualquer outro ramo protegido definido pelo projeto não recebem diretamente alterações versionáveis de demandas reais STANDARD ou STRICT.

Antes da primeira escrita versionável da demanda, `$project-task` deve identificar branch atual, branch já associada, estado do worktree, ID rastreável, slug e base correta. Para `feature/`, o ID, critérios de aceite e status aprovado exigidos pela política canônica devem existir; se ainda não existirem, o fluxo permanece em intake somente leitura e para como `BRANCH SETUP BLOCKED` antes de criar Specification ou outros arquivos.

Criar ou selecionar branch exclusivamente local é operação autônoma, reversível e sem efeito externo quando o worktree estiver seguro. Se `develop` não existir localmente, mas `origin/develop` já existir como referência remota conhecida, é permitido criar o tracking local sem executar fetch ou push. Base ausente, divergente ou sem origem comprovada bloqueia o setup.

Com worktree sujo, continuar somente quando a branch atual já estiver associada à demanda ou quando todas as alterações puderem ser atribuídas com segurança à mesma demanda e a criação local preservar a base correta. Alteração não relacionada, atribuição incerta, conflito potencial ou necessidade de stash/reset/clean resulta em `BRANCH SETUP BLOCKED`. Nunca apagar, sobrescrever, resetar ou esconder mudanças automaticamente.

Demandas LIGHT puramente documentais podem permanecer na branch atual quando a política Git permitir. Se produzirem código ou mudança material, devem ser reclassificadas ou passar pela mesma proteção.

Branch local não concede Implementation Approval, Sensitive Change Approval ou Final Approval. Push, PR, merge, tag, release e deploy continuam operações humanas ou explicitamente autorizadas.

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
- A leitura do Plane é permitida automaticamente para o fluxo. A escrita fica autorizada somente no contrato controlado de `$project-task`: criar um único Work Item para uma nova demanda STANDARD/STRICT explicitamente iniciada e sincronizar apenas esse item nos gates previstos. Fora desse contrato, operações Plane continuam ASK-FIRST. Nenhuma ferramenta externa abre PR ou envia dados fora do escopo autorizado.

## Plane como gestão operacional

O Work Item Plane identifica e acompanha a demanda, mas não substitui requisitos, regras, ADRs, arquitetura, Specification, Plan, Tasks ou Evidence. O ID Plane é a chave de rastreabilidade operacional entre Plane, branch, Spec Kit, artefatos e Evidence.

Uma divergência entre Plane e documentação canônica deve ser registrada como `PLANE / SOURCE-OF-TRUTH MISMATCH`; a fonte canônica prevalece e não deve ser sobrescrita automaticamente.

O contrato detalhado de leitura, escrita controlada, estados, módulos, prioridade, bloqueio e modo degradado está em [integrations/plane.md](integrations/plane.md).

## Retenção de evidência

Evidence Reports devem apontar requisito, versão/commit quando houver, comandos, ambiente, resultados, findings, riscos residuais, itens não verificados e o resumo `Agent Decisions`. Não incluir dados reais ou secrets.
