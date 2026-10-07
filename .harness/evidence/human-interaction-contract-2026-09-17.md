# Evidence — HUMAN INTERACTION CONTRACT

- Data: 2026-09-17.
- Status: HUMAN INTERACTION CONTRACT READY.
- Fonte e autorização: solicitação humana desta tarefa, itens 1–13; somente harness.
- Classificação: LIGHT, alteração documental de interação sem mudança de produto, arquitetura, dados ou integração. Specification/Plan/Tasks de feature não se aplicam; não há implementação. Plane: NOT APPLICABLE; nenhum Work Item criado ou sincronizado.
- Branch preservada: `feature/pbi-001-primeiro-incremento-saude`; commit-base `28d46b6a8ddca9960862b1c5868760ad3e414775`. Branch Safety STANDARD/STRICT não se aplica ao ajuste documental LIGHT; não houve troca, commit, push, PR ou deploy.

## Resultado

Contrato central em [HUMAN-INTERACTION-CONTRACT.md](../HUMAN-INTERACTION-CONTRACT.md), integrado à [skill local](../../.agents/skills/webfit-task/SKILL.md), governança, autonomia, README, integração local Spec Kit e prompts de intake, plan, planning-review, architecture-review, implementation e review. Preservadas as skills oficiais. Link atualizado em 2026-09-30 pela renomeação de `project-task`; o relato histórico abaixo permanece original.

Foram incorporados modos internos DISCOVERY/DECISION/EXECUTION, perguntas relacionadas em rodadas, contexto antes de decisão, labels de proveniência, cadeia de origem, fronteira detalhe técnico/comportamento de produto, checagem de compreensão antes de READY FOR IMPLEMENTATION e saída humana proporcional. Protocolos de perguntas das skills oficiais permanecem próprios; o harness fornece contexto sem alterá-los.

## Revisão de consistência e cenários

| Cenário documental | Resultado esperado e verificado nas instruções |
|---|---|
| Nome interno reversível, dentro do comportamento aprovado | AUTO/AGENT-PROVISIONAL pela matriz; sem pergunta desnecessária. |
| Estado vazio que pode mudar o significado da experiência | Recuperar definições existentes; discovery das lacunas importantes antes de consolidar. |
| Dependência técnica decorrente de escolha para spike | Expor cadeia e limite da aprovação; DEPENDENCY não autoriza instalar. |
| Decisões técnicas provisórias permitidas | Continuar planejamento e validar em lote; não converter em ACCEPTED silenciosamente. |
| Artefatos completos com suposição silenciosa sobre produto | Retornar a discovery/decisão antes de READY FOR IMPLEMENTATION. |
| Execução já autorizada | Relato breve de ação, resultado, evidência, problema e próximo passo. |

DEC-038 mantém matriz confiança × impacto, estados, ASK-FIRST e validação em lote. Branch Safety e os quatro human gates existentes permanecem; modo de interação não é gate nem autorização. Revisão documental realizada pelo mesmo agente em etapa separada da edição; não houve avaliação por outro agente nem teste de uma conversa futura real.

## Validação e limites

- `git diff --check`: PASS (sem erro de whitespace).
- Revisão de diff, referências locais e preservação textual da matriz/gates: executada nesta tarefa.
- Nenhuma dependência instalada, implementação criada, requisito alterado ou skill oficial Spec Kit modificada nesta tarefa.
- G4 não continuado; Rust/Cargo aparecem somente como exemplo de comunicação baseado no caso relatado pelo usuário, sem nova inspeção do ambiente ou instalação.
- Não há testes executáveis, lint, TypeScript, frontend, Rust, integração SQLite ou build Tauri aplicáveis ao ajuste documental; nenhum comando desses foi criado ou executado.
- Falhas técnicas de ACL do sandbox exigiram executar edições documentais autorizadas fora do sandbox; não houve rejeição de autorização pela revisão automática.

## Trabalho preexistente e questões abertas

Antes da edição já existiam alterações em `.obsidian/workspace.json`, `docs/project/decision-log.md`, `docs/project/status.md`, além de `.codex/` e `specs/` não rastreados. Foram preservadas; não atribuir esses diffs a esta tarefa. Todas as escritas desta tarefa se limitam ao harness e à skill local `project-task`.

Há divergências preexistentes entre resumos antigos de G2/decisões provisórias em `.harness/PROJECT-STATE.md` e no ledger e o checkpoint/decision-log atuais, além de uma Próxima ação exata antiga dentro do próprio checkpoint. Foram observadas, não reconciliadas: a solicitação restringe esta tarefa ao contrato e proíbe continuar G4 ou alterar requisitos. Nenhum gate foi reavaliado/aprovado aqui. A próxima retomada de produto precisará conferir as fontes canônicas antes de agir.

## Agent Decisions

- Decisões materiais autônomas: 0; Accepted: 0; Pending Validation: 0; Rejected: 0.
- O contrato decorre da instrução humana explícita. Organização em documento central e links é detalhe documental local, de baixo impacto e reversível, registrado neste diff; não cria aprovação de produto.
- Última etapa: contrato integrado e revisão documental concluída. Próxima ação desta tarefa: apresentar exemplo ilustrativo Rust/Cargo e validação, sem executar G4. Aprovação de commit/PR/release não concedida nem solicitada.
