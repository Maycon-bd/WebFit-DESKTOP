# Loop Engineering — política

Loops autônomos estão PREPARED — NOT ACTIVE porque o projeto ainda está em planejamento e não há código para verificar.

## Papéis
- Maker: executa somente a alteração aprovada.
- Verifier: executa checks e compara critérios de aceite com evidência.
- Reviewer: procura problemas de forma independente.
- State: estado persistente não sensível, com requisito, etapa, tentativas, checks e findings.

## Ciclo
DISCOVER → SPECIFY → PLAN → MAKE → VERIFY → REVIEW → FIX ↺ CONVERGED → EVIDENCE

## Stop conditions
Parar quando critérios de aceite estiverem comprovados, verificações obrigatórias passarem, nenhum finding impeditivo permanecer e o Evidence Report puder ser produzido.

Parar imediatamente e escalar para humano diante de decisão de negócio, mudança arquitetural não aprovada, dependência nova, migration/schema, risco de segurança, acesso sensível ou limite de tentativas.

Limite inicial: no máximo 3 ciclos de correção automática por mudança; depois disso, exigir decisão humana. Não agendar loops nesta fase.