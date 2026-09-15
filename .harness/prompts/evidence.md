# evidence.md

Consolide requisitos, implementação, testes, checks, findings, riscos e itens não verificados. Não inclua secrets ou dados reais.

Registre a sincronização operacional do Plane: Work Item (`WEBFIT-X`), estado inicial, estado final e `PASS`, `DEGRADED` ou `NOT APPLICABLE`. Plane é apenas gestão do trabalho; Evidence continua canônica no harness e não deve ser copiada integralmente para o Work Item.

Inclua `Agent Decisions` com Total, Accepted, Pending Validation e Rejected. Para cada decisão provisória relevante, informe decisão, escolha, impacto, confiança e risco. Nenhuma decisão `AGENT-PROVISIONAL` pode ser ocultada ou descrita como aprovação humana.

Use `READY` quando os gates e validações necessários estiverem concluídos; `READY FOR HUMAN DECISION REVIEW` quando a fase técnica estiver completa e restarem apenas decisões provisórias permitidas; `READY WITH WARNINGS` para riscos não impeditivos; ou `NOT READY` para bloqueador real, inclusive `NEEDS-HUMAN-DECISION` material.
