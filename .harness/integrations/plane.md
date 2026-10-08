# Plane

Status: **ACTIVE**

- **Papel:** camada de gestão do trabalho.
- **MCP:** ACTIVE
- **Auth:** OAuth
- **Read:** VALIDATED
- **Write policy:** CONTROLLED
- **Projeto:** WebFit (`WEBFIT`)
- **Project ID:** `70107c4a-e367-46d6-a853-5f11ada706fc`
- **Ativação:** nenhum Work Item foi criado nesta integração.

## Limite de autoridade

Plane é responsável por identificação da demanda, backlog, prioridade, módulo, responsável, estado operacional e acompanhamento. Não é fonte canônica para requisitos detalhados, regras de negócio, ADRs, arquitetura, Specification, Plan, Tasks técnicas ou Evidence.

As fontes canônicas continuam em `docs/`, ADRs, Decisions Register, Spec Kit e harness. Se houver divergência, registrar `PLANE / SOURCE-OF-TRUTH MISMATCH` e preservar a fonte canônica; nunca alterar requisitos para coincidir com implementação ou Plane.

## Identidade e rastreabilidade

Toda demanda real STANDARD ou STRICT possui um Work Item Plane. Seu identificador humano, como `WEBFIT-12`, é usado na cadeia:

```text
Plane → registro em specs/ → quatro fases → Evidence no Code Review (branch atual registrada)
```

Registro da demanda e evidência referenciam o mesmo ID e branch atual; artefatos Spec Kit válidos são reutilizados. DEC-054 dispensa ID no nome da branch e nova branch por demanda; Git fica sob controle de Maycon.

## Entrada pelo `$webfit-task`

### Work Item existente

Para `$webfit-task WEBFIT-12`, o fluxo deve consultar o Plane em modo de leitura, localizar o item e ler apenas o necessário: título, descrição resumida, estado, prioridade e módulo. Depois deve localizar as fontes canônicas relacionadas e continuar pelo harness. Plane não substitui a investigação documental.

### Nova demanda

Para `$webfit-task Quero corrigir ...` ou `$webfit-task Nova demanda: ...`, a invocação explícita autoriza as quatro fases no escopo, sem confirmação adicional por sincronização:

1. intake e classificação LIGHT/STANDARD/STRICT;
2. para STANDARD ou STRICT, buscar item correspondente e reutilizar; se inexistente, criar **um único** Work Item WebFit com ID antes dos artefatos formais;
3. estado inicial apropriado;
4. associação de módulo somente com evidência suficiente;
5. atualização do mesmo item nas fases/decisões previstas, sem criar estados/gates extras.

Essa autorização não permite excluir, arquivar, alterar outra demanda, modificar arbitrariamente prioridade humana, criar itens extras, criar ciclos, alterar configuração do projeto, estados, módulos, membros ou compromissos.

Demandas LIGHT não exigem Work Item por padrão; se a execução evoluir para comportamento material, reclassificar e aplicar a política correspondente.

## Estados

| Gate/fase | Estado Plane |
|---|---|
| Discovery / Plan | `Planning` |
| Plan com decisão humana necessária | `Decision Review` |
| PLAN APPROVED BY SCOPE, antes do início imediato | `Ready for Implementation` |
| Execução iniciada dentro do escopo autorizado | `In Progress` |
| Checks internos do Code Review | `Verification` |
| Passagem independente do Code Review / READY TO SHIP aguardando aceite | `Review` |
| Review com CHANGES REQUIRED | `In Progress` ou `Verification`, conforme a correção |
| `BLOCKED` | `Blocked` |
| Aprovação humana final concluída | `Done` |
| Demanda abandonada explicitamente pelo humano | `Cancelled` |

`READY TO SHIP` nunca vira `Done` automaticamente. Só a aprovação humana final permite `Done`.

Quando o lote de decisões `AGENT-PROVISIONAL` for validado, retornar a `Planning` se a demanda ainda estiver em planejamento; se Plan completo e Scope Check passar, iniciar Execução sem gate genérico. Decisões não bloqueantes podem aguardar validação em lote no aceite final.

Estado inicial: LIGHT usa `Backlog` ou `Planning` conforme o trabalho já tenha começado; STANDARD/STRICT usa `Planning` ao iniciar análise real.

## Módulos e prioridade

- `Fundação`: arquitetura, spike, setup, infraestrutura, segurança-base, persistência, banco e tooling.
- `Incremento 1`: funcionalidades do MVP atual.
- `Futuro`: funcionalidades explicitamente fora do primeiro incremento.

Sem evidência suficiente, deixar sem módulo ou registrar decisão provisória de baixo impacto conforme DEC-038; não adivinhar.

Prioridade humana existente deve ser preservada. Nova demanda sem prioridade usa default/neutra quando permitido; não inventar prioridade `high` ou `urgent`.

## Conteúdo e sincronização

O Work Item deve ser curto:

```markdown
## Objetivo
Resumo objetivo da demanda.

## Source of Truth
Links/caminhos dos documentos relevantes, quando existirem.

## Engineering
Classification: LIGHT / STANDARD / STRICT
Registro: task.md ou artefatos existentes quando persistentes
Branch: branch atual observada
```

Não copiar Specification, Plan, Tasks ou Evidence completos. Atualizações autorizadas ficam limitadas ao Work Item atual: estado, associação de módulo, branch, caminho da Spec, nota curta de bloqueio e nota curta de conclusão/evidence.

Ao entrar em `Blocked`, registrar somente motivo resumido, gate bloqueante e próxima ação necessária. Ao resolver, retornar ao estado correspondente à fase real.

## Política de leitura e falha

Leitura de projeto, Work Item, estado, módulo e metadata necessária ao fluxo é automática. Operações humanas-only incluem excluir, arquivar, cancelar sem pedido humano, modificar outras demandas, bulk update, criar ciclo, alterar configuração, estados, módulos ou membros e mudar prioridade ou datas relevantes.

Se o MCP Plane estiver indisponível, registrar `PLANE SYNC DEGRADED`. Com Work Item/ID conhecido, continuar quando for seguro e registrar sincronização pendente. Se uma nova demanda STANDARD/STRICT exigir novo ID e não for possível criá-lo, registrar `PLANE ID REQUIRED` e parar antes de criar artefatos da demanda.

Não fazer chamadas de escrita durante a ativação desta integração. O contrato passa a valer somente em uma execução real de `$webfit-task` explicitamente iniciada.
