# Loop Engineering — política

Loops persistentes/scheduler estão PREPARED — NOT ACTIVE. Autocorreção interna na Execução/Code Review, dentro do Plan e com limite, não é automação agendada. Se ativados por decisão humana específica, devem seguir [AUTONOMY-POLICY.md](../AUTONOMY-POLICY.md).

## Papéis

- Maker: executa a alteração aprovada e decisões locais permitidas.
- Verifier: executa checks, compara critérios de aceite com evidência e verifica pressupostos provisórios.
- Reviewer: procura problemas e decisões ocultas de forma independente.
- State: mantém estado não sensível com requisito, etapa, tentativas, checks, findings e IDs de decisões.

## Ciclo

DISCOVERY → PLAN → EXECUÇÃO → CODE REVIEW; correções internas retornam à execução/revisão afetadas, sem fase extra.

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

Limite: três ciclos sem convergência por problema; depois registrar tentativas/causa e solicitar decisão necessária. Sem agendamento/loops persistentes.
