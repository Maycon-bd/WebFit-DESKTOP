# Loop Engineering — política

Loops autônomos estão PREPARED — NOT ACTIVE porque o projeto ainda está em planejamento e não há código para verificar. Quando ativados por decisão própria, devem seguir [AUTONOMY-POLICY.md](../AUTONOMY-POLICY.md).

## Papéis

- Maker: executa a alteração aprovada e decisões locais permitidas.
- Verifier: executa checks, compara critérios de aceite com evidência e verifica pressupostos provisórios.
- Reviewer: procura problemas e decisões ocultas de forma independente.
- State: mantém estado não sensível com requisito, etapa, tentativas, checks, findings e IDs de decisões.

## Ciclo

DISCOVER → SPECIFY → PLAN → MAKE → VERIFY → REVIEW → FIX ↺ CONVERGED → EVIDENCE

## Uso de decisões provisórias

O loop pode continuar com `AGENT-PROVISIONAL` quando a decisão:

- não é sensível nem condição ASK-FIRST;
- tem confiança suficiente para seu impacto;
- é reversível dentro do custo e risco aceitos;
- não contradiz decisão `ACCEPTED`;
- não amplia silenciosamente o escopo.

Registrar a decisão no ledger e acumular validações até o fim da fase. Não executar ação irreversível baseada apenas em decisão provisória.

## Stop conditions

Parar quando critérios de aceite estiverem comprovados, verificações obrigatórias passarem, nenhum finding impeditivo permanecer e o Evidence Report puder ser produzido.

Parar e escalar diante de `NEEDS-HUMAN-DECISION` que bloqueie materialmente o próximo passo, condição ASK-FIRST, limite de tentativas ou conflito com decisão aceita. A mera existência de `AGENT-PROVISIONAL` permitida não é condição de parada.

Limite inicial: no máximo 3 ciclos de correção automática por mudança; depois disso, exigir decisão humana. Não agendar ou ativar loops nesta fase.