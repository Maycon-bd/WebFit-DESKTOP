# planning-review.md

Revise requisitos, produto, plano e decisões sem presumir que decisões históricas são ótimas. Para cada escolha relevante, identifique problema, requisitos, pressupostos, evidência, complexidade, manutenção, testes, segurança, operação, observabilidade, escala, reversibilidade, lock-in, acoplamento, dívida e alternativas.

Classifique decisões existentes como KEEP, KEEP WITH OBSERVATIONS, REVISIT, SUPERSEDE CANDIDATE ou INSUFFICIENT EVIDENCE. Para uma decisão ainda aberta, aplique a matriz de autonomia: quando houver alternativa claramente superior e nenhuma condição ASK-FIRST, selecione-a e registre `AGENT-PROVISIONAL`; quando não houver base suficiente, use `NEEDS-HUMAN-DECISION`.

Não substitua silenciosamente decisão `ACCEPTED`. Uma alternativa melhor para decisão aceita deve ser apresentada como candidata, vinculada à decisão atual e sujeita à autoridade correspondente. Ao fim, agrupe todas as decisões provisórias em `DECISIONS MADE BY AGENT` para validação única.