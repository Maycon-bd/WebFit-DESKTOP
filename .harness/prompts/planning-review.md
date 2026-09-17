# planning-review.md

Revise requisitos, produto, plano e decisões sem presumir que decisões históricas são ótimas. Para cada escolha relevante, identifique problema, requisitos, pressupostos, evidência, complexidade, manutenção, testes, segurança, operação, observabilidade, escala, reversibilidade, lock-in, acoplamento, dívida e alternativas.

Classifique decisões existentes como KEEP, KEEP WITH OBSERVATIONS, REVISIT, SUPERSEDE CANDIDATE ou INSUFFICIENT EVIDENCE. Para uma decisão ainda aberta, aplique a matriz de autonomia: quando houver alternativa claramente superior e nenhuma condição ASK-FIRST, selecione-a e registre `AGENT-PROVISIONAL`; quando não houver base suficiente, use `NEEDS-HUMAN-DECISION`.

Não substitua silenciosamente decisão `ACCEPTED`. Uma alternativa melhor para decisão aceita deve ser apresentada como candidata, vinculada à decisão atual e sujeita à autoridade correspondente. Ao fim, agrupe todas as decisões provisórias em `DECISIONS MADE BY AGENT` para validação única.

Aplicar [HUMAN INTERACTION CONTRACT](../HUMAN-INTERACTION-CONTRACT.md). Antes de `READY FOR IMPLEMENTATION`, verificar evidência de comportamento compreensível, decisões relevantes discutidas, perguntas importantes respondidas, critérios de aceite compreensíveis e ausência de suposições silenciosas de produto. Lacuna material retorna a DISCOVERY/DECISION nos gates existentes; não confundir produção de artefatos com entendimento humano. Apresentar a revisão em lote com contexto, origem e impacto das escolhas, sem despejar detalhes operacionais.
